import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const GOLD    = '#D4AF37';
const BG      = '#0A0A0A';
const SURFACE = '#141414';
const BORDER  = 'rgba(212,175,55,0.25)';

const LoginScreen = () => {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Missing Fields', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      Alert.alert('Access Denied', err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* Top band */}
        <View style={s.topBand}>
          <Text style={s.brandTag}>✦  RISTORANTE  ✦</Text>
          <Text style={s.brandName}>Fine Dining</Text>
          <Text style={s.brandSub}>Sign in to your account</Text>
        </View>

        {/* Form card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Welcome Back</Text>
          <View style={s.cardDivider} />

          <Text style={s.label}>EMAIL</Text>
          <TextInput
            style={s.input}
            placeholder="your@email.com"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={form.email}
            onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Email input"
          />

          <Text style={s.label}>PASSWORD</Text>
          <TextInput
            style={s.input}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={form.password}
            onChangeText={(v) => setForm((p) => ({ ...p, password: v }))}
            secureTextEntry
            accessibilityLabel="Password input"
          />

          <TouchableOpacity
            style={[s.btn, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#000" />
              : <Text style={s.btnText}>SIGN IN  ✦</Text>
            }
          </TouchableOpacity>

          <Text style={s.hint}>
            Don't have an account?{' '}
            <Text style={{ color: GOLD, fontWeight: '700' }}>Contact admin</Text>
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: BG },
  scroll:  { flexGrow: 1 },

  topBand: {
    backgroundColor: SURFACE,
    paddingTop: 70, paddingBottom: 50,
    alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  brandTag:  { fontSize: 10, fontWeight: '700', color: GOLD, letterSpacing: 4, marginBottom: 14 },
  brandName: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: 2, marginBottom: 6 },
  brandSub:  { fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },

  card: {
    margin: 20,
    backgroundColor: SURFACE,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  cardTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 16 },
  cardDivider: { height: 1, backgroundColor: BORDER, marginBottom: 24 },

  label: {
    fontSize: 10, fontWeight: '800', color: GOLD,
    letterSpacing: 2, marginBottom: 8,
  },
  input: {
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, color: '#fff', backgroundColor: '#0A0A0A', marginBottom: 20,
  },
  btn: {
    backgroundColor: GOLD,
    borderRadius: 999, paddingVertical: 16,
    alignItems: 'center', marginTop: 4,
  },
  btnText: { color: '#000', fontWeight: '900', fontSize: 13, letterSpacing: 2 },
  hint:    { textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 20 },
});

export default LoginScreen;
