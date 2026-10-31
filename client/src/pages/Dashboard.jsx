import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api, { errMsg, fmtDate, money } from '../api';
import { useAuth } from '../AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [d, setD] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then((r) => setD(r.data)).catch((e) => toast(errMsg(e), 'err'));
    // eslint-disable-next-line
  }, []);

  if (!d) return <div className="empty"><div className="spinner-border spinner-border-sm" /> Loading your home…</div>;

  const stats = [
    ['bi-house-gear-fill', 'Appliances', d.counts.appliances, '/appliances', 'blue'],
    ['bi-wrench-adjustable', 'Open repairs', d.counts.openRepairs, '/repairs', 'amber'],
    ['bi-people-fill', 'Technicians', d.counts.technicians, '/technicians', 'teal'],
    ['bi-wallet2', 'Total spent', money(d.totalSpent), '/costs', 'coral'],
  ];
  const total = Object.values(d.byStatus).reduce((a, b) => a + b, 0) || 1;
  const hour = new Date().getHours();

  return (
    <>
      <div className="page-head">
        <div><h1>{hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'}, {user.name.split(' ')[0]}</h1>
          <p>{d.counts.openRepairs ? `${d.counts.openRepairs} repair${d.counts.openRepairs > 1 ? 's' : ''} still open.` : 'No open repairs. Everything is working.'}</p></div>
        <Link to="/repairs" className="btn fx-btn"><i className="bi bi-plus-lg" /> New repair</Link>
      </div>

      <div className="stats">
        {stats.map(([icon, label, val, to, tone]) => (
          <Link to={to} key={label} className={`stat ${tone}`}>
            <i className={`bi ${icon}`} /><span>{label}</span><strong>{val}</strong>
          </Link>
        ))}
      </div>

      <div className="dash-grid">
        <section className="panel span2">
          <h2>Spending, last 6 months</h2>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={d.monthly} margin={{ left: -10 }}>
                <CartesianGrid vertical={false} stroke="var(--line)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="var(--muted)" />
                <YAxis tickLine={false} axisLine={false} stroke="var(--muted)" tickFormatter={(v) => (v >= 1000 ? v / 1000 + 'k' : v)} />
                <Tooltip formatter={(v) => money(v)} contentStyle={{ borderRadius: 10, border: '1px solid var(--line)', background: 'var(--card)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="maintenance" name="Maintenance" stackId="a" fill="#12a0a0" radius={[0, 0, 4, 4]} />
                <Bar dataKey="repairs" name="Repairs" stackId="a" fill="#ffc20e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <h2>Repair pipeline</h2>
          <div className="pipe">{Object.entries(d.byStatus).map(([k, v], i) => <span key={k} className={`s${i}`} style={{ flex: v || 0.0001 }} title={`${k}: ${v}`} />)}</div>
          <ul className="legend">
            {Object.entries(d.byStatus).map(([k, v], i) => <li key={k}><span className={`dot s${i}`} /> {k}<strong>{v}</strong></li>)}
          </ul>
          <small className="muted">{total === 1 && !Object.values(d.byStatus).some(Boolean) ? 'No repairs logged yet.' : ''}</small>
        </section>

        <section className="panel">
          <h2>Coming up</h2>
          {d.reminders.length ? (
            <ul className="remind">
              {d.reminders.map((r, i) => (
                <li key={i}><i className={`bi ${r.type === 'warranty' ? 'bi-shield-exclamation' : 'bi-bell-fill'}`} />
                  <div><div>{r.title}</div><small className="muted">{fmtDate(r.date)}</small></div></li>
              ))}
            </ul>
          ) : <p className="muted">No warranties ending or services due soon.</p>}
        </section>

        <section className="panel span2">
          <h2>Recent repairs</h2>
          {d.recent.length ? (
            <ul className="recent">
              {d.recent.map((r) => (
                <li key={r._id}><div className="grow"><div className="fw-semibold">{r.title}</div><small className="muted">{r.appliance?.name || 'No appliance'}</small></div>
                  <span className={`chip st-${r.status.replace(' ', '')}`}>{r.status}</span></li>
              ))}
            </ul>
          ) : <p className="muted">Nothing logged yet.</p>}
        </section>
      </div>
    </>
  );
}
