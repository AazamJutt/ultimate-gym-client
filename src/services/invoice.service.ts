// src/services/staffApi.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';
import { Invoice } from '../types/Invoice';

export const invoiceApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: () => `/invoices`,
      providesTags: () => ['Invoice'],
    }),
    createInvoice: builder.mutation<void, Partial<Invoice>>({
      query: (newPacakge) => ({
        url: '/invoices',
        method: 'POST',
        body: newPacakge,
      }),
      invalidatesTags: ['Invoice', 'Dashboard', 'Membership'],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useCreateInvoiceMutation
} = invoiceApi;
