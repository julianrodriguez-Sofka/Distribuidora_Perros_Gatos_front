const initialState = {
  selectedProduct: null,
  inventoryHistory: [],
  searchResults: [],
  isLoading: false,
  error: null,
};

const inventarioReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_INVENTORY_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'SET_SELECTED_PRODUCT':
      return {
        ...state,
        selectedProduct: action.payload,
      };
    case 'UPDATE_INVENTORY_SUCCESS':
      return {
        ...state,
        selectedProduct: action.payload,
        isLoading: false,
      };
    case 'FETCH_INVENTORY_HISTORY_SUCCESS':
      return {
        ...state,
        inventoryHistory: action.payload,
        isLoading: false,
      };
    case 'SEARCH_PRODUCTS_SUCCESS':
      return {
        ...state,
        searchResults: action.payload,
        isLoading: false,
      };
    case 'FETCH_INVENTORY_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default inventarioReducer;

