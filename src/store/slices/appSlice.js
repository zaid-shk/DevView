import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeUrl: '',
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
