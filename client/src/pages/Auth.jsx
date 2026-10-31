import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { errMsg } from '../api';
import Field from '../components/Field.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Auth({ mode }) {
  const isReg = mode === 'register';
  const { user, login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={loc.state?.from?.pathname || '/'} replace />;

  const set = (n, v) => { setForm({ ...form, [n]: v }); setErrors({ ...errors, [n]: undefined }); };

  const submit = async (e, creds) => {
    e?.preventDefault();
    const v = creds || form;
    const er = {};
    if (isReg && !creds && v.name.trim().length < 2) er.name = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(v.email)) er.email = 'Enter a valid email';
    if (v.password.length < 6) er.password = 'At least 6 characters';
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      isReg && !creds ? await register(v.name, v.email, v.password) : await login(v.email, v.password);
      nav('/', { replace: true });
    } catch (err) { toast(errMsg(err), 'err'); }
    setBusy(false);
  };

  return (
    <div className="auth">
      <section className="auth-art">
        <div className="brand"><span className="brand-mark"><i className="bi bi-wrench-adjustable-circle-fill" /></span> FixLog</div>
        <h1>Every repair, every warranty, one place.</h1>
        <p>Know what broke, who is fixing it, and what it cost you.</p>
        <div className="demo-job">
          <div className="d-flex justify-content-between"><strong>AC not cooling</strong><span className="pill bad">High</span></div>
          <div className="meta">Split AC · Rajesh Kumar</div>
          <div className="track"><span className="on" /><span className="on" /><span className="on" /><span /></div>
          <div className="meta">In progress · visit tomorrow</div>
        </div>
      </section>
      <section className="auth-form">
        <form onSubmit={submit} noValidate>
          <h2>{isReg ? 'Create your account' : 'Welcome back'}</h2>
          <p className="muted">{isReg ? 'It takes less than a minute.' : 'Log in to see your home.'}</p>
          {isReg && <Field label="Full name" name="name" value={form.name} onChange={set} error={errors.name} />}
          <Field label="Email" name="email" type="email" value={form.email} onChange={set} error={errors.email} />
          <Field label="Password" name="password" type="password" value={form.password} onChange={set} error={errors.password} />
          <button className="btn fx-btn w-100" disabled={busy}>{busy ? 'Please wait…' : isReg ? 'Create account' : 'Log in'}</button>
          {!isReg && <button type="button" className="btn fx-btn ghost w-100 mt-2" onClick={() => submit(null, { email: 'demo@fixlog.com', password: 'demo123' })}>Try the demo account</button>}
          <p className="muted mt-3 mb-0">
            {isReg ? 'Already have an account?' : 'New to FixLog?'} <Link to={isReg ? '/login' : '/register'}>{isReg ? 'Log in' : 'Create an account'}</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
