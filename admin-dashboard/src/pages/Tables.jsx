import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TableGrid from '../components/TableGrid';
import tableService from '../services/tableService';

const EMPTY_FORM = { tableNumber: '', capacity: 2, location: 'indoor' };

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const fetchTables = async () => {
    try {
      const data = await tableService.getAll();
      setTables(data.tables || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTables(); }, []);

  const openAdd = () => { setEditTable(null); setForm(EMPTY_FORM); setError(''); setShowModal(true); };
  const openEdit = (table) => {
    setEditTable(table);
    setForm({ tableNumber: table.tableNumber, capacity: table.capacity, location: table.location, status: table.status });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editTable) {
        await tableService.update(editTable._id, form);
      } else {
        await tableService.create(form);
      }
      setShowModal(false);
      fetchTables();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save table.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await tableService.delete(id);
      fetchTables();
    } catch (err) {
      alert('Failed to delete table.');
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Navbar title="Tables" />

        <div className="page-header">
          <h1>Tables ({tables.length})</h1>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Table</button>
        </div>

        {loading ? (
          <div className="loading">Loading…</div>
        ) : (
          <>
            <TableGrid tables={tables} onSelect={openEdit} />
            <div className="card" style={{ marginTop: 20 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Table #</th>
                    <th>Capacity</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Current Order</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((table) => (
                    <tr key={table._id}>
                      <td><strong>#{table.tableNumber}</strong></td>
                      <td>{table.capacity} seats</td>
                      <td style={{ textTransform: 'capitalize' }}>{table.location}</td>
                      <td><span className={`badge badge-${table.status}`}>{table.status}</span></td>
                      <td style={{ fontSize: '0.82rem', color: '#555' }}>
                        {table.currentOrder?.orderNumber || '—'}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(table)} style={{ marginRight: 6 }}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(table._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {showModal && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
              <div className="modal-header">
                <h2>{editTable ? `Edit Table #${editTable.tableNumber}` : 'Add Table'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close">×</button>
              </div>
              {error && <div className="error-msg">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Table Number *</label>
                  <input className="form-control" type="number" name="tableNumber" value={form.tableNumber} onChange={handleChange} min="1" required />
                </div>
                <div className="form-group">
                  <label>Capacity *</label>
                  <input className="form-control" type="number" name="capacity" value={form.capacity} onChange={handleChange} min="1" required />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <select className="form-control" name="location" value={form.location} onChange={handleChange}>
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                {editTable && (
                  <div className="form-group">
                    <label>Status</label>
                    <select className="form-control" name="status" value={form.status} onChange={handleChange}>
                      {['available', 'occupied', 'reserved', 'cleaning'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary">{editTable ? 'Update' : 'Add'}</button>
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

export default Tables;
