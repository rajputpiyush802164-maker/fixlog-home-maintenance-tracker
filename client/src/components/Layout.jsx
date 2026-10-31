import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const NAV = [
  ['/', 'bi-grid-1x2-fill', 'Dashboard'],
  ['/appliances', 'bi-house-gear-fill', 'Appliances'],
  ['/repairs', 'bi-wrench-adjustable', 'Repairs'],
  ['/technicians', 'bi-people-fill', 'Technicians'],
  ['/costs', 'bi-wallet2', 'Costs'],
];

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('fixlog_theme') === 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('fixlog_theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="shell">
      <aside className={`side ${open ? 'open' : ''}`}>
        <div className="brand"><span className="brand-mark"><i className="bi bi-wrench-adjustable-circle-fill" /></span> FixLog</div>
        <nav className="side-nav" onClick={() => setOpen(false)}>
          {NAV.map(([to, icon, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
              <i className={`bi ${icon}`} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <div className="avatar">{user.name[0].toUpperCase()}</div>
          <div className="flex-grow-1 text-truncate">
            <div className="fw-semibold text-truncate">{user.name}</div>
            <small className="opacity-75 text-truncate d-block">{user.email}</small>
          </div>
          <button className="icon-btn light" title="Log out" onClick={() => { logout(); nav('/login'); }}><i className="bi bi-box-arrow-right" /></button>
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main">
        <header className="topbar">
          <button className="icon-btn d-lg-none" onClick={() => setOpen(true)} aria-label="Menu"><i className="bi bi-list" /></button>
          <div className="ms-auto d-flex gap-2">
            <button className="icon-btn" onClick={() => setDark(!dark)} title="Toggle theme"><i className={`bi ${dark ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`} /></button>
          </div>
        </header>
        <main className="page"><Outlet /></main>
      </div>
    </div>
  );
}
