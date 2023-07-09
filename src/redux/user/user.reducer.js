import { UserActionTypes } from './user.types';

const INITIAL_STATE = {
  accessToken: null,
  currentUser: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload.user,
        accessToken: action.payload.accessToken,
      };

    case UserActionTypes.LOGOUT_CURRENT_USER:
      return {
        ...state,
        currentUser: null,
        accessToken: null,
      };

    default:
      return state;
  }
};

export default userReducer;
