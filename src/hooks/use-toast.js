import { useState, useEffect } from 'react';
import { toast } from '../utils/toast';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((toastData) => {
      if (toastData.remove) {
        setToasts((prev) => prev.filter((t) => t.id !== toastData.id));
      } else {
        setToasts((prev) => [...prev, toastData]);
      }
    });

    return unsubscribe;
  }, []);

  const showToast = (message, type, duration) => {
    toast.show(message, type, duration);
  };

  const success = (message, duration) => showToast(message, 'success', duration);
  const error = (message, duration) => showToast(message, 'error', duration);
  const warning = (message, duration) => showToast(message, 'warning', duration);
  const info = (message, duration) => showToast(message, 'info', duration);

  return { toasts, showToast, success, error, warning, info };
};

