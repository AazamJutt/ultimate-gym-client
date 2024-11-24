// src/services/staffApi.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';
import { ApiResponse } from '../types/ApiResponse';
import { Setting } from '../types/Setting';

export const settingsApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<ApiResponse, void>({
      query: () => `/settings`,
      providesTags: () => ['Settings'],
    }),
    updateSettings: builder.mutation<ApiResponse, Partial<Setting[]>>({
      query: (settings: Setting[]) => ({
        url: `/settings`,
        method: 'PUT',
        body: { settings },
      }),
      invalidatesTags: [
        'Settings',
        'Dashboard',
        'Invoice',
        'MemberAnalytics',
        'Membership',
      ],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
