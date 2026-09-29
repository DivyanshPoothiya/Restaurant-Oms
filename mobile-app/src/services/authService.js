import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('oms_token', res.data.token);
    await AsyncStorage.setItem('oms_user', JSON.stringify(res.data.user));
    return res.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem('oms_token');
    await AsyncStorage.removeItem('oms_user');
  },
  getStoredUser: async () => {
    const user = await AsyncStorage.getItem('oms_user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
