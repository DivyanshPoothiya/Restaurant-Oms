import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { useCart } from '../context/CartContext';

const GOLD    = '#D4AF37';
const SURFACE = '#141414';
const BORDER  = 'rgba(212,175,55,0.18)';

const MenuItemCard = ({ item }) => {
  const { addItem } = useCart();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View style={[s.card, { transform: [{ scale }] }]}>
      {/* Image */}
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={s.image} />
      ) : (
        <View style={[s.image, s.imagePlaceholder]}>
          <Text style={{ fontSize: 32 }}>🍴</Text>
        </View>
      )}

      {/* Info */}
      <View style={s.info}>
        <View style={s.topRow}>
          <Text style={s.name} numberOfLines={1}>{item.name}</Text>
          {item.category?.name && (
            <View style={s.catBadge}>
              <Text style={s.catText}>{item.category.name}</Text>
            </View>
          )}
        </View>

        {item.description ? (
          <Text style={s.desc} numberOfLines={2}>{item.description}</Text>
        ) : null}

        {item.preparationTime ? (
          <Text style={s.prepTime}>⏱  {item.preparationTime} min</Text>
        ) : null}

        <View style={s.footer}>
          <Text style={s.price}>₹{item.price}</Text>
          {item.isAvailable ? (
            <TouchableOpacity
              style={s.addBtn}
              onPress={() => addItem(item)}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              activeOpacity={0.85}
              accessibilityLabel={`Add ${item.name} to cart`}
            >
              <Text style={s.addBtnText}>+ ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={s.unavailable}>
              <Text style={s.unavailableText}>Unavailable</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  card: {
    backgroundColor: SURFACE,
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  image: { width: 100, height: 110 },
  imagePlaceholder: {
    backgroundColor: '#1C1C1C',
    justifyContent: 'center', alignItems: 'center',
  },
  info: { flex: 1, padding: 12, justifyContent: 'space-between' },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', flexWrap: 'wrap', gap: 4,
  },
  name: {
    fontSize: 15, fontWeight: '800', color: '#fff',
    flex: 1, flexShrink: 1,
  },
  catBadge: {
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.35)',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999,
  },
  catText: { fontSize: 9, color: GOLD, fontWeight: '700', letterSpacing: 0.5 },
  desc:    { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3, lineHeight: 17 },
  prepTime:{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 3 },
  footer:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price:   { fontSize: 18, fontWeight: '900', color: GOLD },
  addBtn:  {
    backgroundColor: GOLD, paddingHorizontal: 14,
    paddingVertical: 6, borderRadius: 999,
  },
  addBtnText: { color: '#000', fontWeight: '800', fontSize: 11, letterSpacing: 1 },
  unavailable: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999,
  },
  unavailableText: { color: 'rgba(255,255,255,0.25)', fontSize: 11 },
});

export default MenuItemCard;
