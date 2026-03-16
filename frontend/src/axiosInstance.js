import axios from 'axios';
import store from './store';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user?.userInfo?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch({ type: 'user/logout' });
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
