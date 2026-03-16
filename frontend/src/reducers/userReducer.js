import * as types from '../constants/userConstants';

const userInfoFromLocalStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromLocalStorage,
  loading: false,
  error: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.USER_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case types.USER_LOGIN_SUCCESS:
      return { ...state, loading: false, userInfo: action.payload };
    case types.USER_LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.USER_REGISTER_REQUEST:
      return { ...state, loading: true, error: null };
    case types.USER_REGISTER_SUCCESS:
      return { ...state, loading: false };
    case types.USER_REGISTER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.USER_LOGOUT:
      return { ...state, userInfo: null };

    case types.USER_PROFILE_REQUEST:
      return { ...state, loading: true };
    case types.USER_PROFILE_SUCCESS:
      return { ...state, loading: false };
    case types.USER_PROFILE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
