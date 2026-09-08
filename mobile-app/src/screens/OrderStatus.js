import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { io } from 'socket.io-client';
import orderService from '../services/orderService';
import OrderStatusBadge from '../components/OrderStatusBadge';

const GOLD    = '#D4AF37';
const BG      = '#0A0A0A';
const SURFACE = '#141414';
const BORDER  = 'rgba(212,175,55,0.2)';

const STEPS = ['pending', 'confirmed', 'preparing', 'ready', 'served'];

const OrderStatusScreen = ({ route }) => {
  const { orderId } = route.params;
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = () => {
    orderService.getById(orderId)
      .then((data) => setOrder(data.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
    const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5001';
    const socket = io(socketUrl, { transports: ['websocket'] });
    socket.on('orderStatusUpdated', (data) => {
      if (data.orderId === orderId) fetchOrder();
    });
    return () => socket.disconnect();
  }, [orderId]); // eslint-disable-line

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={GOLD} />
        <Text style={s.loadingText}>Fetching your order…</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={s.center}>
        <Text style={s.errorText}>Order not found.</Text>
      </View>
    );
  }

  const currentStep = STEPS.indexOf(order.status);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.heroTag}>✦  ORDER STATUS  ✦</Text>
        <Text style={s.heroOrder}>{order.orderNumber}</Text>
        <Text style={s.heroDate}>{new Date(order.createdAt).toLocaleString()}</Text>
        <OrderStatusBadge status={order.status} />
      </View>

      {/* Progress tracker */}
      {order.status !== 'cancelled' && (
        <View style={s.card}>
          <Text style={s.cardLabel}>ORDER PROGRESS</Text>
          <View style={s.stepsRow}>
            {STEPS.map((step, idx) => (
              <React.Fragment key={step}>
                <View style={s.stepCol}>
                  <View style={[s.stepDot, idx <= currentStep && s.stepDotActive]}>
                    <Text style={s.stepDotText}>
                      {idx < currentStep ? '✓' : idx === currentStep ? '●' : ''}
                    </Text>
                  </View>
                  <Text style={[s.stepLabel, idx <= currentStep && s.stepLabelActive]}>
                    {step}
                  </Text>
                </View>
                {idx < STEPS.length - 1 && (
                  <View style={[s.stepLine, idx < currentStep && s.stepLineActive]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      )}

      {/* Items */}
      <View style={s.card}>
        <Text style={s.cardLabel}>ITEMS ORDERED</Text>
        {order.items.map((item, idx) => (
          <View key={idx} style={s.itemRow}>
            <Text style={s.itemName}>{item.quantity}×  {item.name}</Text>
            <Text style={s.itemPrice}>₹{item.price * item.quantity}</Text>
          </View>
        ))}
        <View style={s.divider} />
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>TOTAL</Text>
          <Text style={s.totalAmount}>₹{order.totalAmount}</Text>
        </View>
      </View>

      {/* Table */}
      {order.table && (
        <View style={s.card}>
          <Text style={s.cardLabel}>TABLE</Text>
          <Text style={s.infoText}>Table #{order.table.tableNumber}</Text>
        </View>
      )}

      {/* Payment */}
      <View style={s.card}>
        <Text style={s.cardLabel}>PAYMENT</Text>
        <Text style={s.infoText}>
          Status:{' '}
          <Text style={{ color: order.paymentStatus === 'paid' ? '#28a745' : GOLD, fontWeight: '800' }}>
            {order.paymentStatus}
          </Text>
        </Text>
        {order.paymentMethod && (
          <Text style={s.infoText}>Method: {order.paymentMethod}</Text>
        )}
      </View>

    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  content:   { padding: 16, paddingBottom: 30 },
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: BG,
  },
  loadingText: { marginTop: 14, color: GOLD, fontSize: 13, fontWeight: '600', letterSpacing: 1 },
  errorText:   { color: 'rgba(255,255,255,0.3)', fontSize: 14 },

  hero: {
    backgroundColor: SURFACE, borderRadius: 20,
    padding: 24, alignItems: 'center', marginBottom: 14,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: GOLD, shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 20, elevation: 10,
  },
  heroTag:   { fontSize: 9, fontWeight: '700', color: GOLD, letterSpacing: 4, marginBottom: 10 },
  heroOrder: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
  heroDate:  { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 14 },

  card: {
    backgroundColor: SURFACE, borderRadius: 16, padding: 18,
    marginBottom: 12, borderWidth: 1, borderColor: BORDER,
  },
  cardLabel: { fontSize: 9, fontWeight: '800', color: GOLD, letterSpacing: 3, marginBottom: 14 },

  stepsRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  stepCol:  { alignItems: 'center', flex: 0 },
  stepDot:  {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#1C1C1C',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  stepDotActive: { backgroundColor: GOLD, borderColor: GOLD },
  stepDotText:   { fontSize: 10, fontWeight: '900', color: '#000' },
  stepLabel: {
    fontSize: 8, color: 'rgba(255,255,255,0.25)', marginTop: 5,
    textTransform: 'capitalize', textAlign: 'center', width: 50,
  },
  stepLabelActive: { color: GOLD, fontWeight: '700' },
  stepLine: {
    flex: 1, height: 2, backgroundColor: '#1C1C1C',
    marginTop: 13, marginHorizontal: 2,
  },
  stepLineActive: { backgroundColor: GOLD },

  itemRow:     { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  itemName:    { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  itemPrice:   { fontSize: 13, fontWeight: '700', color: '#fff' },
  divider:     { height: 1, backgroundColor: BORDER, marginVertical: 10 },
  totalRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel:  { fontSize: 10, fontWeight: '800', color: GOLD, letterSpacing: 2 },
  totalAmount: { fontSize: 22, fontWeight: '900', color: GOLD },
  infoText:    { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 22 },
});

export default OrderStatusScreen;
