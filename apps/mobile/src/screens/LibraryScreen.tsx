import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, TextInput, Alert, Modal, Dimensions, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Layers, Search as SearchIcon, Plus, X, Trash2, Clock, Sparkles } from 'lucide-react-native';
import { pb } from '../lib/pocketbase';
import { Theme } from '../lib/theme';

const { width } = Dimensions.get('window');

interface Carousel {
  id: string;
  title: string;
  status: 'draft' | 'completed';
  updated: string;
}

const DEFAULT_SLIDE = { id: 'slide-1', background: '#ffffff', elements: [] };

export default function LibraryScreen() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'draft' | 'completed'>('all');
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleCreate = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    const userId = pb.authStore.record?.id;
    if (!userId) { Alert.alert('Unauthorized', 'Protocol initialization failed.'); return; }
    setCreating(true);
    try {
      await pb.collection('carousels').create({
        title: trimmed, status: 'draft', user_id: userId, slides_data: [DEFAULT_SLIDE],
      });
      setModalVisible(false);
      setNewTitle('');
      fetchData();
    } catch (err: unknown) {
      Alert.alert('System Error', err instanceof Error ? err.message : 'Failed to instantiate.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Purge Sequence', `Are you certain you wish to remove "${title}" from the neural archive?`, [
      { text: 'ABORT', style: 'cancel' },
      {
        text: 'PURGE', style: 'destructive', onPress: async () => {
          await pb.collection('carousels').delete(id);
          setCarousels((prev) => prev.filter((c) => c.id !== id));
        },
      },
    ]);
  };

  const filtered = carousels
    .filter((c) => filter === 'all' || c.status === filter)
    .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.root}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
           <BlurView intensity={20} tint="light" style={styles.searchBlur}>
              <SearchIcon size={18} color={Theme.colors.muted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Query Archive..."
                placeholderTextColor={Theme.colors.muted + '80'}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <X size={16} color={Theme.colors.muted} />
                </TouchableOpacity>
              )}
           </BlurView>
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {(['all', 'draft', 'completed'] as const).map((f) => {
            const isActive = filter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip]}
                onPress={() => setFilter(f)}
                activeOpacity={0.8}
              >
                {isActive && (
                   <View style={styles.activeDot} />
                )}
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {f === 'all' ? 'FULL ARCHIVE' : f.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator color={Theme.colors.primary} style={{ marginTop: 60 }} size="large" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Theme.colors.primary} />}
          ListEmptyComponent={
            <View style={styles.empty}>
               <Layers size={64} color={Theme.colors.muted} opacity={0.1} />
              <Text style={styles.emptyTitle}>Neural Void</Text>
              <Text style={styles.emptyText}>{search ? 'No matches found in the matrix.' : 'Your collections are awaiting their first entry.'}</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isDraft = item.status === 'draft';
            const date = new Date(item.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return (
              <TouchableOpacity style={styles.card} activeOpacity={0.9}>
                 <View style={styles.cardPreview}>
                    <View style={styles.cardOverlay}>
                        <View style={[styles.statusBadge, { backgroundColor: isDraft ? '#f59e0b20' : '#10b98120' }]}>
                           <Text style={[styles.statusBadgeText, { color: isDraft ? '#f59e0b' : '#10b981' }]}>
                             {isDraft ? 'D' : 'M'}
                           </Text>
                        </View>
                    </View>
                    <Layers size={24} color={Theme.colors.foreground} opacity={0.05} />
                 </View>
                 <View style={styles.cardMeta}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.cardFooter}>
                       <Text style={styles.cardDate}>{date}</Text>
                       <TouchableOpacity onPress={() => handleDelete(item.id, item.title)}>
                          <Trash2 size={12} color={Theme.colors.muted} />
                       </TouchableOpacity>
                    </View>
                 </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={<View style={{ height: 120 }} />}
        />
      )}

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.9}
      >
         <Sparkles size={24} color="#fff" />
      </TouchableOpacity>

      {/* Create Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" statusBarTranslucent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalRoot}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setModalVisible(false)}
          >
            <BlurView intensity={40} tint="dark" style={styles.modalContentBlur}>
              <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
                <View style={styles.modalHeader}>
                   <Text style={styles.modalTitle}>New Projection</Text>
                   <Text style={styles.modalSubtitle}>INITIALIZE CAROUSEL SEQUENCE</Text>
                </View>
                
                <TextInput
                  style={styles.modalInput}
                  placeholder="Masterpiece identifier..."
                  placeholderTextColor={Theme.colors.muted + '40'}
                  value={newTitle}
                  onChangeText={setNewTitle}
                  autoFocus
                />
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.modalBtnCancel} 
                    onPress={() => { setModalVisible(false); setNewTitle(''); }}
                  >
                    <Text style={styles.modalBtnCancelText}>ABORT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.modalBtnCreate} 
                    onPress={handleCreate} 
                    disabled={creating || !newTitle.trim()}
                  >
                    {creating ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.modalBtnCreateText}>INSTANTIATE</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </BlurView>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Theme.colors.background },
  header: { 
    paddingTop: 120, // Space for transparent header
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  searchContainer: { 
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden'
  },
  searchBlur: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    height: 54,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  searchIcon: { marginRight: 12 },
  searchInput: { 
    flex: 1, 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#fff' 
  },
  filterScroll: { paddingHorizontal: 4 },
  filterChip: { 
    marginRight: 12, 
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.primary,
    marginRight: 8
  },
  filterText: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: Theme.colors.muted, 
    letterSpacing: 2 
  },
  filterTextActive: { color: '#fff' },
  
  listContainer: { paddingHorizontal: 16 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },
  card: { 
    width: (width - 48) / 2, 
    borderRadius: 24, 
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden'
  },
  cardPreview: { 
    height: 120, 
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  cardOverlay: { position: 'absolute', top: 12, left: 12 },
  statusBadge: { 
    width: 20, 
    height: 20, 
    borderRadius: 6, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  statusBadgeText: { fontSize: 8, fontWeight: '900' },
  cardMeta: { padding: 12 },
  cardTitle: { fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontSize: 8, fontWeight: '700', color: Theme.colors.muted, textTransform: 'uppercase' },

  fab: { 
    position: 'absolute', 
    bottom: 110, 
    right: 24, 
    width: 64, 
    height: 64, 
    borderRadius: 24, 
    backgroundColor: Theme.colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: Theme.colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10
  },

  empty: { paddingVertical: 100, alignItems: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 13, color: Theme.colors.muted, textAlign: 'center', paddingHorizontal: 40, lineHeight: 20 },

  modalRoot: { flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContentBlur: { borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden' },
  modalCard: { padding: 32, paddingBottom: 60, backgroundColor: 'rgba(15, 23, 42, 0.5)' },
  modalHeader: { marginBottom: 32 },
  modalTitle: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  modalSubtitle: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.2)', letterSpacing: 2, marginTop: 4 },
  modalInput: { 
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 20, 
    paddingHorizontal: 20, 
    fontSize: 16, 
    fontWeight: '700',
    color: '#fff', 
    marginBottom: 32 
  },
  modalActions: { flexDirection: 'row', gap: 16 },
  modalBtnCancel: { 
    flex: 1, 
    height: 54, 
    borderRadius: 18, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  modalBtnCancelText: { fontSize: 10, fontWeight: '900', color: Theme.colors.muted, letterSpacing: 2 },
  modalBtnCreate: { 
    flex: 1, 
    height: 54, 
    borderRadius: 18, 
    backgroundColor: Theme.colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  modalBtnCreateText: { fontSize: 10, fontWeight: '900', color: '#fff', letterSpacing: 2 },
});
