import axiosInstance from '../axiosInstance';
import * as types from '../constants/orderConstants';

export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: types.ORDER_CREATE_REQUEST });
    const { data } = await axiosInstance.post('/api/v1/orders/create/', orderData);
    dispatch({ type: types.ORDER_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.ORDER_CREATE_FAILURE,
      payload: error.response?.data?.detail || 'Failed to create order',
    });
  }
};

export const getOrderHistory = () => async (dispatch) => {
  try {
    dispatch({ type: types.ORDER_HISTORY_REQUEST });
    const { data } = await axiosInstance.get('/api/v1/orders/history/');
    dispatch({ type: types.ORDER_HISTORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.ORDER_HISTORY_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch order history',
    });
  }
};
