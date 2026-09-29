import api from './api';

const userService = {
  getAll: (params) => api.get('/users', { params }).then((r) => r.data),
  getById: (id) => api.get(`/users/${id}`).then((r) => r.data),
  update: (id, data) => api.put(`/users/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/users/${id}`).then((r) => r.data),
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
};

export default userService;
