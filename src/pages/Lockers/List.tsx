import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

import LockersTable from '../../components/Tables/LockersTable';
import { useGetLockersListQuery } from '../../services/locker.service';
import { useGetPackagesQuery } from '../../services/package.service';
import { useGetStaffsQuery } from '../../services/staff.service';
import { Locker } from '../../types/Locker';
import { MembershipFilters } from '../../types/MembershipFilters';
import { Package } from '../../types/Package';

interface ListProps {
  listFilter?: MembershipFilters;
}

const LockersList = ({ listFilter }: ListProps) => {
  let [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MembershipFilters>(
    listFilter || { status: '' },
  );
  const [showLockerModal, setShowLockerModal] = useState(false);
  //   const [createLocker] = useCreateLockerMutation();
  const [selectedLockers, setSelectedLockers] = useState<Locker | null>(null);

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
  const [LockerData, setLockerData] = useState<Locker | null>(null); // State for Locker data

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleCancelLocker = () => {
    setShowLockerModal(false);
    setSelectedLockers(null);
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
  } = useGetLockersListQuery({
    page: currentPage,
    pageSize: itemsPerPage,
    search,
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

  //   const handleSubmit = async (values: Locker) => {
  //     try {
  //       const { data: response } = await createLocker(values);
  //       if (response?.success) {
  //         toast.success(`Locker record added successfully`);
  //         handleCancelLocker();
  //         if (response?.data) setLockerData(response?.data);
  //         refetch();
  //       } else toast.error(`Could not create Locker`);
  //     } catch (error) {
  //       console.error(`Failed to create Package:`, error);
  //       toast.error(`Failed to create Package:`, error?.message);
  //     }
  //   };
  useEffect(() => {
    refetch();
  }, []);
  const handleCreateLocker = (membership: Lockers) => {
    setSelectedLockers(membership);
    setShowLockerModal(true);
  };

  useEffect(() => {
    if (memberships?.data) {
      const Locker_id = searchParams.get('Locker_id');
      if (Locker_id) {
        const newLockers = memberships.data.find(
          (membership) =>
            membership.Locker &&
            JSON.parse(membership.Locker).id.toString() === Locker_id,
        );
        console.log(newLockers);
        if (newLockers) setLockerData(JSON.parse(newLockers.Locker!));
      }
    }
  }, [memberships, searchParams]);
  return (
    <>
      <Breadcrumb pageName="All Lockers" />

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
      </div>

      <div className="px-1 py-3">
        Showing {itemsPerPage * (currentPage - 1) || 1}-
        {itemsPerPage * (currentPage - 1) + itemsPerPage} of {totalItems || 0}
      </div>
      {/* Pass search, filter, and pagination as props to MemberTable */}
      <LockersTable loading={loading} lockers={memberships?.data || []} />

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

export default LockersList;
