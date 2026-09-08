import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const GOLD    = '#D4AF37';
const BG      = '#0A0A0A';
const SURFACE = '#141414';
const BORDER  = 'rgba(212,175,55,0.2)';

const AboutScreen = () => (
  <ScrollView style={s.container} contentContainerStyle={s.content}>

    {/* Header */}
    <View style={s.header}>
      <Text style={s.tag}>✦  OUR STORY  ✦</Text>
      <Text style={s.title}>Our Visionary</Text>
      <Text style={s.subtitle}>Crafting experiences, not just meals</Text>
    </View>

    {/* Blockquote */}
    <View style={s.quoteCard}>
      <Text style={s.quoteBar} />
      <Text style={s.quoteText}>
        "Every dish we create is a tribute to the finest ingredients and the art of cooking — a blend of tradition and innovation."
      </Text>
      <Text style={s.quoteName}>— Head Chef</Text>
    </View>

    {/* Metric */}
    <View style={s.metricRow}>
      {[
        { num: '12+', label: 'Years of\nExperience' },
        { num: '200+', label: 'Unique\nDishes' },
        { num: '5★',  label: 'Average\nRating' },
      ].map((m) => (
        <View key={m.num} style={s.metricCard}>
          <Text style={s.metricNum}>{m.num}</Text>
          <Text style={s.metricLabel}>{m.label}</Text>
        </View>
      ))}
    </View>

    {/* Cards */}
    {[
      {
        title: 'Our Mission',
        body: 'To deliver an unmatched dining experience with the finest seasonal ingredients, crafted by our passionate culinary team.',
      },
      {
        title: 'Our Philosophy',
        body: 'We believe food is an art form. Every plate that leaves our kitchen is a masterpiece of flavour, texture, and presentation.',
      },
      {
        title: 'Why Dine With Us',
        body: '🌿  Seasonal & fresh ingredients\n👨‍🍳  Expert culinary team\n⚡  Swift, attentive service\n❤️  Made with passion',
      },
    ].map((card) => (
      <View key={card.title} style={s.card}>
        <Text style={s.cardTitle}>{card.title}</Text>
        <View style={s.cardDivider} />
        <Text style={s.cardBody}>{card.body}</Text>
      </View>
    ))}

  </ScrollView>
);

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  content:   { padding: 16, paddingBottom: 40 },

  header: {
    backgroundColor: SURFACE, borderRadius: 20,
    padding: 24, marginBottom: 14,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center',
  },
  tag:      { fontSize: 9, fontWeight: '700', color: GOLD, letterSpacing: 4, marginBottom: 10 },
  title:    { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 6 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },

  quoteCard: {
    backgroundColor: 'rgba(212,175,55,0.06)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    borderRadius: 16, padding: 20, marginBottom: 14,
    flexDirection: 'row', alignItems: 'flex-start',
  },
  quoteBar:  { width: 3, backgroundColor: GOLD, borderRadius: 2, marginRight: 14, alignSelf: 'stretch' },
  quoteText: { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: 22 },
  quoteName: { fontSize: 11, color: GOLD, fontWeight: '700', marginTop: 10 },

  metricRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  metricCard: {
    flex: 1, backgroundColor: SURFACE, borderRadius: 16,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: BORDER,
  },
  metricNum:   { fontSize: 24, fontWeight: '900', color: GOLD },
  metricLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 4, lineHeight: 14 },

  card: {
    backgroundColor: SURFACE, borderRadius: 16, padding: 20,
    marginBottom: 12, borderWidth: 1, borderColor: BORDER,
  },
  cardTitle:   { fontSize: 13, fontWeight: '800', color: GOLD, letterSpacing: 1, marginBottom: 10 },
  cardDivider: { height: 1, backgroundColor: BORDER, marginBottom: 12 },
  cardBody:    { fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 22 },
});

export default AboutScreen;
