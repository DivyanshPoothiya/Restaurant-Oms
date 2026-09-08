import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, TextInput, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import MenuItemCard from '../components/MenuItemCard';

const GOLD    = '#D4AF37';
const BG      = '#0A0A0A';
const SURFACE = '#141414';
const BORDER  = 'rgba(212,175,55,0.2)';

const MenuScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [items,          setItems]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [search,         setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchItems = () => {
    setLoading(true);
    setError(null);
    api.get('/menu')
      .then((res) => setItems(res.data.items || []))
      .catch((err) => {
        console.error('Menu fetch error:', err.message);
        setError('Could not load menu. Check your connection.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const categories = useMemo(() => {
    const names = items.map((i) => i.category?.name).filter(Boolean);
    return ['All', ...Array.from(new Set(names))];
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (activeCategory !== 'All') result = result.filter((i) => i.category?.name === activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (i) => i.name.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, activeCategory, search]);

  return (
    <View style={s.container}>

      {/* ── HERO HEADER ── */}
      <View style={s.hero}>
        <Text style={s.heroTag}>✦  OUR MENU  ✦</Text>
        <Text style={s.heroTitle}>Our Menu</Text>
        <Text style={s.heroSub}>
          Discover our carefully crafted dishes{'\n'}made with premium ingredients
        </Text>
        {!user && (
          <View style={s.banner}>
            <Text style={s.bannerText}>
              <Text style={{ color: GOLD, fontWeight: '800' }}>Browse our menu below.  </Text>
              To place an order,{' '}
              <Text style={s.bannerLink} onPress={() => navigation.navigate('Profile')}>
                sign in
              </Text>{' '}
              first.
            </Text>
          </View>
        )}
      </View>

      {/* ── SEARCH ── */}
      <View style={s.searchBox}>
        <Text style={s.searchEmoji}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Search dishes..."
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Search menu items"
        />
      </View>

      {/* ── CATEGORY PILLS ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.pillScroll}
        contentContainerStyle={s.pillContent}
      >
        {categories.map((cat, idx) => {
          const active = activeCategory === cat;
          return (
            <TouchableOpacity
              key={`cat-${idx}`}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.75}
              style={[s.pill, active ? s.pillOn : s.pillOff]}
            >
              <Text style={[s.pillLabel, active ? s.pillLabelOn : s.pillLabelOff]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── COUNT ── */}
      <View style={s.countRow}>
        <View style={s.countDot} />
        <Text style={s.countText}>
          {filtered.length} DISH{filtered.length !== 1 ? 'ES' : ''} AVAILABLE
        </Text>
        <View style={s.countDot} />
      </View>

      {/* ── LIST ── */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={GOLD} />
          <Text style={s.loadingLabel}>Preparing the menu…</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={{ fontSize: 36, marginBottom: 12 }}>⚠️</Text>
          <Text style={s.errorLabel}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={fetchItems}>
            <Text style={s.retryLabel}>RETRY</Text>
          </TouchableOpacity>
        </View>
      ) : filtered.length === 0 ? (
        <View style={s.center}>
          <Text style={s.emptyLabel}>
            {search ? `No results for "${search}"` : 'No items available.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <MenuItemCard item={item} />}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  hero: {
    backgroundColor: SURFACE,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: BORDER,
  },
  heroTag: {
    fontSize: 9, fontWeight: '700', color: GOLD,
    letterSpacing: 4, marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 6,
  },
  heroSub: {
    fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 20,
  },
  banner: {
    marginTop: 14, backgroundColor: 'rgba(212,175,55,0.08)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
  },
  bannerText: { fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 18 },
  bannerLink: { color: GOLD, fontWeight: '700' },

  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: SURFACE,
    borderRadius: 999, marginHorizontal: 16,
    marginTop: 12, marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
    borderWidth: 1, borderColor: BORDER,
  },
  searchEmoji: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#fff', paddingVertical: 8 },

  pillScroll:  { flexShrink: 0, minHeight: 56 },
  pillContent: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10,
  },
  pill: {
    borderRadius: 999, borderWidth: 1,
    marginRight: 10, height: 36,
    paddingHorizontal: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  pillOff: { backgroundColor: SURFACE, borderColor: 'rgba(212,175,55,0.35)' },
  pillOn:  { backgroundColor: GOLD,    borderColor: GOLD },
  pillLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  pillLabelOff: { color: 'rgba(255,255,255,0.6)' },
  pillLabelOn:  { color: '#000' },

  countRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 16, marginBottom: 10,
    backgroundColor: 'rgba(212,175,55,0.07)',
    borderRadius: 10, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)',
  },
  countDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: GOLD, marginHorizontal: 10 },
  countText: { fontSize: 10, fontWeight: '700', color: GOLD, letterSpacing: 3 },

  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 50,
  },
  loadingLabel: { marginTop: 14, color: GOLD, fontSize: 13, fontWeight: '600', letterSpacing: 1 },
  errorLabel:   { color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', marginBottom: 20, lineHeight: 22 },
  retryBtn:     { borderWidth: 1.5, borderColor: GOLD, paddingHorizontal: 28, paddingVertical: 11, borderRadius: 999 },
  retryLabel:   { color: GOLD, fontWeight: '800', fontSize: 12, letterSpacing: 2 },
  emptyLabel:   { color: 'rgba(255,255,255,0.3)', fontSize: 15, textAlign: 'center' },
});

export default MenuScreen;
