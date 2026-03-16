import axiosInstance from '../axiosInstance';
import * as types from '../constants/applicationConstants';

export const submitApplication = () => async (dispatch) => {
  try {
    dispatch({ type: types.APPLICATION_SUBMIT_REQUEST });
    const { data } = await axiosInstance.post('/api/v1/applications/apply/');
    dispatch({ type: types.APPLICATION_SUBMIT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.APPLICATION_SUBMIT_FAILURE,
      payload: error.response?.data?.detail || 'Failed to submit application',
    });
  }
};

export const listApplications = () => async (dispatch) => {
  try {
    dispatch({ type: types.APPLICATION_LIST_REQUEST });
    const { data } = await axiosInstance.get('/api/v1/applications/list/');
    dispatch({ type: types.APPLICATION_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.APPLICATION_LIST_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch applications',
    });
  }
};

export const approveApplication = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.APPLICATION_APPROVE_REQUEST });
    const { data } = await axiosInstance.post(`/api/v1/applications/${id}/approve/`);
    dispatch({ type: types.APPLICATION_APPROVE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.APPLICATION_APPROVE_FAILURE,
      payload: error.response?.data?.detail || 'Failed to approve application',
    });
  }
};

export const declineApplication = (id, reason) => async (dispatch) => {
  try {
    dispatch({ type: types.APPLICATION_DECLINE_REQUEST });
    const { data } = await axiosInstance.post(`/api/v1/applications/${id}/decline/`, {
      decline_reason: reason,
    });
    dispatch({ type: types.APPLICATION_DECLINE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.APPLICATION_DECLINE_FAILURE,
      payload: error.response?.data?.detail || 'Failed to decline application',
    });
  }
};
