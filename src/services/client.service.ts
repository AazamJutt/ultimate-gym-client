import { ApiResponse } from './../types/ApiResponse';
// src/services/clientApi.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';
import type { Client } from '../types/Client'; // Define the Client type based on your model
import { ClientFilters } from '../types/ClientFilters';

export const clientApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<
      { data: Client[]; totalCount: number },
      {
        page: number;
        pageSize: number;
        search?: string;
        filter?: ClientFilters;
      }
    >({
      query: ({ page, pageSize, search, filter }) => {
        let queryParams = `?page=${page}&pageSize=${pageSize}`;
        if (search) queryParams += `&search=${search}`;

        return {
          url: `/clients${queryParams}`,
          headers: {
            filter: JSON.stringify(filter || {}),
          },
        };
      },
      providesTags: (result) => ['Client'],
      keepUnusedDataFor: 0,
    }),
    getClientById: builder.query<ApiResponse<Client>, string>({
      query: (id) => `/clients/${id}`,
    }),
    addClient: builder.mutation<void, Partial<Client>>({
      query: (newClient) => ({
        url: '/clients',
        method: 'POST',
        body: newClient,
      }),
      invalidatesTags: ['Client', 'Dashboard'],
    }),
    updateClient: builder.mutation<
      void,
      { id: string; clientData: Partial<Client> }
    >({
      query: ({ id, clientData }) => ({
        url: `/clients/${id}`,
        method: 'PUT',
        body: clientData,
      }),
      invalidatesTags: ['Members', 'Membership', 'Client', 'Dashboard'],
    }),
    deleteClient: builder.mutation<void, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Members', 'Membership', 'Client', 'Dashboard'],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi;
