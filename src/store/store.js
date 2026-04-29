import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import screenReducer from './slices/screenSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    screen: screenReducer,
  },
});
