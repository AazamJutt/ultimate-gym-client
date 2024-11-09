// src/services/staffApi.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';
import { Package } from '../types/Package';

export const packageApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query({
      query: ({ status }) => `/packages${status ? `?status=${status}` : ''}`,
      providesTags: (result) => [{ type: 'Package', id: 'LIST' }],
    }),
    addPackage: builder.mutation<void, Partial<Package>>({
      query: (newPacakge) => ({
        url: '/packages',
        method: 'POST',
        body: newPacakge,
      }),
      invalidatesTags: ['Package'],
    }),
    updatePackage: builder.mutation<
      void,
      { id: string; packageData: Partial<Package> }
    >({
      query: ({ id, packageData }) => ({
        url: `/packages/${id}`,
        method: 'PUT',
        body: packageData,
      }),
      invalidatesTags: ['Package'],
    }),
    deactivatePackage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/packages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Package'],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useAddPackageMutation,
  useUpdatePackageMutation,
  useDeactivatePackageMutation,
} = packageApi;
