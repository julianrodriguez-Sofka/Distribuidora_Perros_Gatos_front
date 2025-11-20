// Action types
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';

// Mock Data as per HU
const mockUsers = [
  {
    id: 'usr-789',
    nombreCompleto: 'Carlos Méndez',
    cedula: '98765432',
    email: 'carlos@ejemplo.com',
    telefono: '+56 9 8765 4321',
    direccionEnvio: 'Avenida Siempre Viva 742',
    tienePerros: true,
    tieneGatos: false,
  },
  {
    id: 'usr-123',
    nombreCompleto: 'María López',
    cedula: '12345678',
    email: 'maria@ejemplo.com',
    telefono: '+56 9 1234 5678',
    direccionEnvio: 'Calle Falsa 123, Ciudad',
    tienePerros: true,
    tieneGatos: true,
  },
];

// Actions
export const fetchUsers = () => (dispatch) => {
  // In a real app, you'd fetch from an API.
  // For now, we'll just use the mock data.
  dispatch({
    type: FETCH_USERS_SUCCESS,
    payload: mockUsers,
  });
};

export const fetchUserById = (id) => (dispatch) => {
  // In a real app, you'd fetch from an API.
  const user = mockUsers.find((u) => u.id === id);
  dispatch({
    type: FETCH_USER_SUCCESS,
    payload: user,
  });
};
