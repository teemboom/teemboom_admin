// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'
import siteReducer from './siteSlice'
import popupReducer from './popupSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    site: siteReducer,
    popup: popupReducer
  },
});

export default store;
