// src/services/staffApi.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';
import { ApiResponse } from '../types/ApiResponse';
import { Locker } from '../types/Locker';

export const lockerApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLockers: builder.query<ApiResponse, { assigned: Boolean }>({
      query: ({ assigned }) => {
        let queryParams = `?assigned=${assigned}`;

        return {
          url: `/lockers/all${queryParams}`,
        };
      },
      providesTags: () => ['Locker'],
    }),
    getLockersList: builder.query<
      { data: Locker[]; totalCount: number },
      {
        page: number;
        pageSize: number;
        search?: string;
        filter?: {
          status?: string;
        };
      }
    >({
      query: ({ page, pageSize, search, filter }) => {
        let queryParams = `?page=${page}&pageSize=${pageSize}`;
        if (search) queryParams += `&search=${search}`;
        if (filter?.status !== '') queryParams += `&assigned=${filter?.status}`;

        return {
          url: `/lockers${queryParams}`,
        };
      },
      providesTags: () => ['Locker'],
    }),
    assignLocker: builder.mutation<ApiResponse, Partial<Locker>>({
      query: (data) => ({
        url: '/lockers/assign',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Invoice', 'Dashboard', 'Membership', 'Locker'],
    }),
    unAssignLocker: builder.mutation<ApiResponse, Partial<Locker>>({
      query: (data) => ({
        url: '/lockers/unassign',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Invoice', 'Dashboard', 'Membership', 'Locker'],
    }),
  }),
});

export const { useGetLockersQuery, useGetLockersListQuery, useAssignLockerMutation, useUnAssignLockerMutation } = lockerApi;
