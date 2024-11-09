import moment from 'moment';
import { useState } from 'react';
import { FaCheck, FaFileInvoice } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import defaultImage from '../../images/user/user-03.png';
import { useMarkAttendanceMutation } from '../../services/attendance.service';
import { clientApi } from '../../services/client.service';
import { dashboardApi } from '../../services/dashboard.service';
import { useDeleteMembershipMutation } from '../../services/membership.service';
import { Client } from '../../types/Client';
import { Invoice } from '../../types/Invoice';
import { capitalize } from '../../utils/helpers';
import ViewMembershipModal from '../Modals/ViewMembershipModal';
import InvoicePrint from '../InvoicePrint';
import ConfirmDialog from '../ConfirmDialog';

const SkeletonLoader = () => {
  return (
    <tr className="animate-pulse bg-white border-b dark:bg-meta-4 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600p-4">
      {Array(12)
        .fill(0)
        .map((_, idx) => (
          <td key={idx} className="p-4">
            <div className="bg-stroke dark:bg-stroke h-3 rounded"></div>
          </td>
        ))}
    </tr>
  );
};

interface MembershipTableProps {
  loading: boolean;
  memberships: any[];
  handleCreateInvoice: (membership: any) => void;
  setInvoiceData: (invoice: Invoice) => void;
  refetch: () => void;
  actions?: boolean;
  invoiceData?: Invoice | null;
}

