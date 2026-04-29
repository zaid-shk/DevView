import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeUrl: '',
  syncScroll: true,
  reload: false,
  zoomLevel: 100,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveUrl: (state, action) => {
      state.activeUrl = action.payload;
    },
    setSyncScroll: (state, action) => {
      state.syncScroll = action.payload;
    },
    setReload:( state, action)=>{
      state.reload = action.payload
    },
    incremented: state => {
      if (state.zoomLevel < 200) state.zoomLevel += 10;
    },
    decremented: state => {
      if (state.zoomLevel > 30) state.zoomLevel -= 10;
    }

  },
});

export const { setActiveUrl, setSyncScroll,setReload,incremented,decremented } = appSlice.actions;
export default appSlice.reducer;
