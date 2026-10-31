import { createContext, useCallback, useContext, useState } from 'react';

const Ctx = createContext(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const toast = useCallback((msg, type = 'ok') => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, msg, type }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            <i className={`bi ${t.type === 'ok' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} /> {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
