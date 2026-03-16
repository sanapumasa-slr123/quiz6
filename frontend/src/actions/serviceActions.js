import axiosInstance from '../axiosInstance';
import * as types from '../constants/serviceConstants';

export const listServices = () => async (dispatch) => {
  try {
    dispatch({ type: types.SERVICE_LIST_REQUEST });
    const { data } = await axiosInstance.get('/api/v1/services/list/');
    dispatch({ type: types.SERVICE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.SERVICE_LIST_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch services',
    });
  }
};

export const getServiceDetail = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.SERVICE_DETAIL_REQUEST });
    const { data } = await axiosInstance.get(`/api/v1/services/${id}/`);
    dispatch({ type: types.SERVICE_DETAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.SERVICE_DETAIL_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch service',
    });
  }
};

export const createService = (formData) => async (dispatch) => {
  try {
    dispatch({ type: types.SERVICE_CREATE_REQUEST });
    const { data } = await axiosInstance.post('/api/v1/services/manage/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch({ type: types.SERVICE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.SERVICE_CREATE_FAILURE,
      payload: error.response?.data || 'Failed to create service',
    });
  }
};

export const listSellerServices = () => async (dispatch) => {
  try {
    dispatch({ type: types.SELLER_SERVICES_REQUEST });
    const { data } = await axiosInstance.get('/api/v1/services/manage/');
    dispatch({ type: types.SELLER_SERVICES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.SELLER_SERVICES_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch seller services',
    });
  }
};
