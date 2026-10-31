import CrudPage from '../components/CrudPage.jsx';
import { fmtDate } from '../api';

const CATS = ['Cooling', 'Kitchen', 'Laundry', 'Plumbing', 'Electronics', 'Electrical', 'Furniture', 'Other'];
const ICON = { Cooling: 'bi-snow2', Kitchen: 'bi-cup-hot-fill', Laundry: 'bi-droplet-half', Plumbing: 'bi-moisture', Electronics: 'bi-tv-fill', Electrical: 'bi-lightning-charge-fill', Furniture: 'bi-lamp-fill', Other: 'bi-box-seam-fill' };

function warranty(d) {
  if (!d) return ['none', 'No warranty info'];
  const days = Math.ceil((new Date(d) - Date.now()) / 864e5);
  if (days < 0) return ['bad', 'Warranty expired'];
  if (days <= 60) return ['warn', `Warranty ends in ${days} days`];
  return ['good', `Under warranty till ${fmtDate(d)}`];
}

const fields = [
  { name: 'name', label: 'Appliance name', required: true, placeholder: 'Split AC' },
  { name: 'category', label: 'Category', type: 'select', options: CATS, default: 'Other' },
  { name: 'brand', label: 'Brand' }, { name: 'model', label: 'Model' },
  { name: 'location', label: 'Location in home', placeholder: 'Bedroom' },
  { name: 'purchaseDate', label: 'Purchase date', type: 'date' },
  { name: 'warrantyUntil', label: 'Warranty valid until', type: 'date' },
  { name: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Appliances() {
  return (
    <CrudPage title="Appliances" subtitle="Everything in your home, with warranty status at a glance." endpoint="/appliances" itemName="Appliance"
      fields={fields} filter={{ name: 'category', label: 'All categories', options: CATS }} emptyText="No appliances yet. Add your first one to start tracking."
      renderItem={(a, { edit, remove }) => {
        const [tone, text] = warranty(a.warrantyUntil);
        return (
          <div className="card-x appliance">
            <div className="app-icon"><i className={`bi ${ICON[a.category] || ICON.Other}`} /></div>
            <h3>{a.name}</h3>
            <div className="meta">{[a.brand, a.model].filter(Boolean).join(' ') || a.category}</div>
            {a.location && <div className="meta"><i className="bi bi-geo-alt" /> {a.location}</div>}
            <span className={`pill ${tone}`}>{text}</span>
            <div className="card-actions">
              <button className="icon-btn" onClick={() => edit(a)} aria-label="Edit"><i className="bi bi-pencil" /></button>
              <button className="icon-btn danger" onClick={() => remove(a)} aria-label="Delete"><i className="bi bi-trash3" /></button>
            </div>
          </div>
        );
      }} />
  );
}
