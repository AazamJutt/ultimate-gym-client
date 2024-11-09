// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import authReducer from './slices/auth.slice';
import { ultimateGymApiSlice } from './slices/gymApi.slice';

export const store = configureStore({
  reducer: {
    [ultimateGymApiSlice.reducerPath]: ultimateGymApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ultimateGymApiSlice.middleware),
});

// Optional, if you want to enable refetching on focus or network status
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
