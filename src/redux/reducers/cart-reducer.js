const initialState = {
  items: [],
  itemCount: 0,
  total: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CART_LOAD':
      return {
        ...state,
        items: action.payload,
        itemCount: action.payload.reduce((sum, item) => sum + item.cantidad, 0),
        total: action.payload.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
      };
    case 'CART_ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      let newItems;
      
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, cantidad: item.cantidad + (action.payload.cantidad || 1) }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, cantidad: action.payload.cantidad || 1 }];
      }
      
      return {
        ...state,
        items: newItems,
        itemCount: newItems.reduce((sum, item) => sum + item.cantidad, 0),
        total: newItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
      };
    case 'CART_REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        itemCount: filteredItems.reduce((sum, item) => sum + item.cantidad, 0),
        total: filteredItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
      };
    case 'CART_UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.productId
          ? { ...item, cantidad: action.payload.quantity }
          : item
      ).filter(item => item.cantidad > 0);
      
      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, item) => sum + item.cantidad, 0),
        total: updatedItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
      };
    case 'CART_CLEAR':
      return initialState;
    case 'CART_MERGE':
      return {
        ...state,
        items: action.payload,
        itemCount: action.payload.reduce((sum, item) => sum + item.cantidad, 0),
        total: action.payload.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
      };
    default:
      return state;
  }
};

export default cartReducer;

