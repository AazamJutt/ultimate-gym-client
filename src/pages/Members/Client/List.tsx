import { useEffect, useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import MemberTable from '../../../components/Tables/MemberTable';
import { ClientFilters } from '../../../types/ClientFilters';
import { IoIosArrowDown } from 'react-icons/io';
import { useGetClientsQuery } from '../../../services/client.service';

interface ListProps {
  listFilter: ClientFilters;
}

const List = ({ listFilter }: ListProps) => {
  // State for search and filter
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ClientFilters>(listFilter);

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
    data: members,
    error,
    isLoading: loading,
    refetch
  } = useGetClientsQuery({
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
    if (members) {
      setTotalItems(members.totalCount);
    }
  }, [members]);
  return (
    <>
      <Breadcrumb pageName="All Members" />

      <div className="flex items-center justify-between mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search members (name, phone, cnic)"
          className="w-100 rounded bg-white dark:bg-meta-4 border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter Selectors */}
        <div className="flex items-center gap-2 relative">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Filter by Trainer:
          </label>
          <select
            className="appearance-none bg-white dark:bg-meta-4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-10"
            value={filter?.trainer}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, trainer: e.target.value }))
            }
          >
            <option value="">All</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            <IoIosArrowDown />
          </span>
        </div>

        {!listFilter?.archived && (
          <div className="flex items-center gap-2 relative">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Filter by Status:
            </label>
            <select
              className="appearance-none bg-white dark:bg-meta-4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-10"
              value={filter?.status}
              onChange={(e) => setFilter({ status: e.target.value })}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              <IoIosArrowDown />
            </span>
          </div>
        )}
      </div>

      {/* Pass search, filter, and pagination as props to MemberTable */}
      <MemberTable loading={loading} members={members?.data || []} refetch={refetch} />

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
        <div>
          Showing {itemsPerPage * (currentPage - 1) || 1}-
          {itemsPerPage * (currentPage - 1) + itemsPerPage} of {totalItems || 0}
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

export default List;
