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
    getSales: builder.query({
      query: ({ type, startDate, endDate }) =>
        `/dashboard/sales?type=${type}&startDate=${startDate}&endDate=${endDate}`,
      providesTags: () => ['Sales'],
    }),
    getYearlyRevenueAnalytics: builder.query({
      query: (year) => `/dashboard/revenueAnalytics?year=${year}`,
      providesTags: () => ['RevenueAnalytics'],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetMemberAnalyticsdDataQuery,
  useGetYearlyRevenueAnalyticsQuery,
  useGetSalesQuery,
} = dashboardApi;
