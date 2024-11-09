import { ApiResponse } from './../types/ApiResponse';
// src/services/staffApi.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';
import { StaffFilters } from '../types/StaffFilters';
import { Staff } from '../types/staff';

export const staffApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaffs: builder.query<
      { data: Staff[]; totalCount: number },
      {
        page: number;
        pageSize: number;
        search?: string;
        filter?: StaffFilters;
      }
    >({
      query: ({ page, pageSize, search, filter }) => {
        let queryParams = `?page=${page}&pageSize=${pageSize}`;
        if (search) queryParams += `&search=${search}`;

        return {
          url: `/staff${queryParams}`,
          headers: {
            filter: JSON.stringify(filter || {}),
          },
        };
      },
      providesTags: (result) => ['Staff'],
    }),
    getStaffById: builder.query<ApiResponse<Staff>, string>({
      query: (id) => `/staff/${id}`,
    }),
    addStaff: builder.mutation<void, Partial<Staff>>({
      query: (newStaff) => ({
        url: '/staff',
        method: 'POST',
        body: newStaff,
      }),
      invalidatesTags: ['Staff'],
    }),
    updateStaff: builder.mutation<
      void,
      { id: string; staffData: Partial<Staff> }
    >({
      query: ({ id, staffData }) => ({
        url: `/staff/${id}`,
        method: 'PUT',
        body: staffData,
      }),
      invalidatesTags: ['Staff'],
    }),
    deleteStaff: builder.mutation<void, string>({
      query: (id) => ({
        url: `/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Staff'],
    }),
  }),
});

export const {
  useGetStaffsQuery,
  useGetStaffByIdQuery,
  useAddStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApi;
