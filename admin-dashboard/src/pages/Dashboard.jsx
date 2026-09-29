import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import OrderCard from '../components/OrderCard';
import orderService from '../services/orderService';
import useSocket from '../hooks/useSocket';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, pending: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAll({ limit: 20 });
      const all = data.orders || [];
      setOrders(all);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setStats({
        total: all.length,
        today: all.filter((o) => new Date(o.createdAt) >= today).length,
        pending: all.filter((o) => ['pending', 'confirmed', 'preparing'].includes(o.status)).length,
        revenue: all
          .filter((o) => o.paymentStatus === 'paid')
          .reduce((sum, o) => sum + o.totalAmount, 0),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  useSocket(
    () => fetchOrders(),   // newOrder
    () => fetchOrders()    // orderStatusUpdated
  );

  // Build chart data (orders per status)
  const chartData = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'].map(
    (s) => ({ name: s, count: orders.filter((o) => o.status === s).length })
  );

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Navbar title="Dashboard" />

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <h3>Today's Orders</h3>
            <div className="stat-value">{stats.today}</div>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <div className="stat-value">{stats.pending}</div>
          </div>
          <div className="stat-card">
            <h3>Revenue (paid)</h3>
            <div className="stat-value">₹{stats.revenue.toFixed(0)}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Orders by Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ overflowY: 'auto', maxHeight: 320 }}>
            <h3 style={{ marginBottom: 12, fontSize: '1rem' }}>Live Orders</h3>
            {loading ? (
              <div className="loading">Loading…</div>
            ) : orders.length === 0 ? (
              <div className="empty-state">No orders yet.</div>
            ) : (
              orders
                .filter((o) => !['served', 'cancelled'].includes(o.status))
                .slice(0, 8)
                .map((o) => (
                  <OrderCard key={o._id} order={o} onUpdated={fetchOrders} />
                ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
