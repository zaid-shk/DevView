import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeUrl: 'http://localhost:5173',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveUrl: (state, action) => {
      state.activeUrl = action.payload;
    },
  },
});

export const { setActiveUrl } = appSlice.actions;
export default appSlice.reducer;
