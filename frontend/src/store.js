import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/userReducer';
import { serviceReducer } from './reducers/serviceReducer';
import { applicationReducer } from './reducers/applicationReducer';
import { orderReducer } from './reducers/orderReducer';
import { chatReducer } from './reducers/chatReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    service: serviceReducer,
    application: applicationReducer,
    order: orderReducer,
    chat: chatReducer,
  },
});

export default store;
