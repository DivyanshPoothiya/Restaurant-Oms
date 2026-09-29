import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import userService from '../services/userService';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'waiter', phone: '' };

const Staff = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openAdd = () => { setEditUser(null); setForm(EMPTY_FORM); setError(''); setShowModal(true); };
  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, phone: user.phone || '', password: '' });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editUser) {
        const payload = { name: form.name, role: form.role, phone: form.phone };
        await userService.update(editUser._id, payload);
      } else {
        await userService.register(form);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save staff member.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await userService.delete(id);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const roleBadgeColor = {
    admin: '#e94560',
    manager: '#1a1a2e',
    waiter: '#28a745',
    kitchen: '#fd7e14',
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Navbar title="Staff Management" />

        <div className="page-header">
          <h1>Staff ({users.length})</h1>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Staff</button>
        </div>

        <div className="card">
          {loading ? (
            <div className="loading">Loading…</div>
          ) : users.length === 0 ? (
            <div className="empty-state">No staff members found.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>{user.phone || '—'}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: roleBadgeColor[user.role] + '20',
                          color: roleBadgeColor[user.role],
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${user.isActive ? 'available' : 'cancelled'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#888' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(user)} style={{ marginRight: 6 }}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
              <div className="modal-header">
                <h2>{editUser ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close">×</button>
              </div>
              {error && <div className="error-msg">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name *</label>
                  <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required disabled={!!editUser} />
                </div>
                {!editUser && (
                  <div className="form-group">
                    <label>Password *</label>
                    <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
                  </div>
                )}
                <div className="form-group">
                  <label>Role *</label>
                  <select className="form-control" name="role" value={form.role} onChange={handleChange}>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="waiter">Waiter</option>
                    <option value="kitchen">Kitchen</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary">{editUser ? 'Update' : 'Add Staff'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Staff;
