import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from '../../types/Package';
import { capitalize } from '../../utils/helpers';
import {
  useDeactivatePackageMutation,
  useUpdatePackageMutation,
} from '../../services/package.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { confirmDialog } from 'primereact/confirmdialog';
import ConfirmDialogModal from '../ConfirmDialog';
// import ViewPackageModal from '../Modals/ViewPackageModal';

const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-10 rounded-sm h-full animate-pulse">
      {/* Skeleton structure */}
    </div>
  );
};

interface PackageTableProps {
  loading: boolean;
  packages: Package[] | undefined;
  onEditClick: (values: Package) => void;
}

const PackageTable = ({
  loading,
  packages,
  onEditClick,
}: PackageTableProps) => {
  const [deactivatePackage] = useDeactivatePackageMutation();
  const [updatePackage] = useUpdatePackageMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleDeleteClick = (pkg: Package) => {
    confirmDialog({
      message: 'Are you sure you want to delete this package?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: async () => {
        deactivatePackage(pkg.id.toString());
      },
    });
  };

  const handleActivateClick = (pkg: Package) => {
    confirmDialog({
      message: 'Are you sure you want to activate this package?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: async () => {
        updatePackage({
          id: pkg.id.toString(),
          packageData: { status: 'active' },
        });
      },
    });
  };

  return (
    <div className="border border-stroke dark:border-graydark relative overflow-x-auto sm:rounded-t-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        {packages?.length ? (
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 p-4">
                <p className="hidden text-black dark:text-white sm:block">Id</p>
              </th>
              <th
                scope="col-2"
                className="bg-gray-500 dark:bg-meta-4 px-6 py-3"
              >
                <p className="text-black dark:text-white">Name</p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="hidden text-black dark:text-white sm:block">
                  Price
                </p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="hidden text-black dark:text-white sm:block">
                  Period (months)
                </p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="hidden text-black dark:text-white sm:block">
                  Status
                </p>
              </th>
              {user.role === 'admin' && (
                <th
                  scope="col"
                  className="bg-gray dark:bg-meta-4 px-6 py-3 sticky right-0"
                  style={{ zIndex: 1 }}
                >
                  <p className="text-black dark:text-white">Actions</p>
                </th>
              )}
            </tr>
          </thead>
        ) : (
          ''
        )}
        {loading ? (
          <>
            {Array(8)
              .fill(0)
              .map((_, idx) => (
                <SkeletonLoader key={idx} />
              ))}
          </>
        ) : (
          <>
            {packages && packages.length > 0 && (
              <tbody>
                {packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="bg-white border-b dark:bg-meta-4 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="p-4">
                      <p className="text-black dark:text-white">{pkg.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">{pkg.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        PKR {pkg.price}/-
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {pkg.period} months
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full ${
                          pkg.status === 'active'
                            ? 'bg-meta-3/30 dark:text-white'
                            : 'bg-meta-1/20 dark:bg-meta-1/40 dark:text-white'
                        } px-2 py-1`}
                      >
                        {capitalize(pkg.status)}
                      </span>
                    </td>
                    {user.role === 'admin' && (
                      <td className="px-6 py-4 sticky right-0 bg-gray dark:bg-strokedark">
                        <div className="w-full flex justify-start gap-2">
                          <button
                            onClick={() => onEditClick(pkg)}
                            className="px-3 border border-blue-500 bg-blue-500 bg-opacity-20 text-blue-500 rounded hover:bg-opacity-30 transition-colors duration-300"
                          >
                            Edit
                          </button>
                          {pkg.status === 'active' ? (
                            <button
                              onClick={() => handleDeleteClick(pkg)}
                              className="px-3 border border-red-500 bg-red-500 bg-opacity-20 text-red-500 rounded hover:bg-opacity-30 transition-colors duration-300"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateClick(pkg)}
                              className="px-3 border border-green-500 bg-green-500 bg-opacity-20 text-green-500 rounded hover:bg-opacity-30 transition-colors duration-300"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            )}
          </>
        )}
      </table>

      {!packages?.length && (
        <div className="h-100 w-full flex justify-center items-center">
          No Data
        </div>
      )}
    </div>
  );
};

export default PackageTable;
