import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Appliances from './pages/Appliances.jsx';
import Repairs from './pages/Repairs.jsx';
import Technicians from './pages/Technicians.jsx';
import Costs from './pages/Costs.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/appliances" element={<Appliances />} />
        <Route path="/repairs" element={<Repairs />} />
        <Route path="/technicians" element={<Technicians />} />
        <Route path="/costs" element={<Costs />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
