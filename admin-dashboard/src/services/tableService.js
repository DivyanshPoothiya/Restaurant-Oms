import api from './api';

const tableService = {
  getAll: (params) => api.get('/tables', { params }).then((r) => r.data),
  getById: (id) => api.get(`/tables/${id}`).then((r) => r.data),
  create: (data) => api.post('/tables', data).then((r) => r.data),
  update: (id, data) => api.put(`/tables/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/tables/${id}`).then((r) => r.data),
};

export default tableService;
