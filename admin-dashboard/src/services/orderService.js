import api from './api';

const orderService = {
  getAll: (params) => api.get('/orders', { params }).then((r) => r.data),
  getById: (id) => api.get(`/orders/${id}`).then((r) => r.data),
  create: (data) => api.post('/orders', data).then((r) => r.data),
  update: (id, data) => api.put(`/orders/${id}`, data).then((r) => r.data),
  updateStatus: (id, status) =>
    api.patch(`/orders/${id}/status`, { status }).then((r) => r.data),
  delete: (id) => api.delete(`/orders/${id}`).then((r) => r.data),
};

export default orderService;
