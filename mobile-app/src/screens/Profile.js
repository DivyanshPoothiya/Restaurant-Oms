import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const GOLD    = '#D4AF37';
const BG      = '#0A0A0A';
const SURFACE = '#141414';
const BORDER  = 'rgba(212,175,55,0.2)';

const InfoRow = ({ label, value, last }) => (
  <View style={[s.infoRow, last && { borderBottomWidth: 0 }]}>
    <Text style={s.infoLabel}>{label}</Text>
    <Text style={s.infoValue}>{value ?? '—'}</Text>
  </View>
);

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Avatar card */}
      <View style={s.avatarCard}>
        <View style={s.avatarRing}>
          <Text style={s.avatarEmoji}>👤</Text>
        </View>
        <Text style={s.name}>{user?.name}</Text>
        <Text style={s.email}>{user?.email}</Text>
        <View style={s.roleBadge}>
          <Text style={s.roleText}>✦  {user?.role?.toUpperCase()}  ✦</Text>
        </View>
      </View>

      {/* Info */}
      <View style={s.infoCard}>
        <InfoRow label="Name"   value={user?.name} />
        <InfoRow label="Email"  value={user?.email} />
        <InfoRow label="Role"   value={user?.role} />
        <InfoRow label="Status" value={user?.isActive !== false ? 'Active' : 'Inactive'} last />
      </View>

      {/* Quick links */}
      {[
        { label: '🍽️  Browse Menu', screen: 'Menu' },
        { label: '🛒  My Cart',     screen: 'Cart' },
      ].map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={s.linkBtn}
          onPress={() => navigation.navigate(item.screen)}
          activeOpacity={0.75}
        >
          <Text style={s.linkBtnText}>{item.label}</Text>
          <Text style={{ color: GOLD, fontSize: 16 }}>›</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
        <Text style={s.logoutBtnText}>SIGN OUT  ✦</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  content:   { padding: 16, paddingBottom: 40 },

  avatarCard: {
    backgroundColor: SURFACE, borderRadius: 24, padding: 28,
    alignItems: 'center', marginBottom: 14,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: GOLD, shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 20, elevation: 10,
  },
  avatarRing: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: '#0A0A0A',
    borderWidth: 2, borderColor: GOLD,
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  avatarEmoji: { fontSize: 38 },
  name:  { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 4 },
  email: { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12 },
  roleBadge: {
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.4)',
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999,
  },
  roleText: { color: GOLD, fontWeight: '800', fontSize: 10, letterSpacing: 3 },

  infoCard: {
    backgroundColor: SURFACE, borderRadius: 16, paddingHorizontal: 16,
    marginBottom: 14, borderWidth: 1, borderColor: BORDER,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  infoLabel: { fontSize: 11, color: GOLD, fontWeight: '700', letterSpacing: 1 },
  infoValue: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },

  linkBtn: {
    backgroundColor: SURFACE, borderRadius: 14, paddingVertical: 16,
    paddingHorizontal: 20, marginBottom: 10,
    borderWidth: 1, borderColor: BORDER,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  linkBtnText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: 14 },

  logoutBtn: {
    backgroundColor: 'transparent', borderRadius: 999,
    paddingVertical: 15, alignItems: 'center', marginTop: 6,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)',
  },
  logoutBtnText: { color: 'rgba(255,255,255,0.4)', fontWeight: '800', fontSize: 12, letterSpacing: 2 },
});

export default ProfileScreen;
