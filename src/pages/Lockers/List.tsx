import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

import LockersTable from '../../components/Tables/LockersTable';
import { useGetLockersListQuery } from '../../services/locker.service';
import { MembershipFilters } from '../../types/MembershipFilters';

const LockersList = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MembershipFilters>({ status: '' });

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
    data: lockers,
    isLoading: loading,
    refetch,
  } = useGetLockersListQuery({
    page: currentPage,
    pageSize: itemsPerPage,
    search,
    filter,
  });

  const batchSize = 10; // Number of pages to show in one batch
  const [batchStart, setBatchStart] = useState(0); // Index of first page in the current batch

  const handleNextBatch = () => {
    if (batchStart + batchSize < totalPages) {
      setBatchStart(batchStart + batchSize);
    }
  };

  const handlePrevBatch = () => {
    if (batchStart - batchSize >= 0) {
      setBatchStart(batchStart - batchSize);
    }
  };


  const currentBatch = Array.from(
    { length: Math.min(batchSize, totalPages - batchStart) },
    (_, i) => batchStart + i + 1,
  );


  useEffect(() => {
    if (lockers) {
      setTotalItems(lockers.totalCount);
    }
  }, [lockers]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Lockers" />

      <div className="flex items-center justify-between gap-5 mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search lockers by member (name, phone, id)"
          className="w-100 rounded bg-white dark:bg-meta-4 border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter Selectors */}
        <div className="flex items-center gap-2 text-center relative">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Filter by Status:
          </label>
          <select
            className="appearance-none bg-white dark:bg-meta-4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-10"
            value={filter?.status}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                status: e.target.value === '' ? null : e.target.value,
              }))
            }
          >
            <option value="">All</option>
            <option value="true">Assigned</option>
            <option value="false">Not Assigned</option>
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            <IoIosArrowDown />
          </span>
        </div>
      </div>

      <div className="px-1 py-3">
        Showing {itemsPerPage * (currentPage - 1) || 1}-
        {itemsPerPage * (currentPage - 1) + itemsPerPage} of {totalItems || 0}
      </div>
      {/* Pass search, filter, and pagination as props to MemberTable */}
      <LockersTable loading={loading} lockers={lockers?.data || []} />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-meta-4 p-2 px-3">
        <div className="flex justify-end gap-3 items-center">
          <button
            onClick={handlePrevBatch}
            disabled={batchStart === 0}
            className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            ◀
          </button>

          <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {currentBatch.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`mx-1 h-10 w-10 rounded flex-shrink-0 ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black dark:text-white'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextBatch}
            disabled={batchStart + batchSize >= totalPages}
            className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            ▶
          </button>
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

export default LockersList;
