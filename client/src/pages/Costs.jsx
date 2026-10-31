import CrudPage from '../components/CrudPage.jsx';
import { fmtDate, money } from '../api';

const fields = [
  { name: 'title', label: 'What was done', required: true, placeholder: 'AC service', wide: true },
  { name: 'appliance', label: 'Appliance', type: 'select', from: 'appliances', optional: 'Not linked' },
  { name: 'type', label: 'Type', type: 'select', options: ['Service', 'Part replacement', 'Cleaning', 'Inspection', 'Other'], default: 'Service' },
  { name: 'cost', label: 'Cost (₹)', type: 'number', min: 0, default: 0 },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'nextDue', label: 'Next due (reminder)', type: 'date' },
];

export default function Costs() {
  return (
    <CrudPage title="Costs" subtitle="Maintenance history and what it cost you." endpoint="/maintenance" itemName="Record" fields={fields}
      lookups={['appliances']} grid={false} emptyText="No maintenance logged yet."
      summary={(items) => (
        <div className="total-strip">
          <div><small>Total spent on maintenance</small><strong>{money(items.reduce((s, i) => s + (i.cost || 0), 0))}</strong></div>
          <div><small>Records</small><strong>{items.length}</strong></div>
        </div>
      )}
      renderItem={(m, { edit, remove }) => (
        <div className="cost-row">
          <div className="grow">
            <div className="fw-semibold">{m.title}</div>
            <div className="meta">{m.appliance?.name || 'General'} · {m.type} · {fmtDate(m.date)}</div>
            {m.nextDue && <span className="pill warn"><i className="bi bi-bell" /> Next due {fmtDate(m.nextDue)}</span>}
          </div>
          <div className="amount">{money(m.cost)}</div>
          <button className="icon-btn" onClick={() => edit(m)} aria-label="Edit"><i className="bi bi-pencil" /></button>
          <button className="icon-btn danger" onClick={() => remove(m)} aria-label="Delete"><i className="bi bi-trash3" /></button>
        </div>
      )} />
  );
}
