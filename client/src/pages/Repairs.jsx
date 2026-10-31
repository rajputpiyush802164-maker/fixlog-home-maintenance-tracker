import CrudPage from '../components/CrudPage.jsx';
import api, { errMsg, fmtDate, money } from '../api';
import { useToast } from '../components/Toast.jsx';

const FLOW = ['Requested', 'Assigned', 'In Progress', 'Completed'];
const NEXT = { Requested: 'Mark assigned', Assigned: 'Start work', 'In Progress': 'Mark completed' };

const fields = [
  { name: 'title', label: 'What is broken?', required: true, wide: true, placeholder: 'AC not cooling' },
  { name: 'appliance', label: 'Appliance', type: 'select', from: 'appliances', optional: 'Not linked' },
  { name: 'technician', label: 'Technician', type: 'select', from: 'technicians', optional: 'Not assigned' },
  { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'], default: 'Medium' },
  { name: 'scheduledDate', label: 'Scheduled for', type: 'date' },
  { name: 'cost', label: 'Cost (₹)', type: 'number', min: 0, default: 0 },
  { name: 'description', label: 'Details', type: 'textarea' },
];

export default function Repairs() {
  const toast = useToast();
  const advance = async (r, reload) => {
    try { await api.patch(`/repairs/${r._id}/status`, {}); toast('Status updated'); reload(); }
    catch (e) { toast(errMsg(e), 'err'); }
  };

  return (
    <CrudPage title="Repairs" subtitle="Track each job from request to done." endpoint="/repairs" itemName="Repair" fields={fields} lookups={['appliances', 'technicians']}
      filter={{ name: 'priority', label: 'All priorities', options: ['Low', 'Medium', 'High'] }} emptyText="Nothing to fix right now. Log a repair when something breaks."
      renderList={(items, { edit, remove, reload }) => (
        <div className="board">
          {FLOW.map((st, col) => (
            <section key={st} className="lane">
              <h2 className="lane-head"><span className={`dot s${col}`} /> {st} <em>{items.filter((i) => i.status === st).length}</em></h2>
              {items.filter((i) => i.status === st).map((r) => (
                <article key={r._id} className={`job p-${r.priority}`}>
                  <div className="d-flex justify-content-between gap-2">
                    <h3>{r.title}</h3>
                    <span className={`pill ${r.priority === 'High' ? 'bad' : r.priority === 'Medium' ? 'warn' : 'none'}`}>{r.priority}</span>
                  </div>
                  <div className="meta">{r.appliance?.name || 'No appliance linked'}</div>
                  <div className="meta"><i className="bi bi-person" /> {r.technician?.name || 'Unassigned'}</div>
                  {r.scheduledDate && <div className="meta"><i className="bi bi-calendar-event" /> {fmtDate(r.scheduledDate)}</div>}
                  <div className="track" aria-label={`Step ${col + 1} of 4`}>
                    {FLOW.map((_, i) => <span key={i} className={i <= col ? 'on' : ''} />)}
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    {r.cost > 0 && <strong className="me-auto">{money(r.cost)}</strong>}
                    {NEXT[st] && <button className="btn fx-btn sm ms-auto" onClick={() => advance(r, reload)}>{NEXT[st]}</button>}
                    <button className="icon-btn" onClick={() => edit(r)} aria-label="Edit"><i className="bi bi-pencil" /></button>
                    <button className="icon-btn danger" onClick={() => remove(r)} aria-label="Delete"><i className="bi bi-trash3" /></button>
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>
      )} />
  );
}
