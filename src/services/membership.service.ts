import { ApiResponse } from '../types/ApiResponse';
import { Membership } from './../types/Membership';
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';
import { Client } from '../types/Client';

export const membershipApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMemberships: builder.query<
      { data: Membership[]; totalCount: number },
      {
        page: number;
        pageSize: number;
        search?: string;
        filter?: any;
      }
    >({
      query: ({ page, pageSize, search, filter }) => {
        let queryParams = `?page=${page}&pageSize=${pageSize}`;
        if (search) queryParams += `&search=${search}`;

        return {
          url: `/memberships${queryParams}`,
          headers: {
            filter: JSON.stringify(filter || {}),
          },
        };
      },
      providesTags: (result) => ['Membership'],
    }),
    getMembershipById: builder.query<ApiResponse<Membership>, string>({
      query: (id) => `/memberships/${id}`,
    }),
    addMembership: builder.mutation<void, Partial<Membership>>({
      query: (newMembership) => ({
        url: '/memberships',
        method: 'POST',
        body: newMembership,
      }),
      invalidatesTags: ['Membership', 'Client', 'Dashboard'],
    }),
    addMembershipTransaction: builder.mutation<
      void,
      Partial<{ client: Client; membership: Membership }>
    >({
      query: (newMembership) => ({
        url: '/memberships/transaction',
        method: 'POST',
        body: newMembership,
      }),
      invalidatesTags: ['Membership', 'Client', 'Dashboard', 'Invoice'],
    }),
    updateMembership: builder.mutation<
      void,
      { id: string; membershipData: Partial<Membership> }
    >({
      query: ({ id, membershipData }) => ({
        url: `/memberships/${id}`,
        method: 'PUT',
        body: membershipData,
      }),
      invalidatesTags: ['Membership', 'Client', 'Dashboard', 'Invoice'],
    }),
    activateMembership: builder.mutation<
      void,
      { id: string; membershipData: Partial<Membership> }
    >({
      query: (id) => ({
        url: `/memberships/${id}/activate`,
        method: 'PUT',
      }),
      invalidatesTags: ['Membership', 'Client', 'Dashboard', 'Invoice'],
    }),
    deleteMembership: builder.mutation<void, string>({
      query: (id) => ({
        url: `/memberships/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Membership', 'Client', 'Dashboard', 'Invoice'],
    }),
  }),
});

export const {
  useGetMembershipsQuery,
  useGetMembershipByIdQuery,
  useAddMembershipMutation,
  useActivateMembershipMutation,
  useUpdateMembershipMutation,
  useDeleteMembershipMutation,
  useAddMembershipTransactionMutation,
} = membershipApi;
