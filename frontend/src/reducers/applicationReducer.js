import * as types from '../constants/applicationConstants';

const initialState = {
  applications: [],
  loading: false,
  error: null,
  submitted: false,
};

export const applicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.APPLICATION_SUBMIT_REQUEST:
      return { ...state, loading: true, error: null };
    case types.APPLICATION_SUBMIT_SUCCESS:
      return { ...state, loading: false, submitted: true };
    case types.APPLICATION_SUBMIT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.APPLICATION_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case types.APPLICATION_LIST_SUCCESS:
      return { ...state, loading: false, applications: action.payload };
    case types.APPLICATION_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.APPLICATION_APPROVE_REQUEST:
      return { ...state, loading: true };
    case types.APPLICATION_APPROVE_SUCCESS:
      return { ...state, loading: false };
    case types.APPLICATION_APPROVE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.APPLICATION_DECLINE_REQUEST:
      return { ...state, loading: true };
    case types.APPLICATION_DECLINE_SUCCESS:
      return { ...state, loading: false };
    case types.APPLICATION_DECLINE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
