import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView, Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Mail, Lock, Sparkles, UserPlus, ArrowRight } from 'lucide-react-native';
import { pb } from '../lib/pocketbase';
import { useAuthStore } from '../store/useAuthStore';
import { Theme } from '../lib/theme';

const { width, height } = Dimensions.get('window');

export default function SignupScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleSignup = async () => {
    if (!email.trim() || !password || !confirm) {
      Alert.alert('Protocol Error', 'Full registration sequence requires all data fields.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Parity Error', 'Security passcode strings do not match.');
      return;
    }
    setLoading(true);
    try {
      await pb.collection('users').create({ email: email.trim(), password, passwordConfirm: confirm });
      const auth = await pb.collection('users').authWithPassword(email.trim(), password);
      login(auth.record as Record<string, unknown>);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Signup failed.';
      Alert.alert('Initialization Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* Background Orbs */}
      <View style={[styles.orb, { top: -100, right: -100, backgroundColor: Theme.colors.primary }]} />
      <View style={[styles.orb, { bottom: -150, left: -150, backgroundColor: Theme.colors.accent, width: 400, height: 400 }]} />

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
             <View style={styles.logoBox}>
                <Sparkles size={32} color="#fff" />
             </View>
             <Text style={styles.title}>SLIDR 2.0</Text>
             <Text style={styles.subtitle}>START NEW NEURAL SEQUENCE</Text>
          </View>

          <View style={styles.cardContainer}>
             <BlurView intensity={20} tint="light" style={styles.card}>
                <View style={styles.field}>
                   <Text style={styles.label}>IDENTITY</Text>
                   <View style={styles.inputWrapper}>
                      <Mail size={18} color={Theme.colors.muted} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="neural-id@slidr.ai"
                        placeholderTextColor={Theme.colors.muted + '40'}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                      />
                   </View>
                </View>

                <View style={styles.field}>
                   <Text style={styles.label}>SECURITY PASSCODE</Text>
                   <View style={styles.inputWrapper}>
                      <Lock size={18} color={Theme.colors.muted} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Min. 8 characters"
                        placeholderTextColor={Theme.colors.muted + '40'}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                      />
                   </View>
                </View>

                <View style={styles.field}>
                   <Text style={styles.label}>VERIFY PASSCODE</Text>
                   <View style={styles.inputWrapper}>
                      <Lock size={18} color={Theme.colors.muted} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={Theme.colors.muted + '40'}
                        secureTextEntry
                        value={confirm}
                        onChangeText={setConfirm}
                      />
                   </View>
                </View>

                <TouchableOpacity 
                  style={styles.btn} 
                  onPress={handleSignup} 
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <View style={styles.btnContent}>
                      <Text style={styles.btnText}>INITIALIZE ACCOUNT</Text>
                      <UserPlus size={16} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => navigation.navigate('Login')} 
                  style={styles.linkRow}
                  activeOpacity={0.7}
                >
                  <Text style={styles.linkText}>
                    ALREADY REGISTERED? <Text style={styles.link}>SIGNIN</Text>
                  </Text>
                </TouchableOpacity>
             </BlurView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Theme.colors.background },
  orb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.15,
  },
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 60 },
  
  header: { alignItems: 'center', marginBottom: 40 },
  logoBox: { 
    width: 64, 
    height: 64, 
    borderRadius: 22, 
    backgroundColor: Theme.colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Theme.colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#fff', 
    letterSpacing: -1 
  },
  subtitle: { 
    fontSize: 9, 
    fontWeight: '900', 
    color: Theme.colors.muted, 
    letterSpacing: 2,
    marginTop: 6
  },

  cardContainer: { borderRadius: 32, overflow: 'hidden' },
  card: { padding: 28, backgroundColor: 'rgba(255,255,255,0.03)' },

  field: { marginBottom: 20 },
  label: { 
    fontSize: 9, 
    fontWeight: '900', 
    color: Theme.colors.muted, 
    marginBottom: 8,
    letterSpacing: 1.5
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    height: 52
  },
  inputIcon: { marginRight: 12 },
  input: { 
    flex: 1, 
    fontSize: 14, 
    color: '#fff', 
    fontWeight: '600' 
  },

  btn: { 
    backgroundColor: Theme.colors.primary, 
    borderRadius: 16, 
    height: 56,
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Theme.colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6
  },
  btnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },

  linkRow: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 9, color: Theme.colors.muted, fontWeight: '800', letterSpacing: 1 },
  link: { color: Theme.colors.primary, fontWeight: '900' },
});
