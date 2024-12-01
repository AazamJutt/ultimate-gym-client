// src/services/staffApi.ts
import { ultimateGymApiSlice } from '../redux/slices/gymApi.slice';
import { Invoice } from '../types/Invoice';

export const invoiceApi = ultimateGymApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<
      { data: Invoice[]; totalCount: number },
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
          url: `/invoices${queryParams}`,
          headers: {
            filter: JSON.stringify(filter || {}),
          },
        };
      },
      providesTags: () => ['Invoice'],
    }),
    createInvoice: builder.mutation<void, Partial<Invoice>>({
      query: (newPacakge) => ({
        url: '/invoices',
        method: 'POST',
        body: newPacakge,
      }),
      invalidatesTags: ['Invoice', 'Dashboard', 'Membership', 'Sales', 'RevenueAnalytics'],
    }),
    editInvoice: builder.mutation<void, { id: number; data: Partial<Invoice> }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Invoice', 'Dashboard', 'Membership', 'Sales', 'RevenueAnalytics'],
    }),
    adjustInvoice: builder.mutation<void, { id: number; data: Partial<Invoice> }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}/adjust`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Invoice', 'Dashboard', 'Membership', 'Sales', 'RevenueAnalytics'],
    }),
    returnInvoice: builder.mutation<void, { id: number; data: Partial<Invoice> }>({
      query: ({id, data}) => ({
        url: `/invoices/${id}/return`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Invoice', 'Dashboard', 'Membership', 'Sales', 'RevenueAnalytics'],
    }),
  }),
});

export const { useGetInvoicesQuery, useCreateInvoiceMutation, useAdjustInvoiceMutation, useReturnInvoiceMutation, useEditInvoiceMutation } = invoiceApi;
