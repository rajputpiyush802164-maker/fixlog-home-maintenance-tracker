import axios from 'axios';

// Deploy ke time .env me VITE_API_URL=https://your-api.onrender.com/api set karo
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('fixlog_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const onAuth = err.config?.url?.startsWith('/auth');
    if (err.response?.status === 401 && !onAuth) {
      localStorage.removeItem('fixlog_token');
      localStorage.removeItem('fixlog_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const errMsg = (e) => e.response?.data?.message || (e.request ? 'Cannot reach the server. Is the API running?' : e.message);
export const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
export const toInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
export default api;
