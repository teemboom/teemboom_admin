// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'
import siteReducer from './siteSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    site: siteReducer
  },
});

export default store;
