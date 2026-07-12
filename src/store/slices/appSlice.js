import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeUrl: '',
  syncScroll: true,
  reload: false,
  zoomLevel: 100,
  theme: localStorage.getItem('devview_theme') || 'dark',
  showDeviceFrames: localStorage.getItem('devview_frames') !== 'false',
  enableAnimations: localStorage.getItem('devview_animations') !== 'false',
  history: JSON.parse(localStorage.getItem('devview_history') || '[]'),
  savedProjects: JSON.parse(localStorage.getItem('devview_saved') || '[]'),
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
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('devview_theme', action.payload);
    },
    setShowDeviceFrames: (state, action) => {
      state.showDeviceFrames = action.payload;
      localStorage.setItem('devview_frames', action.payload);
    },
    setEnableAnimations: (state, action) => {
      state.enableAnimations = action.payload;
      localStorage.setItem('devview_animations', action.payload);
    },
    saveProject: (state, action) => {
      const { url, deviceIds, name } = action.payload;
      state.savedProjects.unshift({
        id: Date.now().toString(),
        name: name || url,
        url,
        deviceIds,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('devview_saved', JSON.stringify(state.savedProjects));
    },
    deleteProject: (state, action) => {
      state.savedProjects = state.savedProjects.filter(p => p.id !== action.payload);
      localStorage.setItem('devview_saved', JSON.stringify(state.savedProjects));
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
  setTheme,
  setShowDeviceFrames,
  setEnableAnimations,
  saveProject,
  deleteProject,
  incremented, 
  decremented,
  addToHistory,
  removeFromHistory,
  clearHistory
} = appSlice.actions;
export default appSlice.reducer;
