import api from './api';

const menuService = {
  getAll: (params) => api.get('/menu', { params }).then((r) => r.data),
  getById: (id) => api.get(`/menu/${id}`).then((r) => r.data),
  create: (data) => api.post('/menu', data).then((r) => r.data),
  update: (id, data) => api.put(`/menu/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/menu/${id}`).then((r) => r.data),
};

export default menuService;
