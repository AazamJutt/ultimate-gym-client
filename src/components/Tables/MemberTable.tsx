import moment from 'moment';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../images/user/user-03.png';
import {
  clientApi,
  useDeleteClientMutation,
} from '../../services/client.service';
import { Client } from '../../types/Client';
import { Staff } from '../../types/staff';
import { capitalize } from '../../utils/helpers';
import ViewMemberModal from '../Modals/ViewMemberModal';
import { FaCheck, FaLock, FaUnlock } from 'react-icons/fa';
import { useMarkAttendanceMutation } from '../../services/attendance.service';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardApi } from '../../services/dashboard.service';
import { staffApi, useDeleteStaffMutation } from '../../services/staff.service';
import { RootState } from '../../redux/store';
import { confirmDialog } from 'primereact/confirmdialog';
import ConfirmDialogModal from '../ConfirmDialog';
import { Attendance } from '../../types/attendance';

const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-10 rounded-sm h-full animate-pulse">
      {/* Skeleton structure */}
    </div>
  );
};

interface MemberTableProps {
  loading: boolean;
  members: Client[] | Staff[] | undefined;
  staff?: boolean;
  refetch: () => void;
  actions?: boolean;
  handleAssignLocker?: any;
  handleUnassignLocker?: any;
}

const MemberTable = ({
  loading,
  members,
  staff,
  refetch,
  actions = true,
  handleAssignLocker,
  handleUnassignLocker,
}: MemberTableProps) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();
  const [deleteClient] = useDeleteClientMutation();
  const [deleteStaff] = useDeleteStaffMutation();
  const [selectedMember, setSelectedMember] = useState<Client | Staff | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [markAttendance] = useMarkAttendanceMutation();
  const openViewModal = (member: Client | Staff) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedMember(null);
    setIsViewModalOpen(false);
  };

  const handleEditClick = (member: Client | Staff) => {
    navigate(
      `${
        staff
          ? `/staff/${(member as Staff).staff_id}`
          : `/members/${(member as Client).client_id}`
      }/edit`,
    );
  };

  const handleDeleteClick = (member: any) => {
    confirmDialog({
      message: 'Are you sure you want to delete this member?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: async () => {
        staff
          ? deleteStaff(member?.staff_id ?? '')
          : deleteClient(member?.client_id ?? '');
      },
    });
  };

  const handleMarkAttendance = async (
    member: Client | Staff,
    type: 'checkin' | 'checkout' | 'absent',
  ) => {
    try {
      if (!member.member_id) return;
      const attendanceData: Attendance = {
        member_id: member.member_id,
        date: moment().format('YYYY-MM-DD'),
        status: type === 'absent' ? 'absent' : 'present',
      };
      if (type === 'checkin') {
        attendanceData.checkin_at = moment().format('HH:mm:ss');
      } else if (type === 'checkout') {
        attendanceData.checkout_at = moment().format('HH:mm:ss');
      }
      await markAttendance(attendanceData);
      dispatch(dashboardApi.util.invalidateTags(['Dashboard']));
      dispatch(clientApi.util.invalidateTags(['Client']));
      dispatch(staffApi.util.invalidateTags(['Staff']));

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
        {members?.length ? (
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
              {staff && (
                <th
                  scope="col"
                  className="bg-gray-500 dark:bg-meta-4 px-6 py-3"
                >
                  <p className="hidden text-black dark:text-white sm:block">
                    Attendance Status
                  </p>
                </th>
              )}
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="hidden text-black dark:text-white sm:block">
                  Gender
                </p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="hidden text-black dark:text-white sm:block">
                  {staff ? 'Locker Number' : 'Joining Date'}
                </p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="hidden text-black dark:text-white sm:block">
                  {staff ? 'Training Fee' : 'Fee Date'}
                </p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="hidden text-black dark:text-white sm:block">
                  Phone
                </p>
              </th>

              <th
                scope="col"
                className="bg-gray dark:bg-meta-4 px-6 py-3 sticky right-0"
                style={{ zIndex: 1 }}
              >
                <p className="text-black dark:text-white">Actions</p>
              </th>
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
            {members && members.length > 0 && (
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="bg-white border-b dark:bg-meta-4 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="p-4">
                      <p className="text-black dark:text-white">
                        {staff ? member.staff_id : member.client_id}
                      </p>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        className="h-12 w-12 rounded-lg object-contain"
                        width={50}
                        src={
                          member.image
                            ? member.image
                            : defaultImage
                        }
                        alt="User"
                      />
                      <div>
                        <p className="text-black dark:text-white mb-2">
                          {member.name}
                        </p>
                        <span
                          className={`rounded-full ${
                            !staff
                              ? `${
                                  member.status === 'archived'
                                    ? 'bg-stroke dark:bg-boxdark'
                                    : ''
                                } ${
                                  member.status === 'active'
                                    ? 'bg-meta-3/30 dark:text-white'
                                    : ''
                                } ${
                                  member.status === 'inactive'
                                    ? 'bg-meta-1/20 dark:bg-meta-1/40 dark:text-white'
                                    : ''
                                }`
                              : 'bg-stroke dark:bg-boxdark'
                          } px-2 py-1`}
                        >
                          {capitalize(
                            staff ? (member as Staff).role : member.status,
                          )}
                        </span>
                      </div>
                    </td>
                    {staff && (
                      <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          {JSON.parse(member.attendance)?.status && (
                            <span
                              className={`mr-2 rounded-full ${`${
                                JSON.parse(member.attendance)?.status === 'late'
                                  ? 'bg-stroke dark:bg-boxdark'
                                  : ''
                              } ${
                                JSON.parse(member.attendance)?.status ===
                                'present'
                                  ? 'bg-meta-3/30 dark:text-white'
                                  : ''
                              } ${
                                JSON.parse(member.attendance)?.status ===
                                'absent'
                                  ? 'bg-meta-1/20 dark:bg-meta-1/40 dark:text-white'
                                  : ''
                              }`} px-2 py-1`}
                            >
                              {capitalize(
                                JSON.parse(member.attendance)?.status,
                              )}
                            </span>
                          )}
                        </p>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {capitalize(member.gender)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {staff
                          ? member?.locker_number || 'N/A'
                          : member.joining_date
                          ? moment(member.joining_date).format('YYYY-MM-DD')
                          : 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {staff
                          ? (member as Staff)?.fee
                            ? `PKR ${(member as Staff).fee}/-`
                            : 'N/A'
                          : member.fee_date
                          ? moment(member.fee_date).format('YYYY-MM-DD')
                          : 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {member.phone || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4 sticky right-0 bg-gray dark:bg-strokedark">
                      <div className="w-full flex justify-start gap-2">
                        <button
                          className="px-3 border border-primary bg-primary bg-opacity-20 text-primary rounded hover:bg-opacity-30 transition-colors duration-300"
                          onClick={() => openViewModal(member)}
                        >
                          View
                        </button>
                        {actions && (
                          <>
                            <button
                              onClick={() => handleEditClick(member)}
                              className="px-3 border border-blue-500 bg-blue-500 bg-opacity-20 text-blue-500 rounded hover:bg-opacity-30 transition-colors duration-300"
                            >
                              Edit
                            </button>
                            {staff &&
                              (!JSON.parse(member.attendance)?.status ||
                              JSON.parse(member.attendance)?.status ===
                                'absent' ? (
                                <button
                                  onClick={() =>
                                    handleMarkAttendance(member, 'checkin')
                                  }
                                  className="flex items-center gap-2 px-3 border border-success bg-success bg-opacity-20 text-success rounded hover:bg-opacity-30 transition-colors duration-300"
                                >
                                  <FaCheck /> Check In
                                </button>
                              ) : (
                                staff &&
                                !JSON.parse(member.attendance)?.checkout_at && (
                                  <button
                                    onClick={() =>
                                      handleMarkAttendance(member, 'checkout')
                                    }
                                    className="flex items-center gap-2 px-3 border border-red-500 bg-red-500 bg-opacity-20 text-red-500 rounded hover:bg-opacity-30 transition-colors duration-300"
                                  >
                                    <FaCheck /> Check out
                                  </button>
                                )
                              ))}
                            {staff &&
                              (member?.locker_number ? (
                                <button
                                  onClick={() => handleUnassignLocker(member)}
                                  className="flex items-center gap-2 px-3 border border-danger bg-danger bg-opacity-20 text-danger rounded hover:bg-opacity-30 transition-colors duration-300"
                                >
                                  <FaUnlock /> Unassign Locker
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAssignLocker(member)}
                                  className="flex items-center gap-2 px-3 border border-success bg-success bg-opacity-20 text-success rounded hover:bg-opacity-30 transition-colors duration-300"
                                >
                                  <FaLock /> Assign Locker
                                </button>
                              ))}
                            {user.role === 'admin' &&
                              member.status === 'active' && (
                                <button
                                  onClick={() => handleDeleteClick(member)}
                                  className="px-3 border border-red-500 bg-red-500 bg-opacity-20 text-red-500 rounded hover:bg-opacity-30 transition-colors duration-300"
                                >
                                  Archive
                                </button>
                              )}
                          </>
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

      {!members?.length && (
        <div className="h-100 w-full flex justify-center items-center">
          No Data
        </div>
      )}

      <ViewMemberModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        member={selectedMember}
      />
    </div>
  );
};

export default MemberTable;
