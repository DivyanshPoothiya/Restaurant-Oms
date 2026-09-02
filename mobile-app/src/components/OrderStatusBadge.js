import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GOLD = '#D4AF37';

const STATUS_CONFIG = {
  pending:   { bg: 'rgba(212,175,55,0.1)',  border: 'rgba(212,175,55,0.35)', color: GOLD,                label: '⏳  Pending'   },
  confirmed: { bg: 'rgba(212,175,55,0.15)', border: 'rgba(212,175,55,0.5)',  color: GOLD,                label: '✦  Confirmed' },
  preparing: { bg: 'rgba(212,175,55,0.1)',  border: 'rgba(212,175,55,0.35)', color: GOLD,                label: '👨‍🍳  Preparing' },
  ready:     { bg: 'rgba(40,167,69,0.12)',  border: 'rgba(40,167,69,0.4)',   color: '#28a745',           label: '✓  Ready'     },
  served:    { bg: 'rgba(255,255,255,0.06)',border: 'rgba(255,255,255,0.15)',color: 'rgba(255,255,255,0.5)', label: '🍽️  Served'  },
  cancelled: { bg: 'rgba(220,53,69,0.1)',   border: 'rgba(220,53,69,0.35)', color: '#dc3545',           label: '✕  Cancelled' },
};

const OrderStatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <View style={[s.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <Text style={[s.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
};

const s = StyleSheet.create({
  badge: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 999, borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: { fontWeight: '800', fontSize: 13, letterSpacing: 1 },
});

export default OrderStatusBadge;
