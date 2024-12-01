import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { StaffFilters } from '../../types/StaffFilters';
import {
  useAddPackageMutation,
  useGetPackagesQuery,
  useUpdatePackageMutation,
} from '../../services/package.service';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import PackageTable from '../../components/Tables/PackageTable';
import { FaPlus } from 'react-icons/fa';
import PackageForm from './PackageForm';
import { Package } from '../../types/Package';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
interface ListProps {
  listFilter: StaffFilters;
}

const List = ({ listFilter }: ListProps) => {
  // State for search and filter
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StaffFilters>(listFilter);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  // Pagination states
  const { isLoading, data: packages } = useGetPackagesQuery(filter);
  const [addPackage] = useAddPackageMutation();
  const [updatePackage] = useUpdatePackageMutation();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const onEditClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsViewModalOpen(true);
    setIsEditing(true);
  };

  const closeViewModal = () => {
    setIsEditing(false);
    setSelectedPackage(null);
    setIsViewModalOpen(false);
  };

  useEffect(() => {
    if (listFilter) {
      setFilter(listFilter);
    }
  }, [listFilter]);

  const handleSubmit = async (values: any) => {
    const action = isEditing ? 'update' : 'add';
    try {
      const response = await (isEditing && selectedPackage?.id
        ? updatePackage({
            id: selectedPackage.id.toString(),
            packageData: values,
          })
        : addPackage(values));
      if (!response.error) {
        toast.success(
          `Package ${isEditing ? 'updated' : 'added'} successfully`,
        );
        closeViewModal();
      } else toast.error(response?.data?.message || `Could not ${action} Package`);
    } catch (error) {
      console.error(`Failed to ${action} Package:`, error);
      toast.error(error?.data?.message || `Failed to ${action} Package`);
    }
  };
  return (
    <>
      <Breadcrumb pageName="Packages" />

      <div className="flex items-center justify-between mb-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search staff members (name, phone, cnic)"
            className="w-100 rounded bg-white dark:bg-meta-4 border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

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
        </div>
        {user.role === 'admin' && (
          <button
            type="button"
            onClick={() => setIsViewModalOpen(true)}
            className="flex gap-3 items-center py-2 bg-secondary rounded-lg text-black px-4"
          >
            <FaPlus /> Add Package
          </button>
        )}
      </div>

      {/* Pass search, filter, and pagination as props to MemberTable */}
      <PackageTable
        onEditClick={onEditClick}
        loading={isLoading}
        packages={packages?.data || []}
      />

      <div
        className={`${
          !isViewModalOpen ? 'hidden' : ''
        } fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
      >
        <div className="bg-white dark:bg-strokedark p-8 rounded-lg shadow-xl text-black dark:text-white max-w-md w-full">
          <PackageForm
            onCancel={closeViewModal}
            isEditing={isEditing}
            onSubmit={handleSubmit}
            initialValues={
              selectedPackage ||
              ({
                name: '',
                price: 0,
                status: 'active',
                period: 0,
              } as Package)
            }
          />
        </div>
      </div>
    </>
  );
};

export default List;
