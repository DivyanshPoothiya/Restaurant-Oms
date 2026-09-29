import React, { useState } from 'react';
import menuService from '../services/menuService';

const EMPTY = { name: '', description: '', price: '', isAvailable: true, preparationTime: 10, tags: '' };

const MenuForm = ({ item, onSaved, onClose }) => {
  const [form, setForm] = useState(
    item
      ? { ...item, tags: (item.tags || []).join(', ') }
      : EMPTY
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        preparationTime: parseInt(form.preparationTime, 10),
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
      };
      if (item?._id) {
        await menuService.update(item._id, payload);
      } else {
        await menuService.create(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-msg">{error}</div>}
      <div className="form-group">
        <label>Name *</label>
        <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={3} />
      </div>
      <div className="form-group">
        <label>Price (₹) *</label>
        <input className="form-control" type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" required />
      </div>
      <div className="form-group">
        <label>Preparation Time (min)</label>
        <input className="form-control" type="number" name="preparationTime" value={form.preparationTime} onChange={handleChange} min="1" />
      </div>
      <div className="form-group">
        <label>Tags (comma separated)</label>
        <input className="form-control" name="tags" value={form.tags} onChange={handleChange} placeholder="veg, spicy, popular" />
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} id="isAvailable" />
        <label htmlFor="isAvailable" style={{ marginBottom: 0 }}>Available</label>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : item ? 'Update Item' : 'Add Item'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default MenuForm;
