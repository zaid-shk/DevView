import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeUrl: '',
  syncScroll: true,
  reload: false,
  zoomLevel: 100,
  history: JSON.parse(localStorage.getItem('devview_history') || '[]'),
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
    },
    addToHistory: (state, action) => {
      const url = action.payload;
      if (!url) return;
      
      // Remove if exists to move to top
      state.history = state.history.filter(item => item.url !== url);
      
      // Add to beginning
      state.history.unshift({
        url,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      });
      
      // Limit to 50 items
      if (state.history.length > 50) {
        state.history.pop();
      }
      
      localStorage.setItem('devview_history', JSON.stringify(state.history));
    },
    removeFromHistory: (state, action) => {
      state.history = state.history.filter(item => item.id !== action.payload);
      localStorage.setItem('devview_history', JSON.stringify(state.history));
    },
    clearHistory: (state) => {
      state.history = [];
      localStorage.removeItem('devview_history');
    }
  },
});

export const { 
  setActiveUrl, 
  setSyncScroll, 
  setReload, 
  incremented, 
  decremented,
  addToHistory,
  removeFromHistory,
  clearHistory
} = appSlice.actions;
export default appSlice.reducer;
