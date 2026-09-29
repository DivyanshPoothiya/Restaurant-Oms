import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MenuForm from '../components/MenuForm';
import menuService from '../services/menuService';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchItems = async () => {
    try {
      const data = await menuService.getAll();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await menuService.delete(id);
      fetchItems();
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const openAdd = () => { setEditItem(null); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };
  const handleSaved = () => { closeModal(); fetchItems(); };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Navbar title="Menu Management" />

        <div className="page-header">
          <h1>Menu Items ({items.length})</h1>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Item</button>
        </div>

        <div className="card">
          {loading ? (
            <div className="loading">Loading…</div>
          ) : items.length === 0 ? (
            <div className="empty-state">No menu items yet.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Prep Time</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.name}</strong>
                      {item.description && (
                        <div style={{ fontSize: '0.78rem', color: '#888' }}>{item.description.slice(0, 60)}</div>
                      )}
                    </td>
                    <td>{item.category?.name || '—'}</td>
                    <td>₹{item.price}</td>
                    <td>{item.preparationTime} min</td>
                    <td>
                      <span className={`badge badge-${item.isAvailable ? 'available' : 'cancelled'}`}>
                        {item.isAvailable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(item)} style={{ marginRight: 6 }}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>
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
                <h2>{editItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
              </div>
              <MenuForm item={editItem} onSaved={handleSaved} onClose={closeModal} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Menu;
