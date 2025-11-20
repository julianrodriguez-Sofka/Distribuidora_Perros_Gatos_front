// Toast utility - Simple implementation
let toastListeners = [];

export const toast = {
  show: (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const toastData = { id, message, type, duration };
    
    // Notify all listeners
    toastListeners.forEach(listener => listener(toastData));
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        toast.remove(id);
      }, duration);
    }
    
    return id;
  },
  
  success: (message, duration) => toast.show(message, 'success', duration),
  error: (message, duration) => toast.show(message, 'error', duration),
  warning: (message, duration) => toast.show(message, 'warning', duration),
  info: (message, duration) => toast.show(message, 'info', duration),
  
  remove: (id) => {
    toastListeners.forEach(listener => listener({ id, remove: true }));
  },
  
  subscribe: (listener) => {
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  },
};

