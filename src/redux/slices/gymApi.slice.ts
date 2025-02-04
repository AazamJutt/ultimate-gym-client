import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { logout } from './auth.slice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.user?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithLogout = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  
  if (result.error) {
    const error = result.error as FetchBaseQueryError;
    
    if (error.status === 401 || error.status === 403) {
      localStorage.clear();
      
      api.dispatch(logout());
    }
    
    if (error.status === 500) {
      console.error('Server error:', error);
    }
  }
  
  return result;
};

export const ultimateGymApiSlice = createApi({
  reducerPath: 'apiSlice',
  tagTypes: [
    'Settings',
    'Dashboard',
    'Members',
    'Membership',
    'User',
    'Locker',
    'Client',
    'Invoice',
    'Attendance',
    'Package',
    'Staff',
    'MemberAnalytics',
    'Sales',
    'RevenueAnalytics',
  ],
  baseQuery: baseQueryWithLogout,
  endpoints: (builder) => ({}),
});
