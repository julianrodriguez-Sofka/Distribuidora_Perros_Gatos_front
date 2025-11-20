import { FETCH_USERS_SUCCESS, FETCH_USER_SUCCESS } from '../actions/userActions';

const initialState = {
  users: [],
  selectedUser: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

const usuariosReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        isLoading: false,
        error: null,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        selectedUser: action.payload,
        isLoading: false,
        error: null,
      };
    case 'FETCH_USERS_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_USERS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SET_USER_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    default:
      return state;
  }
};

export default usuariosReducer;

