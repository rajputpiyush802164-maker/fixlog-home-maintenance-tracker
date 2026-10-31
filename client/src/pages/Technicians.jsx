import CrudPage from '../components/CrudPage.jsx';

const SPEC = ['General', 'Electrician', 'Plumber', 'AC & Cooling', 'Carpenter', 'Appliance repair', 'Painter'];
const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'specialty', label: 'Specialty', type: 'select', options: SPEC, default: 'General' },
  { name: 'phone', label: 'Phone' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'rating', label: 'Rating (1–5)', type: 'number', min: 1, default: 4 },
];

export default function Technicians() {
  return (
    <CrudPage title="Technicians" subtitle="People you trust to fix things." endpoint="/technicians" itemName="Technician" fields={fields}
      filter={{ name: 'specialty', label: 'All specialties', options: SPEC }} emptyText="No technicians saved yet."
      renderItem={(t, { edit, remove }) => (
        <div className="card-x">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div className="avatar lg">{t.name[0].toUpperCase()}</div>
            <div><h3 className="m-0">{t.name}</h3><div className="meta">{t.specialty}</div></div>
          </div>
          <div className="stars" aria-label={`${t.rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((n) => <i key={n} className={`bi ${n <= t.rating ? 'bi-star-fill' : 'bi-star'}`} />)}
          </div>
          <div className="d-flex gap-2 mt-3 flex-wrap">
            {t.phone && <a className="btn fx-btn sm" href={`tel:${t.phone.replace(/\s/g, '')}`}><i className="bi bi-telephone-fill" /> {t.phone}</a>}
            {t.email && <a className="btn fx-btn ghost sm" href={`mailto:${t.email}`}><i className="bi bi-envelope" /> Email</a>}
          </div>
          <div className="card-actions">
            <button className="icon-btn" onClick={() => edit(t)} aria-label="Edit"><i className="bi bi-pencil" /></button>
            <button className="icon-btn danger" onClick={() => remove(t)} aria-label="Delete"><i className="bi bi-trash3" /></button>
          </div>
        </div>
      )} />
  );
}
