import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import orderService from '../services/orderService';
import useSocket from '../hooks/useSocket';

const STATUS_FILTER = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await orderService.getAll(params);
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filter]); // eslint-disable-line

  useSocket(
    () => fetchOrders(),
    () => fetchOrders()
  );

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel and delete this order?')) return;
    try {
      await orderService.delete(id);
      fetchOrders();
    } catch (err) {
      alert('Failed to delete order.');
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Navbar title="Orders" />

        <div className="page-header">
          <h1>Orders ({orders.length})</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {STATUS_FILTER.map((s) => (
              <button
                key={s}
                className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(s)}
                style={{ textTransform: 'capitalize' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          {loading ? (
            <div className="loading">Loading…</div>
          ) : orders.length === 0 ? (
            <div className="empty-state">No orders found.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td><strong>{order.orderNumber}</strong></td>
                    <td>{order.table?.tableNumber ? `#${order.table.tableNumber}` : 'Takeaway'}</td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {order.items.slice(0, 2).map((item, i) => (
                        <div key={i}>{item.quantity}× {item.name}</div>
                      ))}
                      {order.items.length > 2 && <div style={{ color: '#888' }}>+{order.items.length - 2} more</div>}
                    </td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span className={`badge badge-${order.paymentStatus === 'paid' ? 'available' : 'pending'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{ padding: '3px 6px', borderRadius: 4, border: '1px solid #ddd', fontSize: '0.82rem' }}
                      >
                        {['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#888' }}>
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(order._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;
