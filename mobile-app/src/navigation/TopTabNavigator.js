import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const GOLD   = '#D4AF37';
const BG     = '#0A0A0A';
const NAV_BG = 'rgba(10,10,10,0.97)';

const NAV_ITEMS = [
  { name: 'Home',    label: 'Home'    },
  { name: 'Menu',    label: 'Menu'    },
  { name: 'About',   label: 'About'   },
  { name: 'Contact', label: 'Contact' },
];

const TopBar = () => {
  const navigation  = useNavigation();
  const { user }    = useAuth();
  const { totalItems } = useCart();

  const currentRoute = useNavigationState((state) => {
    const route = state?.routes?.[state.index];
    return route?.name;
  });

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor={BG} barStyle="light-content" />

      {/* Logo */}
      <View style={s.logoRow}>
        <Text style={s.logoMain}>RISTORANTE</Text>
        <Text style={s.logoSub}>EST. 2024</Text>
      </View>

      {/* Nav */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.scroll}
        contentContainerStyle={s.navRow}
      >
        {NAV_ITEMS.map((item) => {
          const active = currentRoute === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[s.pill, active ? s.pillActive : s.pillInactive]}
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.7}
            >
              <Text style={[s.pillText, active ? s.pillTextActive : s.pillTextInactive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Profile / Login CTA */}
        <TouchableOpacity
          style={s.ctaBtn}
          onPress={() => navigation.navigate(user ? 'Profile' : 'Login')}
          activeOpacity={0.8}
        >
          <Text style={s.ctaText}>
            {user ? `👤 ${user.name?.split(' ')[0]}` : 'LOGIN'}
          </Text>
          {totalItems > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Gold divider */}
      <View style={s.divider} />
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: {
    backgroundColor: NAV_BG,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,175,55,0.2)',
  },
  logoRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  logoMain: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 6,
  },
  logoSub: {
    fontSize: 9,
    fontWeight: '600',
    color: GOLD,
    letterSpacing: 4,
    marginTop: 1,
  },
  scroll: { flexShrink: 0 },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  pillInactive: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(212,175,55,0.3)',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  pillTextActive:   { color: '#000' },
  pillTextInactive: { color: 'rgba(255,255,255,0.7)' },

  ctaBtn: {
    backgroundColor: GOLD,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: '#000',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  badgeText: { fontSize: 9, fontWeight: '800', color: GOLD },
  divider: { height: 1, backgroundColor: 'rgba(212,175,55,0.15)' },
});

export default TopBar;
