// src/services/staffApi.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';
import { Attendance } from '../types/attendance';

export const attendanceApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendances: builder.query({
      query: ({ status }) => `/attendances${status ? `?status=${status}` : ''}`,
      providesTags: (result) => ['Attendance'],
    }),
    markAttendance: builder.mutation<
      void,
      { attendanceData: Partial<Attendance> }
    >({
      query: (attendanceData) => ({
        url: `/attendance/mark`,
        method: 'POST',
        body: attendanceData,
      }),
      invalidatesTags: ['Attendance', 'Client', 'Staff', 'Dashboard'],
    }),
  }),
});

export const { useGetAttendancesQuery, useMarkAttendanceMutation } =
  attendanceApi;
