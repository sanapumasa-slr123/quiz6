import * as types from '../constants/serviceConstants';

const initialState = {
  services: [],
  service: null,
  loading: false,
  error: null,
};

export const serviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SERVICE_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case types.SERVICE_LIST_SUCCESS:
      return { ...state, loading: false, services: action.payload };
    case types.SERVICE_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.SERVICE_DETAIL_REQUEST:
      return { ...state, loading: true, error: null };
    case types.SERVICE_DETAIL_SUCCESS:
      return { ...state, loading: false, service: action.payload };
    case types.SERVICE_DETAIL_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.SERVICE_CREATE_REQUEST:
      return { ...state, loading: true, error: null };
    case types.SERVICE_CREATE_SUCCESS:
      return { ...state, loading: false };
    case types.SERVICE_CREATE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.SELLER_SERVICES_REQUEST:
      return { ...state, loading: true, error: null };
    case types.SELLER_SERVICES_SUCCESS:
      return { ...state, loading: false, services: action.payload };
    case types.SELLER_SERVICES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
