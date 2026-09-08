import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Linking, TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';

const GOLD    = '#D4AF37';
const BG      = '#0A0A0A';
const SURFACE = '#141414';
const BORDER  = 'rgba(212,175,55,0.2)';

const INFO_ROWS = [
  { icon: '📍', label: 'Address', value: '123 Food Street, Noida, India' },
  { icon: '📞', label: 'Phone',   value: '+91 6396689618' },
  { icon: '📧', label: 'Email',   value: 'hello@restaurantoms.com' },
  { icon: '🕐', label: 'Hours',   value: 'Mon – Sun: 10:00 AM – 10:00 PM' },
];

const ContactScreen = () => {
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: '', email: '', message: '' });
      Alert.alert('Message Sent ✦', "We'll get back to you within 24 hours.");
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.tag}>✦  GET IN TOUCH  ✦</Text>
          <Text style={s.title}>Contact Us</Text>
          <Text style={s.subtitle}>We'd love to hear from you</Text>
        </View>

        {/* Info rows */}
        {INFO_ROWS.map((row) => (
          <View key={row.label} style={s.row}>
            <Text style={s.rowIcon}>{row.icon}</Text>
            <View style={s.rowInfo}>
              <Text style={s.rowLabel}>{row.label}</Text>
              <Text style={s.rowValue}>{row.value}</Text>
            </View>
          </View>
        ))}

        {/* Call button */}
        <TouchableOpacity
          style={s.callBtn}
          onPress={() => Linking.openURL('tel:+916396689618')}
          activeOpacity={0.85}
        >
          <Text style={s.callBtnText}>📞  CALL US NOW</Text>
        </TouchableOpacity>

        {/* Message form */}
        <View style={s.formCard}>
          <Text style={s.formTag}>✦  SEND A MESSAGE  ✦</Text>
          <Text style={s.formTitle}>We'll reply within 24 hours</Text>
          <View style={s.formDivider} />

          <Text style={s.label}>NAME</Text>
          <TextInput
            style={s.input}
            placeholder="Your full name"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={form.name}
            onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
            accessibilityLabel="Name"
          />

          <Text style={s.label}>EMAIL</Text>
          <TextInput
            style={s.input}
            placeholder="your@email.com"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={form.email}
            onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email"
          />

          <Text style={s.label}>MESSAGE</Text>
          <TextInput
            style={[s.input, s.messageInput]}
            placeholder="Write your message..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={form.message}
            onChangeText={(v) => setForm((p) => ({ ...p, message: v }))}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            accessibilityLabel="Message"
          />

          <TouchableOpacity
            style={[s.sendBtn, sending && { opacity: 0.6 }]}
            onPress={handleSend}
            disabled={sending}
            activeOpacity={0.85}
          >
            <Text style={s.sendBtnText}>
              {sending ? 'SENDING…' : 'SEND MESSAGE  ↗'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  content:   { padding: 16, paddingBottom: 40 },

  header: {
    backgroundColor: SURFACE, borderRadius: 20,
    padding: 24, marginBottom: 14,
    borderWidth: 1, borderColor: BORDER, alignItems: 'center',
  },
  tag:      { fontSize: 9, fontWeight: '700', color: GOLD, letterSpacing: 4, marginBottom: 10 },
  title:    { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },

  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: SURFACE, borderRadius: 14, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: BORDER,
  },
  rowIcon:  { fontSize: 22, marginRight: 14 },
  rowInfo:  { flex: 1 },
  rowLabel: { fontSize: 9, color: GOLD, fontWeight: '700', letterSpacing: 2, marginBottom: 3 },
  rowValue: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },

  callBtn: {
    borderWidth: 1.5, borderColor: GOLD,
    borderRadius: 999, paddingVertical: 15,
    alignItems: 'center', marginBottom: 20,
  },
  callBtnText: { color: GOLD, fontWeight: '800', fontSize: 13, letterSpacing: 2 },

  formCard: {
    backgroundColor: SURFACE, borderRadius: 20,
    padding: 22, borderWidth: 1, borderColor: BORDER,
    shadowColor: GOLD, shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 }, shadowRadius: 20, elevation: 8,
  },
  formTag:     { fontSize: 9, fontWeight: '700', color: GOLD, letterSpacing: 3, marginBottom: 6 },
  formTitle:   { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 14 },
  formDivider: { height: 1, backgroundColor: BORDER, marginBottom: 20 },

  label: { fontSize: 9, fontWeight: '800', color: GOLD, letterSpacing: 2, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 14, color: '#fff', backgroundColor: BG, marginBottom: 18,
  },
  messageInput: { height: 110, paddingTop: 12 },

  sendBtn: {
    backgroundColor: GOLD, borderRadius: 999,
    paddingVertical: 15, alignItems: 'center', marginTop: 4,
  },
  sendBtnText: { color: '#000', fontWeight: '900', fontSize: 12, letterSpacing: 2 },
});

export default ContactScreen;
