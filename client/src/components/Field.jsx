export default function Field({ label, name, type = 'text', value, onChange, error, options, placeholder, required }) {
  const common = {
    id: `f-${name}`, name, value: value ?? '', onChange: (e) => onChange(name, e.target.value),
    className: `form-control fx-input ${error ? 'is-invalid' : ''}`, placeholder,
  };
  return (
    <div className="mb-3">
      <label htmlFor={common.id} className="form-label fx-label">{label}{required && <span className="text-danger"> *</span>}</label>
      {type === 'select' ? (
        <select {...common} className={`form-select fx-input ${error ? 'is-invalid' : ''}`}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea {...common} rows={3} />
      ) : (
        <input {...common} type={type} />
      )}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
