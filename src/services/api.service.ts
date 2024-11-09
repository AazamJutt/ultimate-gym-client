// src/services/apiSlice.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';

export const attendanceApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceByDate: builder.query({
      query: (date: string) => `attendance/date/${date}`,
    }),
    getStaffAttendance: builder.query({
      query: ({ staffId, page = 1, pageSize = 10 }) =>
        `attendance/staff/${staffId}?page=${page}&pageSize=${pageSize}`,
    }),
    getClientAttendance: builder.query({
      query: ({ clientId, page = 1, pageSize = 10 }) =>
        `attendance/client/${clientId}?page=${page}&pageSize=${pageSize}`,
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAttendanceByDateQuery,
  useGetStaffAttendanceQuery,
  useGetClientAttendanceQuery,
} = attendanceApi;
