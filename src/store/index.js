import { configureStore } from "@reduxjs/toolkit";
import screenReducer from "./slices/screenSlice";

export const store = configureStore({
  reducer: {
    screen: screenReducer,
  },
});
