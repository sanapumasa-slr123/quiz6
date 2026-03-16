import * as types from '../constants/chatConstants';

const initialState = {
  messages: [],
  loading: false,
  error: null,
  users: [],
  applications: [],
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHAT_MESSAGE_REQUEST:
      return { ...state, loading: true, error: null };
    case types.CHAT_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: [...state.messages, { reply: action.payload }],
      };
    case types.CHAT_MESSAGE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.ADMIN_USERS_LIST_REQUEST:
      return { ...state, loading: true };
    case types.ADMIN_USERS_LIST_SUCCESS:
      return { ...state, loading: false, users: action.payload };
    case types.ADMIN_USERS_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.ADMIN_APPLICATIONS_LIST_REQUEST:
      return { ...state, loading: true };
    case types.ADMIN_APPLICATIONS_LIST_SUCCESS:
      return { ...state, loading: false, applications: action.payload };
    case types.ADMIN_APPLICATIONS_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
