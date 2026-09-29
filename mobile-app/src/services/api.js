import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️  Physical device pe localhost kaam nahi karta.
//     Apna local IP daalo (same WiFi pe hona chahiye backend ke saath).
//     Example: http://192.168.1.100:5000/api
const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Har request ke saath token attach karo
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('oms_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (_) {
      // AsyncStorage read fail hone par bhi request jaaye
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 401 pe auto-logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['oms_token', 'oms_user']);
    }
    return Promise.reject(error);
  }
);

export default api;
