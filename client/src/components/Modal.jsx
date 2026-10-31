import { useEffect } from 'react';

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fx-backdrop" onMouseDown={onClose}>
      <div className="fx-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <div className="fx-modal-head">
          <h5 className="m-0">{title}</h5>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg" /></button>
        </div>
        <div className="fx-modal-body">{children}</div>
      </div>
    </div>
  );
}
