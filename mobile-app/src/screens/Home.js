import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Animated,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';

const GOLD    = '#D4AF37';
const BG      = '#0A0A0A';
const SURFACE = '#141414';
const BORDER  = 'rgba(212,175,55,0.2)';

/* Floating animation for hero badge */
const FloatingBadge = ({ children, style }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: -8, duration: 1800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0,  duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[style, { transform: [{ translateY: anim }] }]}>
      {children}
    </Animated.View>
  );
};

const statusColor = (s) => ({
  pending: '#856404', confirmed: GOLD, preparing: '#c79a00',
  ready: '#28a745', served: 'rgba(255,255,255,0.4)', cancelled: '#dc3545',
}[s] || '#fff');

const Home = ({ navigation }) => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getAll({ limit: 5 })
      .then((data) => setRecentOrders(data.orders || []))
      .catch(() => setRecentOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

      {/* ── HERO ── */}
      <View style={s.hero}>
        <Text style={s.heroTag}>✦  PREMIUM DINING  ✦</Text>
        <Text style={s.heroTitle}>Fine Dining{'\n'}Experience</Text>
        <Text style={s.heroSub}>
          Crafted with passion, served with elegance.{'\n'}
          Every dish tells a story.
        </Text>

        {/* Floating Best Rated badge */}
        <FloatingBadge style={s.badge}>
          <Text style={s.badgeIcon}>★</Text>
          <Text style={s.badgeText}>Best Rated</Text>
        </FloatingBadge>

        {/* CTA buttons */}
        <View style={s.heroButtons}>
          <TouchableOpacity
            style={s.btnPrimary}
            onPress={() => navigation.navigate('Menu')}
            activeOpacity={0.85}
          >
            <Text style={s.btnPrimaryText}>View Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.btnOutline}
            onPress={() => navigation.navigate('Contact')}
            activeOpacity={0.85}
          >
            <Text style={s.btnOutlineText}>Reserve Table</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── QUICK ACTIONS ── */}
      <View style={s.actionsRow}>
        {[
          { icon: '🍽️', label: 'Menu',    screen: 'Menu'    },
          { icon: '🛒', label: 'Cart',    screen: 'Cart'    },
          { icon: '📞', label: 'Contact', screen: 'Contact' },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={s.actionCard}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.75}
          >
            <Text style={s.actionIcon}>{item.icon}</Text>
            <Text style={s.actionLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── GREETING ── */}
      <View style={s.greetRow}>
        <Text style={s.greetText}>
          Welcome back, <Text style={{ color: GOLD }}>{user?.name?.split(' ')[0]}</Text>
        </Text>
        <View style={s.greetDivider} />
      </View>

      {/* ── RECENT ORDERS ── */}
      <Text style={s.sectionTitle}>Recent Orders</Text>

      {loading ? (
        <ActivityIndicator color={GOLD} style={{ marginTop: 24 }} />
      ) : recentOrders.length === 0 ? (
        <View style={s.emptyBox}>
          <Text style={s.emptyIcon}>🧾</Text>
          <Text style={s.emptyText}>No orders yet</Text>
          <TouchableOpacity style={s.emptyBtn} onPress={() => navigation.navigate('Menu')}>
            <Text style={s.emptyBtnText}>Explore Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        recentOrders.map((item) => (
          <TouchableOpacity
            key={item._id}
            style={s.orderCard}
            onPress={() => navigation.navigate('OrderStatus', { orderId: item._id })}
            activeOpacity={0.8}
          >
            <View style={s.orderLeft}>
              <Text style={s.orderNum}>{item.orderNumber}</Text>
              <Text style={s.orderDate}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <View style={s.orderRight}>
              <Text style={s.orderAmount}>₹{item.totalAmount}</Text>
              <Text style={[s.orderStatus, { color: statusColor(item.status) }]}>
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  /* Hero */
  hero: {
    backgroundColor: SURFACE,
    margin: 16,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  heroTag: {
    fontSize: 10,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 4,
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 42,
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 20,
    marginBottom: 20,
  },

  /* Floating badge */
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
  },
  badgeIcon: { fontSize: 12, color: GOLD, marginRight: 6 },
  badgeText: { fontSize: 11, fontWeight: '700', color: GOLD, letterSpacing: 1 },

  /* Hero buttons */
  heroButtons: { flexDirection: 'row', gap: 12 },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: 'center',
  },
  btnPrimaryText: { fontSize: 13, fontWeight: '800', color: '#000', letterSpacing: 1 },
  btnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: GOLD,
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: 'center',
  },
  btnOutlineText: { fontSize: 13, fontWeight: '700', color: GOLD, letterSpacing: 1 },

  /* Quick actions */
  actionsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: SURFACE,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  actionIcon:  { fontSize: 24, marginBottom: 6 },
  actionLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },

  /* Greeting */
  greetRow: { marginHorizontal: 16, marginVertical: 16, flexDirection: 'row', alignItems: 'center' },
  greetText: { fontSize: 15, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  greetDivider: { flex: 1, height: 1, backgroundColor: BORDER, marginLeft: 12 },

  /* Section title */
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 3,
    marginHorizontal: 16,
    marginBottom: 12,
  },

  /* Empty */
  emptyBox: {
    alignItems: 'center', padding: 32,
    backgroundColor: SURFACE, marginHorizontal: 16,
    borderRadius: 20, borderWidth: 1, borderColor: BORDER,
  },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 16 },
  emptyBtn: {
    borderWidth: 1, borderColor: GOLD,
    paddingHorizontal: 24, paddingVertical: 10, borderRadius: 999,
  },
  emptyBtnText: { color: GOLD, fontWeight: '700', fontSize: 13, letterSpacing: 1 },

  /* Order card */
  orderCard: {
    backgroundColor: SURFACE,
    borderRadius: 14, padding: 16,
    marginHorizontal: 16, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between',
    borderWidth: 1, borderColor: BORDER,
    shadowColor: '#000', shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4,
  },
  orderLeft:   {},
  orderRight:  { alignItems: 'flex-end' },
  orderNum:    { fontWeight: '800', color: '#fff', fontSize: 14 },
  orderDate:   { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 },
  orderAmount: { fontWeight: '800', color: GOLD, fontSize: 16 },
  orderStatus: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize', marginTop: 3 },
});

export default Home;
