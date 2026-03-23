import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react-native';
import { pb } from '../lib/pocketbase';
import { useAuthStore } from '../store/useAuthStore';
import { Theme } from '../lib/theme';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Protocol Error', 'Authentication requires both identity and passcode.');
      return;
    }
    setLoading(true);
    try {
      const auth = await pb.collection('users').authWithPassword(email.trim(), password);
      login(auth.record as Record<string, unknown>);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      Alert.alert('Access Denied', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* Background Orbs (Visual flair) */}
      <View style={[styles.orb, { top: -100, right: -100, backgroundColor: Theme.colors.primary }]} />
      <View style={[styles.orb, { bottom: -150, left: -150, backgroundColor: Theme.colors.accent, width: 400, height: 400 }]} />

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
           <View style={styles.logoBox}>
              <Sparkles size={32} color="#fff" />
           </View>
           <Text style={styles.title}>SLIDR 2.0</Text>
           <Text style={styles.subtitle}>INITIALIZE NEURAL INTERFACE</Text>
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
                 <Text style={styles.label}>PASSCODE</Text>
                 <View style={styles.inputWrapper}>
                    <Lock size={18} color={Theme.colors.muted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor={Theme.colors.muted + '40'}
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                    />
                 </View>
              </View>

              <TouchableOpacity 
                style={styles.btn} 
                onPress={handleLogin} 
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={styles.btnContent}>
                    <Text style={styles.btnText}>ESTABLISH CONNECTION</Text>
                    <ArrowRight size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigation.navigate('Signup')} 
                style={styles.linkRow}
                activeOpacity={0.7}
              >
                <Text style={styles.linkText}>
                  NO CREDENTIALS? <Text style={styles.link}>SIGNUP</Text>
                </Text>
              </TouchableOpacity>
           </BlurView>
        </View>
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
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  
  header: { alignItems: 'center', marginBottom: 48 },
  logoBox: { 
    width: 72, 
    height: 72, 
    borderRadius: 24, 
    backgroundColor: Theme.colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Theme.colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10
  },
  title: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#fff', 
    letterSpacing: -1 
  },
  subtitle: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: Theme.colors.muted, 
    letterSpacing: 3,
    marginTop: 8
  },

  cardContainer: { borderRadius: 32, overflow: 'hidden' },
  card: { padding: 32, backgroundColor: 'rgba(255,255,255,0.03)' },

  field: { marginBottom: 24 },
  label: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: Theme.colors.muted, 
    marginBottom: 10,
    letterSpacing: 2
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    height: 56
  },
  inputIcon: { marginRight: 12 },
  input: { 
    flex: 1, 
    fontSize: 15, 
    color: '#fff', 
    fontWeight: '600' 
  },

  btn: { 
    backgroundColor: Theme.colors.primary, 
    borderRadius: 18, 
    height: 60,
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: Theme.colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8
  },
  btnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 1 },

  linkRow: { marginTop: 24, alignItems: 'center' },
  linkText: { fontSize: 10, color: Theme.colors.muted, fontWeight: '800', letterSpacing: 1 },
  link: { color: Theme.colors.primary, fontWeight: '900' },
});
