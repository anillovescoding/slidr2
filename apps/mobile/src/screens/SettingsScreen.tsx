import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { 
  User, Settings as SettingsIcon, ShieldCheck, Cpu, Image as ImageIcon, Search, Info, LogOut, ChevronRight, Sparkles 
} from 'lucide-react-native';
import { useAuthStore } from '../store/useAuthStore';
import { Theme } from '../lib/theme';

const { width } = Dimensions.get('window');

interface ProviderInfo {
  label: string;
  description: string;
  url: string;
  icon: any;
}

const PROVIDERS: { group: string; icon: any; items: ProviderInfo[] }[] = [
  {
    group: 'AI Multi-Models',
    icon: Cpu,
    items: [
      { label: 'OpenAI',       description: 'GPT-4, DALL-E',         url: 'https://platform.openai.com/api-keys', icon: Cpu },
      { label: 'Anthropic',    description: 'Claude 3.5',            url: 'https://console.anthropic.com/settings/keys', icon: Cpu },
      { label: 'Google Gemini',description: 'Pro, Flash, Ultra',     url: 'https://aistudio.google.com/app/apikey', icon: Cpu },
      { label: 'Mistral AI',   description: 'Mistral Large',         url: 'https://console.mistral.ai/api-keys/', icon: Cpu },
    ],
  },
  {
    group: 'Visual Generation',
    icon: ImageIcon,
    items: [
      { label: 'Stability AI', description: 'Stable Diffusion 3',    url: 'https://platform.stability.ai/account/keys', icon: ImageIcon },
      { label: 'Replicate',    description: 'Flow Synthesis',        url: 'https://replicate.com/account/api-tokens', icon: ImageIcon },
    ],
  },
  {
    group: 'Global Assets',
    icon: Search,
    items: [
      { label: 'Pexels',       description: 'Free stock photos',     url: 'https://www.pexels.com/api/', icon: ImageIcon },
      { label: 'Pixabay',      description: 'Free images & videos',  url: 'https://pixabay.com/api/docs/', icon: ImageIcon },
      { label: 'Unsplash',     description: 'Premium free photos', url: 'https://unsplash.com/developers', icon: ImageIcon },
    ],
  },
];

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const displayName = (user?.name as string) || (user?.email as string)?.split('@')[0] || 'Genius';

  const handleProviderPress = (url: string, label: string) => {
    Alert.alert('Protocol Routing', `Redirecting to ${label} neural dashboard. Please configure keys via the terminal (Web Interface).`, [
      { text: 'EXECUTE REDIRECT', onPress: () => Linking.openURL(url) },
      { text: 'ABORT', style: 'cancel' },
    ]);
  };

  return (
    <ScrollView 
      style={styles.root} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Space */}
      <View style={{ height: 100 }} />

      {/* Profile Header */}
      <View style={styles.profileHeader}>
         <View style={styles.avatarContainer}>
            <View style={styles.avatarGlow} />
            <BlurView intensity={30} tint="light" style={styles.avatar}>
               <Text style={styles.avatarText}>{displayName[0].toUpperCase()}</Text>
            </BlurView>
         </View>
         <View style={styles.profileMeta}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{user?.email as string}</Text>
         </View>
         <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <LogOut size={16} color="#ef4444" />
         </TouchableOpacity>
      </View>

      {/* API Protocol Info */}
      <View style={styles.infoCardContainer}>
        <BlurView intensity={10} tint="light" style={styles.infoCard}>
           <View style={styles.infoIconBox}>
              <ShieldCheck size={18} color={Theme.colors.primary} />
           </View>
           <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Neural Synchronization</Text>
              <Text style={styles.infoText}>
                API credentials must be calibrated in the web mainframe. Select a node to retrieve authentication tokens.
              </Text>
           </View>
        </BlurView>
      </View>

      {/* Provider groups */}
      {PROVIDERS.map(({ group, icon: GroupIcon, items }) => (
        <View key={group} style={styles.group}>
          <View style={styles.groupHeader}>
             <GroupIcon size={12} color={Theme.colors.muted} />
             <Text style={styles.groupTitle}>{group.toUpperCase()}</Text>
          </View>
          
          <View style={styles.groupCardContainer}>
            <BlurView intensity={10} tint="light" style={styles.groupCard}>
              {items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.providerRow, idx < items.length - 1 && styles.providerBorder]}
                  onPress={() => handleProviderPress(item.url, item.label)}
                  activeOpacity={0.6}
                >
                  <View style={styles.providerLeft}>
                    <Text style={styles.providerLabel}>{item.label}</Text>
                    <Text style={styles.providerDesc}>{item.description}</Text>
                  </View>
                  <ChevronRight size={16} color={Theme.colors.muted} opacity={0.4} />
                </TouchableOpacity>
              ))}
            </BlurView>
          </View>
        </View>
      ))}

      <View style={styles.footer}>
         <Sparkles size={16} color={Theme.colors.muted} opacity={0.2} />
         <Text style={styles.version}>SLIDR ARCHITECTURE V2.0.1</Text>
      </View>
      
      {/* Bottom Padding */}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Theme.colors.background },
  content: { paddingHorizontal: 24 },
  
  profileHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 20,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  avatarContainer: { position: 'relative' },
  avatarGlow: {
    position: 'absolute',
    top: -4, left: -4, right: -4, bottom: -4,
    borderRadius: 24,
    backgroundColor: Theme.colors.primary,
    opacity: 0.2
  },
  avatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  avatarText: { fontSize: 24, fontWeight: '900', color: '#fff' },
  profileMeta: { flex: 1, marginLeft: 16 },
  profileName: { fontSize: 18, fontWeight: '900', color: '#fff' },
  profileEmail: { fontSize: 13, color: Theme.colors.muted, marginTop: 2, fontWeight: '600' },
  logoutBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  infoCardContainer: { borderRadius: 24, overflow: 'hidden', marginBottom: 32 },
  infoCard: { padding: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  infoIconBox: { 
    width: 40, 
    height: 40, 
    borderRadius: 14, 
    backgroundColor: Theme.colors.primary + '15',
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: '800', color: '#fff', marginBottom: 6 },
  infoText: { fontSize: 13, color: Theme.colors.muted, lineHeight: 20, fontWeight: '500' },

  group: { marginBottom: 32 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, paddingLeft: 4 },
  groupTitle: { fontSize: 10, fontWeight: '900', color: Theme.colors.muted, letterSpacing: 2 },
  groupCardContainer: { borderRadius: 24, overflow: 'hidden' },
  groupCard: { backgroundColor: 'rgba(255,255,255,0.03)' },
  providerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 18 },
  providerBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  providerLeft: { flex: 1 },
  providerLabel: { fontSize: 15, fontWeight: '800', color: '#fff' },
  providerDesc: { fontSize: 12, color: Theme.colors.muted, marginTop: 4, fontWeight: '500' },

  footer: { paddingVertical: 40, alignItems: 'center', gap: 12 },
  version: { fontSize: 9, fontWeight: '900', color: Theme.colors.muted, letterSpacing: 4, opacity: 0.3 },
});
