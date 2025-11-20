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

  return { toasts, showToast };
};

