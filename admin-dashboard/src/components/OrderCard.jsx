import React from 'react';
import orderService from '../services/orderService';

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'];

const OrderCard = ({ order, onUpdated }) => {
  const handleStatusChange = async (e) => {
    try {
      await orderService.updateStatus(order._id, e.target.value);
      onUpdated();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>{order.orderNumber}</strong>
          {order.table && (
            <span style={{ marginLeft: 10, color: '#888', fontSize: '0.85rem' }}>
              Table #{order.table.tableNumber}
            </span>
          )}
        </div>
        <span className={`badge badge-${order.status}`}>{order.status}</span>
      </div>

      <div style={{ margin: '10px 0', fontSize: '0.85rem', color: '#555' }}>
        {order.items.map((item, i) => (
          <div key={i}>
            {item.quantity}× {item.name || item.menuItem?.name} — ₹{item.price * item.quantity}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>₹{order.totalAmount}</strong>
        <select
          value={order.status}
          onChange={handleStatusChange}
          style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ddd', fontSize: '0.85rem' }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrderCard;
