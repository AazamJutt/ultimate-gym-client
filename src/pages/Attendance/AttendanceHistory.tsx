import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import AttendanceTable from '../../components/Tables/AttendanceTable';
import { useGetAttendancesQuery } from '../../services/attendance.service';
import Datepicker from 'react-tailwindcss-datepicker';
import moment from 'moment';

const AttendanceHistory = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<any>({});
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
  const [totalItems, setTotalItems] = useState(100); // Default items per page

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  // Handle items per page change
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const {
    data: attendances,
    error,
    isLoading: loading,
    refetch,
  } = useGetAttendancesQuery({
    page: currentPage,
    pageSize: itemsPerPage,
    search,
    filter,
  });

  useEffect(() => {
    if (attendances) {
      setTotalItems(attendances.totalCount);
    }
  }, [attendances]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Attendance History" />

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
            Filter by Type:
          </label>
          <select
            className="appearance-none bg-white dark:bg-meta-4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-10"
            value={filter?.type}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                type: e.target.value === 'null' ? null : e.target.value,
              }))
            }
          >
            <option value="">All</option>
            <option value="client">Client</option>
            <option value="staff">Staff</option>
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
            showFooter={true}
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
      <AttendanceTable
        loading={loading}
        attendances={attendances?.data || []}
      />

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

export default AttendanceHistory;
