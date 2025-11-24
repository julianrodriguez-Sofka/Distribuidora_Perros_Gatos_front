// Toast utility - Simple implementation
let toastListeners = [];
// Track message counts to avoid duplicate toasts showing at the same time
const messageCounts = new Map();
// Map toast id -> message so we can decrement counts on removal
const idToMessage = new Map();

export const toast = {
  show: (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    // Normalize message to a string to avoid React rendering objects
    let msg = '';
    try {
      if (typeof message === 'string') msg = message;
      else if (!message) msg = '';
      else if (typeof message === 'object') {
        if (typeof message.message === 'string') msg = message.message;
        else if (typeof message.error === 'string') msg = message.error;
        else if (Array.isArray(message)) msg = message.join(', ');
        else {
          // Try to extract stringy values
          const vals = Object.values(message).filter(v => typeof v === 'string');
          if (vals.length) msg = vals.join(' - ');
          else msg = JSON.stringify(message);
        }
      } else {
        msg = String(message);
      }
    } catch (e) {
      msg = String(message);
    }

    // Avoid showing duplicate messages simultaneously
    if (msg && messageCounts.has(msg)) {
      return null;
    }

    if (msg) messageCounts.set(msg, 1);

    const toastData = { id, message: msg, type, duration };
    if (msg) idToMessage.set(id, msg);

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
    // Notify listeners to remove the toast UI
    toastListeners.forEach(listener => listener({ id, remove: true }));

    // Decrement message count for this id if known
    const msg = idToMessage.get(id);
    if (msg) {
      const curr = messageCounts.get(msg) || 0;
      if (curr <= 1) messageCounts.delete(msg);
      else messageCounts.set(msg, curr - 1);
      idToMessage.delete(id);
    }
  },
  
  subscribe: (listener) => {
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  },
};

