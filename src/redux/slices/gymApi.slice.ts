import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080/api',
  prepareHeaders: (headers, { getState }) => {
    // Retrieve the token from your state (modify according to your state structure)
    const token = (getState() as RootState).auth.user?.token;
    // If a token exists, set it in the Authorization header
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const ultimateGymApiSlice = createApi({
  reducerPath: 'apiSlice',
  tagTypes: [
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
  ],
  baseQuery: baseQuery,
  endpoints: (builder) => ({}),
});
