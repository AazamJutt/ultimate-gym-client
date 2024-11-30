import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import MemberTable from '../../../components/Tables/MemberTable';
import { useGetStaffsQuery } from '../../../services/staff.service';
import { StaffFilters } from '../../../types/StaffFilters';
import LockerForm from '../../Lockers/LockerForm';
import { Staff } from '../../../types/staff';
import {
  useAssignLockerMutation,
  useUnAssignLockerMutation,
} from '../../../services/locker.service';
import { Locker } from '../../../types/Locker';
import { toast } from 'react-toastify';
import { confirmDialog } from 'primereact/confirmdialog';

interface ListProps {
  listFilter?: StaffFilters;
}

const List = ({ listFilter }: ListProps) => {
  // State for search and filter
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StaffFilters>(
    listFilter || { status: '' },
  );
  const [selectedMember, setSelectedMember] = useState<Staff | null>(null);
  const [viewLockerModal, setViewLockerModal] = useState<boolean>(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
  const [totalItems, setTotalItems] = useState(100); // Default items per page

  const [assignLocker] = useAssignLockerMutation();
  const [unAssignLocker] = useUnAssignLockerMutation();
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleAssignLocker = (member: Staff) => {
    setSelectedMember(member);
    setViewLockerModal(true);
  };
  const handleUnassignLocker = async (member: Staff) => {
    confirmDialog({
      message: 'Are you sure you want to Unassign locker?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: async () => {
        try {
          const { data: response } = await unAssignLocker({
            member_id: member.id,
          });
          if (response?.success) {
            toast.success(`Locker Unassigned successfully`);
            handleCancelAssignLocker();
            refetch();
          } else toast.error(`Could not Unassigned Locker`);
        } catch (error: any) {
          console.error(`Failed to Unassigned Locker:`, error);
          toast.error(`Failed to Unassigned Locker:`, error?.data?.message);
        }
      },
    });
  };
  const handleCancelAssignLocker = () => {
    setSelectedMember(null);
    setViewLockerModal(false);
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
    refetch,
  } = useGetStaffsQuery({
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

  const handleAssignLockerSubmit = async (values: Partial<Locker>) => {
    try {
      const { data: response } = await assignLocker(values);
      if (response?.success) {
        toast.success(`Locker assigned successfully`);
        handleCancelAssignLocker();
        refetch();
      } else toast.error(`Could not assign Locker`);
    } catch (error) {
      console.error(`Failed to assign Locker:`, error);
      toast.error(`Failed to assign Locker:`, error?.data?.message);
    }
  };
  return (
    <>
      <Breadcrumb pageName="Staff Members" />

      <div className="flex items-center justify-between mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search staff members (name, phone, cnic)"
          className="w-100 rounded bg-white dark:bg-meta-4 border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Filter Selectors */}
        <div className="flex items-center gap-2 relative">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Filter by Type:
          </label>
          <select
            className="appearance-none bg-white dark:bg-meta-4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-10"
            value={filter?.trainer}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="">All</option>
            <option value="trainer">Trainer</option>
            <option value="nutritionist">Nutritionist</option>
            <option value="other">Other</option>
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
      <MemberTable
        loading={loading}
        members={members?.data || []}
        staff
        refetch={refetch}
        handleAssignLocker={handleAssignLocker}
        handleUnassignLocker={handleUnassignLocker}
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
      <div
        className={`${
          !viewLockerModal ? 'hidden' : ''
        } z-[10000] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
      >
        <div className="bg-white dark:bg-strokedark p-8 rounded-lg shadow-xl text-black dark:text-white max-w-md w-full">
          {selectedMember && (
            <LockerForm
              enableReinitialize
              onCancel={handleCancelAssignLocker}
              onSubmit={handleAssignLockerSubmit}
              initialValues={{
                member_id: selectedMember.member_id,
                locker_number: '',
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default List;
