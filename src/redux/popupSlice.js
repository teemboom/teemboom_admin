import { createSlice } from '@reduxjs/toolkit';

const popupSlice = createSlice({
  name: 'popup',
  initialState: {
    isVisible: false,
    message: '',
  },
  reducers: {
    showPopup: (state, action) => {
      state.isVisible = true;
      state.message = action.payload;
    },
    hidePopup: (state) => {
      state.isVisible = false;
      state.message = '';
    },
  },
});

export const { showPopup, hidePopup } = popupSlice.actions;
export default popupSlice.reducer; 