// src/services/staffApi.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';
import { ApiResponse } from '../types/ApiResponse';

export const lockerApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLockers: builder.query<ApiResponse, void>({
      query: () => `/lockers`,
      providesTags: () => ['Locker'],
    }),
  }),
});

export const {
  useGetLockersQuery,
} = lockerApi;
