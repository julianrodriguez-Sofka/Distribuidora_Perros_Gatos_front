const initialState = {
  catalog: {},
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
};

const productosReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CATALOG_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_CATALOG_SUCCESS':
      return {
        ...state,
        catalog: action.payload,
        isLoading: false,
        error: null,
      };
    case 'FETCH_CATALOG_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'FETCH_PRODUCTS_SUCCESS':
      return {
        ...state,
        products: action.payload,
        isLoading: false,
      };
    case 'SET_SELECTED_PRODUCT':
      return {
        ...state,
        selectedProduct: action.payload,
      };
    default:
      return state;
  }
};

export default productosReducer;

