import React from 'react';

const TableGrid = ({ tables, onSelect }) => {
  if (!tables.length) return <div className="empty-state">No tables found.</div>;

  return (
    <div className="table-grid">
      {tables.map((table) => (
        <div
          key={table._id}
          className={`table-card ${table.status}`}
          onClick={() => onSelect(table)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && onSelect(table)}
          aria-label={`Table ${table.tableNumber}, ${table.status}`}
        >
          <h3>#{table.tableNumber}</h3>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 6 }}>
            Seats: {table.capacity}
          </div>
          <span className={`badge badge-${table.status}`}>{table.status}</span>
          {table.currentOrder && (
            <div style={{ marginTop: 6, fontSize: '0.75rem', color: '#555' }}>
              {table.currentOrder.orderNumber}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TableGrid;
