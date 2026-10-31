import { useCallback, useEffect, useState } from 'react';
import api, { errMsg, toInput } from '../api';
import Modal from './Modal.jsx';
import Field from './Field.jsx';
import { useToast } from './Toast.jsx';

// Reusable list + search + filter + add/edit modal + delete. Har CRUD page isi se bana hai.
export default function CrudPage({
  title, subtitle, endpoint, itemName, fields, lookups = [], filter, renderItem, renderList, summary, grid = true, emptyText,
}) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [look, setLook] = useState({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [f, setF] = useState('');
  const [editing, setEditing] = useState(null); // null | {} (new) | item
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const params = {};
      if (q) params.q = q;
      if (f && filter) params[filter.name] = f;
      setItems((await api.get(endpoint, { params })).data);
    } catch (e) { toast(errMsg(e), 'err'); }
    setLoading(false);
  }, [endpoint, q, f, filter, toast]);

  useEffect(() => { const t = setTimeout(load, 200); return () => clearTimeout(t); }, [load]);
  useEffect(() => {
    lookups.forEach(async (l) => {
      try { const r = await api.get('/' + l); setLook((s) => ({ ...s, [l]: r.data })); } catch { /* ignore */ }
    });
    // eslint-disable-next-line
  }, []);

  const open = (item = {}) => {
    const v = {};
    fields.forEach((fl) => {
      const raw = item[fl.name];
      v[fl.name] = fl.type === 'date' ? toInput(raw) : raw && typeof raw === 'object' ? raw._id : raw ?? fl.default ?? '';
    });
    setForm(v); setErrors({}); setEditing(item);
  };

  const validate = () => {
    const er = {};
    fields.forEach((fl) => {
      const v = form[fl.name];
      if (fl.required && !String(v ?? '').trim()) er[fl.name] = `${fl.label} is required`;
      else if (fl.type === 'email' && v && !/^\S+@\S+\.\S+$/.test(v)) er[fl.name] = 'Enter a valid email';
      else if (fl.type === 'number' && v !== '' && Number(v) < (fl.min ?? 0)) er[fl.name] = `Must be ${fl.min ?? 0} or more`;
    });
    setErrors(er);
    return !Object.keys(er).length;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      editing._id ? await api.put(`${endpoint}/${editing._id}`, form) : await api.post(endpoint, form);
      toast(editing._id ? `${itemName} updated` : `${itemName} added`);
      setEditing(null); load();
    } catch (er) { toast(errMsg(er), 'err'); }
    setSaving(false);
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete this ${itemName.toLowerCase()}?`)) return;
    try { await api.delete(`${endpoint}/${item._id}`); toast(`${itemName} deleted`); load(); }
    catch (er) { toast(errMsg(er), 'err'); }
  };

  const optsFor = (fl) => [
    ...(fl.optional ? [{ value: '', label: fl.optional }] : []),
    ...(fl.from ? (look[fl.from] || []).map((o) => ({ value: o._id, label: o.name })) : fl.options.map((o) => ({ value: o, label: o }))),
  ];
  const ctx = { edit: open, remove, reload: load, look };

  return (
    <>
      <div className="page-head">
        <div><h1>{title}</h1><p>{subtitle}</p></div>
        <button className="btn fx-btn" onClick={() => open()}><i className="bi bi-plus-lg" /> Add {itemName.toLowerCase()}</button>
      </div>
      {summary && summary(items)}
      <div className="toolbar">
        <div className="search"><i className="bi bi-search" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} aria-label="Search" />
        </div>
        {filter && (
          <select className="form-select fx-input w-auto" value={f} onChange={(e) => setF(e.target.value)} aria-label={filter.label}>
            <option value="">{filter.label}</option>
            {filter.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        )}
      </div>
      {loading ? <div className="empty"><div className="spinner-border spinner-border-sm" /> Loading…</div>
        : !items.length ? <div className="empty"><i className="bi bi-inbox" /><p>{emptyText}</p><button className="btn fx-btn" onClick={() => open()}>Add {itemName.toLowerCase()}</button></div>
        : renderList ? renderList(items, ctx)
        : <div className={grid ? 'cards' : 'rows'}>{items.map((it) => <div key={it._id} className={grid ? '' : 'row-item'}>{renderItem(it, ctx)}</div>)}</div>}

      {editing && (
        <Modal title={`${editing._id ? 'Edit' : 'Add'} ${itemName.toLowerCase()}`} onClose={() => setEditing(null)}>
          <form onSubmit={save} noValidate>
            <div className="row">
              {fields.map((fl) => (
                <div key={fl.name} className={fl.type === 'textarea' || fl.wide ? 'col-12' : 'col-sm-6'}>
                  <Field {...fl} options={fl.from || fl.options ? optsFor(fl) : undefined} value={form[fl.name]} error={errors[fl.name]}
                    onChange={(n, v) => { setForm({ ...form, [n]: v }); setErrors({ ...errors, [n]: undefined }); }} />
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-end gap-2 mt-2">
              <button type="button" className="btn fx-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn fx-btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
