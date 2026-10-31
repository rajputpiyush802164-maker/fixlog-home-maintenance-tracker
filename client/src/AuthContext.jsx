import { createContext, useContext, useState } from 'react';
import api from './api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('fixlog_user') || 'null'));

  const save = ({ token, user }) => {
    localStorage.setItem('fixlog_token', token);
    localStorage.setItem('fixlog_user', JSON.stringify(user));
    setUser(user);
  };
  const login = async (email, password) => save((await api.post('/auth/login', { email, password })).data);
  const register = async (name, email, password) => save((await api.post('/auth/register', { name, email, password })).data);
  const logout = () => {
    localStorage.removeItem('fixlog_token');
    localStorage.removeItem('fixlog_user');
    setUser(null);
  };
  return <Ctx.Provider value={{ user, login, register, logout }}>{children}</Ctx.Provider>;
}
