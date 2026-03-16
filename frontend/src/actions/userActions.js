import axiosInstance from '../axiosInstance';
import * as types from '../constants/userConstants';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: types.USER_LOGIN_REQUEST });
    const { data } = await axiosInstance.post('/api/v1/users/login/', {
      email,
      password,
    });
    dispatch({
      type: types.USER_LOGIN_SUCCESS,
      payload: {
        token: data.access,
        refreshToken: data.refresh,
        email: data.email,
        role: data.role,
        merchant_id: data.merchant_id,
      },
    });
    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        token: data.access,
        refreshToken: data.refresh,
        email: data.email,
        role: data.role,
        merchant_id: data.merchant_id,
      })
    );
  } catch (error) {
    dispatch({
      type: types.USER_LOGIN_FAILURE,
      payload: error.response?.data?.detail || 'Login failed',
    });
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: types.USER_REGISTER_REQUEST });
    const { data } = await axiosInstance.post('/api/v1/users/register/', userData);
    dispatch({
      type: types.USER_REGISTER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.USER_REGISTER_FAILURE,
      payload: error.response?.data || 'Registration failed',
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: types.USER_LOGOUT });
  localStorage.removeItem('userInfo');
};

export const getUserProfile = () => async (dispatch) => {
  try {
    dispatch({ type: types.USER_PROFILE_REQUEST });
    const { data } = await axiosInstance.get('/api/v1/users/profile/');
    dispatch({
      type: types.USER_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.USER_PROFILE_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch profile',
    });
  }
};
