// src/services/staffApi.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';
import { ApiResponse } from '../types/ApiResponse';
import { User } from '../types/User';

export const userApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    verifyToken: builder.query<ApiResponse, void>({
      query: () => ({
        url: '/users/verifyToken',
        method: 'GET',
      }),
    }),
    login: builder.mutation<ApiResponse, Partial<User>>({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    updateUser: builder.mutation<
      ApiResponse,
      { id: number; user: Partial<User> }
    >({
      query: ({ id, user }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    createUser: builder.mutation<ApiResponse, Partial<User>>({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
    getUsersList: builder.query<ApiResponse, void>({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    deleteUser: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLazyVerifyTokenQuery,
  useLoginMutation,
  useUpdateUserMutation,
  useCreateUserMutation,
  useGetUsersListQuery,
  useDeleteUserMutation,
} = userApi;