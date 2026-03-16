import * as types from '../constants/orderConstants';

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ORDER_CREATE_REQUEST:
      return { ...state, loading: true, error: null };
    case types.ORDER_CREATE_SUCCESS:
      return { ...state, loading: false };
    case types.ORDER_CREATE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.ORDER_HISTORY_REQUEST:
      return { ...state, loading: true, error: null };
    case types.ORDER_HISTORY_SUCCESS:
      return { ...state, loading: false, orders: action.payload };
    case types.ORDER_HISTORY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
