import { FETCH_USERS_SUCCESS, FETCH_USER_SUCCESS } from '../actions/userActions';

const initialState = {
  users: [],
  selectedUser: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        selectedUser: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
