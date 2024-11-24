// src/services/staffApi.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';
import { Attendance } from '../types/attendance';

export const attendanceApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addAttendance: builder.mutation<
      void,
      { attendanceData: Partial<Attendance> }
    >({
      query: (attendanceData) => ({
        url: `/attendance`,
        method: 'POST',
        body: attendanceData,
      }),
      invalidatesTags: ['Attendance', 'Client', 'Staff', 'Dashboard'],
    }),
    getAttendances: builder.query({
      query: ({ page, pageSize, search, filter }) => {
        console.log(filter);
        let queryParams = `?page=${page}&pageSize=${pageSize}`;
        if (search) queryParams += `&search=${search}`;
        if (filter?.member_id) queryParams += `&member_id=${filter?.member_id}`;
        if (filter?.type) queryParams += `&type=${filter?.type}`;
        if (filter?.startDate) queryParams += `&startDate=${filter?.startDate}`;
        if (filter?.endDate) queryParams += `&endDate=${filter?.endDate}`;
        return {
          url: `/attendance${queryParams}`,
        };
      },
      providesTags: (result) => ['Attendance'],
    }),
    markAttendance: builder.mutation<void, Partial<Attendance>>({
      query: (attendanceData) => ({
        url: `/attendance/mark`,
        method: 'POST',
        body: attendanceData,
      }),
      invalidatesTags: ['Attendance', 'Client', 'Staff', 'Dashboard'],
    }),
  }),
});

export const {
  useAddAttendanceMutation,
  useGetAttendancesQuery,
  useMarkAttendanceMutation,
} = attendanceApi;
