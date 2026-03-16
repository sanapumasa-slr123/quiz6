import axiosInstance from '../axiosInstance';
import * as types from '../constants/chatConstants';

export const sendChatMessage = (message) => async (dispatch) => {
  try {
    dispatch({ type: types.CHAT_MESSAGE_REQUEST });
    const { data } = await axiosInstance.post('/api/v1/chat/ask/', { message });
    dispatch({ type: types.CHAT_MESSAGE_SUCCESS, payload: data.reply });
  } catch (error) {
    dispatch({
      type: types.CHAT_MESSAGE_FAILURE,
      payload: error.response?.data?.detail || 'Failed to send message',
    });
  }
};

export const listAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: types.ADMIN_USERS_LIST_REQUEST });
    const { data } = await axiosInstance.get('/api/v1/users/admin/users/');
    dispatch({ type: types.ADMIN_USERS_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.ADMIN_USERS_LIST_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch users',
    });
  }
};

export const listApplicationsAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: types.ADMIN_APPLICATIONS_LIST_REQUEST });
    const { data } = await axiosInstance.get('/api/v1/applications/list/');
    dispatch({ type: types.ADMIN_APPLICATIONS_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.ADMIN_APPLICATIONS_LIST_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch applications',
    });
  }
};