const MembershipTable = ({
  loading,
  memberships,
  handleCreateInvoice,
  setInvoiceData,
  refetch,
  actions = true,
  invoiceData,
}: MembershipTableProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [onOk, setOnOk] = useState(null);
  const [deleteMembership] = useDeleteMembershipMutation();
  const [selectedMembership, setSelectedMembership] = useState<any | null>(
    null,
  );
  const handleCancel = () => {
    setConfirmVisible(false);
    setOnOk(null);
  };

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [markAttendance] = useMarkAttendanceMutation();

  const openViewModal = (membership: any) => {
    setSelectedMembership(membership);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedMembership(null);
    setIsViewModalOpen(false);
  };

  const handleEditClick = (membership: any) => {
    navigate(`/memberships/${membership.id}/edit`);
  };

  const handleDeactivateClick = async (membership: any) => {
    setOnOk(async () => {
      const response = await deleteMembership(membership?.id ?? '');
      if (response?.data?.success) {
        refetch();
        toast.success('Membership deactivated successfully');
      } else {
        toast.error(response?.data?.details || 'Something went wrong');
      }
    });
  };

  const handleMarkAttendance = async (member: Client): void => {
    try {
      if (!member.member_id) return;
      const attendanceData = {
        member_id: member.member_id,
        date: moment().format('YYYY-MM-DD'),
      };
      await markAttendance(attendanceData);
      dispatch(dashboardApi.util.invalidateTags(['Dashboard']));
      dispatch(clientApi.util.invalidateTags(['Client']));
      toast.success('Attendance marked successfully');
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Could not mark Attendance');
    }
  };
  return (
    <div className="border border-stroke dark:border-graydark relative overflow-x-auto sm:rounded-t-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        {memberships?.length ? (
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 p-4">
                <p className="hidden text-black dark:text-white sm:block">Id</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 min-w-[220px] dark:bg-meta-4 px-2 py-3"
              >
                <p className="text-black dark:text-white">Client Name</p>
              </th>
              {actions && (
                <th
                  scope="col"
                  className="bg-gray-500 min-w-[170px] dark:bg-meta-4 px-6 py-3"
                >
                  <p className="text-black dark:text-white">Attendance</p>
                </th>
              )}
              <th
                scope="col"
                className="bg-gray-500 dark:bg-meta-4 min-w-32 px-6 py-3"
              >
                <p className="text-black dark:text-white">Fee Date</p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="text-black dark:text-white">Phone</p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="text-black dark:text-white">Invoice</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 min-w-[155px]
               dark:bg-meta-4 px-6 py-3"
              >
                <p className="text-black dark:text-white">Membership Fee</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 min-w-[135px]
               dark:bg-meta-4 px-6 py-3"
              >
                <p className="text-black dark:text-white">Training Fee</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 dark:bg-meta-4 min-w-[110px] px-6 py-3"
              >
                <p className="text-black dark:text-white">Package</p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="text-black dark:text-white">Trainer</p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="text-black dark:text-white">Nutritionist</p>
              </th>
              <th
                scope="col"
                className="bg-gray dark:bg-meta-4 px-6 py-3 sticky right-0 min-w-[23rem]"
              >
                <p className="text-black dark:text-white">Actions</p>
              </th>
            </tr>
          </thead>
        ) : (
          ''
        )}
        {loading ? (
          <tbody>
            {Array(8)
              .fill(0)
              .map((_, idx) => (
                <SkeletonLoader key={idx} />
              ))}
          </tbody>
        ) : (
          <>
            {memberships && memberships.length > 0 && (
              <tbody>
                {memberships.map((membership) => (
                  <tr
                    key={membership.id}
                    className="bg-white border-b dark:bg-meta-4 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="p-4">
                      <p className="text-black dark:text-white">
                        {membership.id}
                      </p>
                    </td>

                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        className="h-12 w-12 rounded-lg object-contain"
                        width={50}
                        src={
                          membership.client_image
                            ? `http://localhost:8080/${membership.client_image}`
                            : defaultImage
                        }
                        alt="User"
                      />
                      <div>
                        <p className="text-black dark:text-white mb-2">
                          <Link
                            className="hover:underline"
                            to={`/members/${membership.client_id}/edit`}
                          >
                            {membership.client_name}
                          </Link>
                        </p>
                        <span
                          className={`rounded-full ${
                            membership.status === 'archived'
                              ? 'bg-stroke dark:bg-boxdark'
                              : ''
                          } ${
                            membership.status === 'active'
                              ? 'bg-meta-3/30 dark:text-white'
                              : ''
                          } ${
                            membership.status === 'inactive'
                              ? 'bg-meta-1/20 dark:bg-meta-1/40 dark:text-white'
                              : ''
                          } px-2 py-1`}
                        >
                          {capitalize(membership.status)}
                        </span>
                      </div>
                    </td>

                    {actions && (
                      <td className="px-6 py-4">
                        {membership.status === 'active' && (
                          <>
                            {!JSON.parse(membership.attendance)?.checkin_at ? (
                              <button
                                onClick={() => handleMarkAttendance(membership)}
                                className="flex items-center gap-2 px-3 border border-success bg-success bg-opacity-20 text-success rounded hover:bg-opacity-30 transition-colors duration-300"
                              >
                                <FaCheck />
                                Check In
                              </button>
                            ) : (
                              capitalize(
                                JSON.parse(membership.attendance)?.status,
                              )
                            )}
                          </>
                        )}
                      </td>
                    )}

                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {membership.fee_date || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {membership.client_phone}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {membership?.invoice &&
                        JSON.parse(membership?.invoice) && (
                          <button
                            type="button"
                            onClick={() =>
                              setInvoiceData(JSON.parse(membership?.invoice))
                            }
                            className="text-primary dark:text-secondary"
                          >
                            <FaFileInvoice />
                          </button>
                        )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        Rs. {membership.personal_fee}/-
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        Rs. {membership.training_fee}/-
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {membership.package_name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {membership.trainer_name || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {membership.nutritionist_name || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4 sticky right-0 bg-gray dark:bg-strokedark">
                      <div className="w-full flex justify-start gap-2">
                        <button
                          className="px-3 border border-primary bg-primary bg-opacity-20 text-primary rounded hover:bg-opacity-30 transition-colors duration-300"
                          onClick={() => openViewModal(membership)}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(membership)}
                          className="px-3 border border-blue-500 bg-blue-500 bg-opacity-20 text-blue-500 rounded hover:bg-opacity-30 transition-colors duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            membership.status === 'active'
                              ? handleDeactivateClick(membership)
                              : handleCreateInvoice(membership)
                          }
                          className={`px-3 border ${
                            membership.status === 'inactive'
                              ? 'border-green-500 bg-green-500 text-green-500'
                              : 'border-red-500 bg-red-500 text-red-500'
                          }  bg-opacity-20  rounded hover:bg-opacity-30 transition-colors duration-300`}
                        >
                          {membership.status === 'active'
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>
                        {membership.status === 'active' && (
                          <button
                            onClick={() => handleCreateInvoice(membership)}
                            className="px-3 border text-boxdark border-secondary bg-secondary text-secondary rounded"
                          >
                            Add Invoice
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </>
        )}
      </table>

      {!memberships?.length && (
        <div className="h-100 w-full flex justify-center items-center">
          No Data
        </div>
      )}

      <ViewMembershipModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        membership={selectedMembership}
      />

      <div
        className={`${
          !invoiceData ? 'hidden' : ''
        } z-[10000] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
      >
        <div className="bg-white dark:bg-strokedark p-8 rounded-lg shadow-xl text-black dark:text-white max-w-md w-full">
          {invoiceData && (
            <InvoicePrint
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
            />
          )}
        </div>
      </div>
      {onOk && (
        <ConfirmDialog
          visible={confirmVisible}
          onOK={onOk}
          onCancel={handleCancel}
          action={'Deactivate this member'}
        />
      )}
    </div>
  );
};

export default MembershipTable;
