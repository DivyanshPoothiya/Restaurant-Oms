import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

const GOLD    = '#D4AF37';
const SURFACE = '#141414';
const BORDER  = 'rgba(212,175,55,0.18)';

const CartItem = ({ item }) => {
  const { addItem, decrement } = useCart();
  return (
    <View style={s.row}>
      <View style={s.info}>
        <Text style={s.name}>{item.name}</Text>
        <Text style={s.unit}>₹{item.price} each</Text>
      </View>
      <View style={s.controls}>
        <TouchableOpacity style={s.btn} onPress={() => decrement(item._id)}>
          <Text style={s.btnText}>−</Text>
        </TouchableOpacity>
        <Text style={s.qty}>{item.quantity}</Text>
        <TouchableOpacity style={s.btn} onPress={() => addItem(item)}>
          <Text style={s.btnText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={s.total}>₹{item.price * item.quantity}</Text>
    </View>
  );
};

const s = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: SURFACE, padding: 14,
    marginHorizontal: 16, marginVertical: 5, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: '#000', shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 4,
  },
  info:  { flex: 1 },
  name:  { fontSize: 14, fontWeight: '700', color: '#fff' },
  unit:  { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  btn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.35)',
    justifyContent: 'center', alignItems: 'center',
  },
  btnText: { fontSize: 16, color: GOLD, fontWeight: '900', lineHeight: 20 },
  qty: {
    marginHorizontal: 10, fontSize: 16, fontWeight: '800',
    minWidth: 22, textAlign: 'center', color: '#fff',
  },
  total: { fontSize: 15, fontWeight: '900', color: GOLD, minWidth: 55, textAlign: 'right' },
});

export default CartItem;
