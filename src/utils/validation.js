// Validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Mínimo 10 caracteres, 1 mayúscula, 1 número, 1 carácter especial
  const minLength = password.length >= 10;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%&*]/.test(password);
  
  return {
    isValid: minLength && hasUpperCase && hasNumber && hasSpecialChar,
    errors: {
      minLength: !minLength ? 'La contraseña debe tener al menos 10 caracteres' : null,
      hasUpperCase: !hasUpperCase ? 'Debe contener al menos 1 letra mayúscula' : null,
      hasNumber: !hasNumber ? 'Debe contener al menos 1 número' : null,
      hasSpecialChar: !hasSpecialChar ? 'Debe contener al menos 1 carácter especial (!@#$%&*)' : null,
    },
  };
};

export const validateCedula = (cedula) => {
  // Al menos 6 dígitos, solo números
  return /^\d{6,}$/.test(cedula);
};

export const validateTelefono = (telefono) => {
  // Al menos 8 dígitos, puede incluir +, -, espacios
  const cleaned = telefono.replace(/[\s\-+]/g, '');
  return /^\d{8,}$/.test(cleaned);
};

export const validateNombreCompleto = (nombre) => {
  // Mínimo 2 caracteres, solo letras y espacios
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/.test(nombre);
};

export const validateImageFile = (file) => {
  if (!file) return { isValid: false, error: 'No se seleccionó ningún archivo' };
  
  const validExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp'];
  const maxSize = 10 * 1024 * 1024; // 10 MB
  
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  const isValidExtension = validExtensions.includes(extension);
  const isValidSize = file.size <= maxSize;
  
  if (!isValidExtension) {
    return { isValid: false, error: 'Formato no válido. Usa JPG, PNG, SVG o WebP.' };
  }
  
  if (!isValidSize) {
    return { isValid: false, error: 'El archivo no debe exceder 10 MB.' };
  }
  
  return { isValid: true };
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatWeight = (weightInGrams) => {
  if (weightInGrams >= 1000) {
    return `${(weightInGrams / 1000).toFixed(1)} kg`;
  }
  return `${weightInGrams} g`;
};

export const getPetPreferences = (tienePerros, tieneGatos) => {
  if (tienePerros && tieneGatos) return 'Perros y Gatos';
  if (tienePerros) return 'Perros';
  if (tieneGatos) return 'Gatos';
  return 'Sin mascotas registradas';
};

