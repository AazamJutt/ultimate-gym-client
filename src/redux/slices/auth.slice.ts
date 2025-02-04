// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  exp: number;
}

export interface User {
  role: string;
  token: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<string>) => {
      const decoded = jwtDecode<DecodedToken>(action.payload);
      state.user = { role: decoded.role, token: action.payload };
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('auth_token');
    },
  },
});

// Export actions
export const { loginUser, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
