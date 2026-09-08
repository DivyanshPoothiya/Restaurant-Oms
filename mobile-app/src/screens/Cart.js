import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import orderService from '../services/orderService';

const GOLD    = '#D4AF37';
const BG      = '#0A0A0A';
const SURFACE = '#141414';
const BORDER  = 'rgba(212,175,55,0.18)';

const CartScreen = ({ navigation }) => {
  const { items, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Cart is Empty', 'Add items before placing an order.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ menuItem: i._id, quantity: i.quantity })),
        customerName: 'Mobile Customer',
      };
      const res = await orderService.create(payload);
      clearCart();
      Alert.alert('Order Placed ✦', `${res.order.orderNumber} confirmed.`, [
        { text: 'Track', onPress: () => navigation.navigate('OrderStatus', { orderId: res.order._id }) },
        { text: 'OK' },
      ]);
    } catch (err) {
      Alert.alert('Failed', err.response?.data?.message || 'Could not place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTag}>✦  YOUR ORDER  ✦</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={s.clearText}>CLEAR ALL</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>🛒</Text>
          <Text style={s.emptyTitle}>Your cart is empty</Text>
          <Text style={s.emptySub}>Add dishes from the menu</Text>
          <TouchableOpacity style={s.browseBtn} onPress={() => navigation.navigate('Menu')}>
            <Text style={s.browseBtnText}>BROWSE MENU</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <CartItem item={item} />}
            contentContainerStyle={{ paddingVertical: 10 }}
            showsVerticalScrollIndicator={false}
          />
          <View style={s.footer}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>TOTAL</Text>
              <Text style={s.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
            </View>
            {/* Gold divider */}
            <View style={s.divider} />
            <TouchableOpacity
              style={[s.checkoutBtn, loading && { opacity: 0.6 }]}
              onPress={handlePlaceOrder}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#000" />
                : <Text style={s.checkoutBtnText}>PLACE ORDER  ✦</Text>
              }
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  headerTag: { fontSize: 10, fontWeight: '700', color: GOLD, letterSpacing: 3 },
  clearText:  { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.35)', letterSpacing: 2 },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon:  { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 6 },
  emptySub:   { fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 24 },
  browseBtn:  {
    borderWidth: 1.5, borderColor: GOLD,
    paddingHorizontal: 28, paddingVertical: 12, borderRadius: 999,
  },
  browseBtnText: { color: GOLD, fontWeight: '800', fontSize: 12, letterSpacing: 2 },

  footer: {
    backgroundColor: SURFACE, padding: 20,
    borderTopWidth: 1, borderTopColor: BORDER,
  },
  totalRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  totalLabel:  { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 3 },
  totalAmount: { fontSize: 28, fontWeight: '900', color: GOLD },
  divider:     { height: 1, backgroundColor: BORDER, marginBottom: 16 },
  checkoutBtn: {
    backgroundColor: GOLD, paddingVertical: 16,
    borderRadius: 999, alignItems: 'center',
  },
  checkoutBtnText: { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 2 },
});

export default CartScreen;
