import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import MembershipTable from '../../components/Tables/MembershipTable';
import {
  useCreateInvoiceMutation,
  useGetInvoicesQuery,
} from '../../services/invoice.service';
import { useGetMembershipsQuery } from '../../services/membership.service';
import { useGetPackagesQuery } from '../../services/package.service';
import { useGetStaffsQuery } from '../../services/staff.service';
import { Invoice } from '../../types/Invoice';
import { Membership } from '../../types/Membership';
import { MembershipFilters } from '../../types/MembershipFilters';
import { Package } from '../../types/Package';
import InvoicesTable from '../../components/Tables/InvoiceTable';
import Datepicker from 'react-tailwindcss-datepicker';
import moment from 'moment';

interface ListProps {
  listFilter?: MembershipFilters;
}

const InvoicesList = ({ listFilter }: ListProps) => {
  let [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MembershipFilters>(
    listFilter || { status: '' },
  );
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [createInvoice] = useCreateInvoiceMutation();
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice | null>(
    null,
  );

  const { data: trainers } = useGetStaffsQuery({
    page: 1,
    pageSize: 1000,
    filter: { type: 'trainer', status: 'active' },
  });
  const { data: nutritionists } = useGetStaffsQuery({
    page: 1,
    pageSize: 1000,
    filter: { type: 'nutritionist', status: 'active' },
  });
  const { data: packages } = useGetPackagesQuery({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
  const [totalItems, setTotalItems] = useState(100); // Default items per page
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null); // State for invoice data

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleCancelInvoice = () => {
    setShowInvoiceModal(false);
    setSelectedInvoices(null);
  };
  // Handle items per page change
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const {
    data: memberships,
    error,
    isLoading: loading,
    refetch,
  } = useGetInvoicesQuery({
    page: currentPage,
    pageSize: itemsPerPage,
    search,
    filter,
  });

  useEffect(() => {
    if (listFilter) {
      setFilter(listFilter);
      setCurrentPage(1);
    }
  }, [listFilter]);

  useEffect(() => {
    if (memberships) {
      setTotalItems(memberships.totalCount);
    }
  }, [memberships]);

  const handleSubmit = async (values: Invoice) => {
    try {
      const { data: response } = await createInvoice(values);
      if (response?.success) {
        toast.success(`Invoice record added successfully`);
        handleCancelInvoice();
        if (response?.data) setInvoiceData(response?.data);
        refetch();
      } else toast.error(`Could not create Invoice`);
    } catch (error) {
      console.error(`Failed to create Package:`, error);
      toast.error(`Failed to create Package:`, error?.message);
    }
  };
  useEffect(() => {
    refetch();
  }, []);
  const handleCreateInvoice = (membership: Invoices) => {
    setSelectedInvoices(membership);
    setShowInvoiceModal(true);
  };

  useEffect(() => {
    if (memberships?.data) {
      const invoice_id = searchParams.get('invoice_id');
      if (invoice_id) {
        const newInvoices = memberships.data.find(
          (membership) =>
            membership.invoice &&
            JSON.parse(membership.invoice).id.toString() === invoice_id,
        );
        console.log(newInvoices);
        if (newInvoices) setInvoiceData(JSON.parse(newInvoices.invoice!));
      }
    }
  }, [memberships, searchParams]);
  return (
    <>
      <Breadcrumb pageName="All Invoices" />

      <div className="flex items-center justify-between gap-5 mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search invoices by member (name, phone, id)"
          className="w-100 rounded bg-white dark:bg-meta-4 border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter Selectors */}
        <div className="flex items-center gap-2 text-center relative">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Filter by Trainer:
          </label>
          <select
            className="appearance-none bg-white dark:bg-meta-4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-10"
            value={filter?.trainer_id}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                trainer_id: e.target.value === 'null' ? null : e.target.value,
              }))
            }
          >
            <option value="">All</option>
            <option value="null">Not Assigned</option>
            {trainers?.data?.map((trainer) => (
              <option key={trainer.id} value={trainer.staff_id}>
                {trainer.name}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            <IoIosArrowDown />
          </span>
        </div>
        <div className="w-100 flex items-center gap-2 text-center relative">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Filter by Date:
          </label>
          <Datepicker
            showFooter
            toggleClassName="absolute bg-secondary rounded-r-lg text-black right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            inputClassName="w-full appearance-none bg-white dark:bg-meta-4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={{
              startDate: filter?.startDate ? moment(filter?.startDate) : null,
              endDate: filter?.endDate ? moment(filter?.endDate) : null,
            }}
            onChange={(newValue) => {
              setFilter((prev: any) => ({
                ...prev,
                startDate: newValue?.startDate
                  ? moment(newValue?.startDate).format('YYYY-MM-DD')
                  : '',
                endDate: newValue?.endDate
                  ? moment(newValue?.endDate).format('YYYY-MM-DD')
                  : '',
              }));
            }}
            showShortcuts={true}
          />
        </div>
      </div>
      <div className="px-1 py-3">
        Showing {itemsPerPage * (currentPage - 1) || 1}-
        {itemsPerPage * (currentPage - 1) + itemsPerPage} of {totalItems || 0}
      </div>
      {/* Pass search, filter, and pagination as props to MemberTable */}
      <InvoicesTable loading={loading} invoices={memberships?.data || []} />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-meta-4 p-2 px-3">
        <div className="flex justify-end gap-3">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 h-10 w-10 rounded ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black dark:text-white'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        {/* Page Size Selector */}
        <div className="flex items-center gap-2 relative">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Items per page:
          </label>
          <select
            className="appearance-none bg-white dark:bg-meta-4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-10"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            <IoIosArrowDown />
          </span>
        </div>
      </div>
    </>
  );
};

export default InvoicesList;
