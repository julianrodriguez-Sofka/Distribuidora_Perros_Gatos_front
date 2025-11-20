const initialState = {
  orders: [],
  selectedOrder: null,
  filter: 'Todos',
  isLoading: false,
  error: null,
};

const pedidosReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ORDERS_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_ORDERS_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        isLoading: false,
        error: null,
      };
    case 'FETCH_ORDERS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SET_ORDER_FILTER':
      return {
        ...state,
        filter: action.payload,
      };
    case 'SET_SELECTED_ORDER':
      return {
        ...state,
        selectedOrder: action.payload,
      };
    case 'UPDATE_ORDER_STATUS_SUCCESS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, estado: action.payload.estado }
            : order
        ),
        selectedOrder: state.selectedOrder?.id === action.payload.id
          ? { ...state.selectedOrder, estado: action.payload.estado }
          : state.selectedOrder,
      };
    default:
      return state;
  }
};

export default pedidosReducer;

