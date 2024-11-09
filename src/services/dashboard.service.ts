// src/services/staffApi.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';

export const dashboardApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => `/dashboard`,
      providesTags: () => ['Dashboard'],
    }),
    getMemberAnalyticsdData: builder.query({
      query: () => `/dashboard/memberAnalytics`,
      providesTags: () => ['MemberAnalytics'],
    }),
  }),
});

export const { useGetDashboardDataQuery, useGetMemberAnalyticsdDataQuery } = dashboardApi;
