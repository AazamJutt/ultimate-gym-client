// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode";

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
      const user: User = jwtDecode(action.payload);
      state.user = {...user, token: action.payload  };
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
