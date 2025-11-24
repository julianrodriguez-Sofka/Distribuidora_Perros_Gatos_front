const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const categoriasReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CATEGORIAS_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_CATEGORIAS_SUCCESS':
      return { ...state, isLoading: false, items: action.payload || [], error: null };
    case 'FETCH_CATEGORIAS_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'CREATE_CATEGORIA_SUCCESS':
      return { ...state, items: [ ...(state.items || []), action.payload ] };
    case 'CREATE_SUBCATEGORIA_SUCCESS':
      // payload is the created subcategoria with parent info
      // Simple approach: append to items; UI can reload if needed
      return { ...state, items: [ ...(state.items || []), action.payload ] };
    case 'UPDATE_CATEGORIA_SUCCESS':
      return {
        ...state,
        items: (state.items || []).map(i => (i.id === action.payload.id ? action.payload : i)),
      };
    default:
      return state;
  }
};

export default categoriasReducer;

