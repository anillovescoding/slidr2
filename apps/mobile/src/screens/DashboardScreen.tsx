import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator, Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Sparkles, ArrowRight, Layers, Layout, CheckCircle, Clock, LogOut } from 'lucide-react-native';
import { pb } from '../lib/pocketbase';
import { useAuthStore } from '../store/useAuthStore';
import { Theme } from '../lib/theme';

const { width } = Dimensions.get('window');

interface Carousel {
  id: string;
  title: string;
  status: 'draft' | 'completed';
  updated: string;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <View style={styles.statCardContainer}>
      <BlurView intensity={20} tint="light" style={styles.statBlur}>
        <View style={[styles.statIconBox, { backgroundColor: color + '20' }]}>
           <Icon size={18} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </BlurView>
    </View>
  );
}

function CarouselCard({ item, onPress }: { item: Carousel; onPress: () => void }) {
  const isDraft = item.status === 'draft';
  const date = new Date(item.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  return (
    <TouchableOpacity style={styles.projectCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.projectPreview}>
        <View style={styles.projectOverlay}>
           <View style={[styles.projectBadge, { backgroundColor: isDraft ? '#f59e0b20' : '#10b98120' }]}>
              <Text style={[styles.projectBadgeText, { color: isDraft ? '#f59e0b' : '#10b981' }]}>
                {isDraft ? 'DRAFT' : 'MASTER'}
              </Text>
           </View>
        </View>
        <Layers size={40} color="rgba(255,255,255,0.05)" style={styles.projectIcon} />
      </View>
      <View style={styles.projectMeta}>
        <Text style={styles.projectTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.projectFooter}>
          <Clock size={10} color={Theme.colors.muted} />
          <Text style={styles.projectDate}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function DashboardScreen({ navigation }: { navigation: any }) {
  const { user, logout } = useAuthStore();
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const displayName = (user?.name as string) || (user?.email as string)?.split('@')[0] || 'Genius';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const fetchData = useCallback(async () => {
    try {
      const records = await pb.collection('carousels').getFullList<Carousel>({
        filter: `user_id = "${pb.authStore.record?.id}"`,
        sort: '-updated',
      });
      setCarousels(records);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const recent = carousels.slice(0, 5);
  const draftCount = carousels.filter((c) => c.status === 'draft').length;
  const doneCount = carousels.filter((c) => c.status === 'completed').length;

  return (
    <ScrollView 
      style={styles.root} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />}
    >
      {/* Header Space for Transparent Header */}
      <View style={{ height: 100 }} />

      {/* Hero Welcome */}
      <View style={styles.header}>
        <View style={styles.welcomeBox}>
           <View style={styles.statusRow}>
              <Sparkles size={12} color={Theme.colors.primary} />
              <Text style={styles.dateText}>{today.toUpperCase()}</Text>
           </View>
           <Text style={styles.greeting}>Curating Excellence,</Text>
           <Text style={styles.name}>{displayName}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
           <LogOut size={18} color={Theme.colors.muted} />
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard label="Pipeline" value={carousels.length} icon={Layout} color={Theme.colors.primary} />
        <StatCard label="In Logic" value={draftCount} icon={Clock} color="#f59e0b" />
        <StatCard label="Verified" value={doneCount} icon={CheckCircle} color="#10b981" />
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recent Creations</Text>
            <View style={styles.titleLine} />
          </View>
          <TouchableOpacity 
            style={styles.seeAllBtn}
            onPress={() => navigation.navigate('Library')}
          >
            <Text style={styles.seeAll}>PROTOCOL</Text>
            <ArrowRight size={14} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={Theme.colors.primary} style={{ marginTop: 40 }} />
        ) : recent.length === 0 ? (
          <BlurView intensity={10} tint="light" style={styles.emptyContainer}>
            <Layers size={48} color={Theme.colors.muted} opacity={0.2} />
            <Text style={styles.emptyTitle}>Void Detected</Text>
            <Text style={styles.emptyText}>Initialize your first carousel sequence from the collections.</Text>
          </BlurView>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
            snapToInterval={width * 0.7 + 20}
            decelerationRate="fast"
          >
            {recent.map((item) => (
              <CarouselCard key={item.id} item={item} onPress={() => {}} />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Bottom Padding for Tab Bar */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Theme.colors.background },
  content: { paddingHorizontal: 24 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 40 
  },
  welcomeBox: { flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  dateText: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: Theme.colors.primary, 
    letterSpacing: 2 
  },
  greeting: { 
    fontSize: 28, 
    fontWeight: '300', 
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: -1
  },
  name: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#fff',
    letterSpacing: -1.5,
    marginTop: -4
  },
  logoutBtn: { 
    width: 48, 
    height: 48, 
    borderRadius: 16, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  statsGrid: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 48 
  },
  statCardContainer: { flex: 1, height: 120, borderRadius: 24, overflow: 'hidden' },
  statBlur: { flex: 1, padding: 16, justifyContent: 'space-between' },
  statIconBox: { 
    width: 32, 
    height: 32, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  statValue: { fontSize: 24, fontWeight: '900', color: '#fff', marginTop: 8 },
  statLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: 1 },
  
  section: { marginBottom: 32 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    marginBottom: 24,
    paddingHorizontal: 4
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: '#fff',
    letterSpacing: -0.5
  },
  titleLine: { 
    width: 30, 
    height: 3, 
    backgroundColor: Theme.colors.primary, 
    marginTop: 6,
    borderRadius: 2
  },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  seeAll: { 
    fontSize: 10, 
    color: Theme.colors.primary, 
    fontWeight: '900', 
    letterSpacing: 1 
  },
  
  horizontalScroll: { paddingRight: 40 },
  projectCard: { 
    width: width * 0.7, 
    marginRight: 20, 
    borderRadius: 32, 
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden'
  },
  projectPreview: { 
    height: 180, 
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  projectOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10
  },
  projectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  projectBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1
  },
  projectIcon: { position: 'absolute', opacity: 0.1 },
  projectMeta: { padding: 20 },
  projectTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 4 },
  projectFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  projectDate: { fontSize: 10, fontWeight: '700', color: Theme.colors.muted },

  emptyContainer: { 
    padding: 40, 
    borderRadius: 32, 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginTop: 8
  },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#fff', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 13, color: Theme.colors.muted, textAlign: 'center', lineHeight: 20 },
});
