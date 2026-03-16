import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/userReducer';
import { serviceReducer } from './reducers/serviceReducer';
import { applicationReducer } from './reducers/applicationReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    service: serviceReducer,
    application: applicationReducer,
  },
});

export default store;
