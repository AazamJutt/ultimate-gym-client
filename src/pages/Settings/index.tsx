import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '../../services/setting.service';
import { Setting } from '../../types/Setting';
import { toast } from 'react-toastify';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersListQuery,
  useUpdateUserMutation,
} from '../../services/user.service';
import { User } from '../../types/User';
import moment from 'moment';
import UserForm from './UserForm';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { useGetLockersQuery } from '../../services/locker.service';
import { Locker } from '../../types/Locker';
import ConfirmDialog from '../../components/ConfirmDialog';

const Settings = () => {
  // Fetch settings data
  const { data: settings } = useGetSettingsQuery();
  const { data: users } = useGetUsersListQuery();
  const { data: lockers } = useGetLockersQuery();

  const [updateUser] = useUpdateUserMutation();
  const [createUser] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateSettings] = useUpdateSettingsMutation();
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<string>('');
  const [onOk, setOnOk] = useState<null | (() => void)>(null);

  const handleCancel = () => {
    setConfirmVisible(false);
    setConfirmAction('');
    setOnOk(null);
  };

  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser?.role !== 'admin') {
      navigate('/');
    }
  }, [loggedInUser]);
  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setShowViewModal(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (values: User) => {
    try {
      console.log({ selectedUser });
      if (!selectedUser) {
        await createUser({
          username: values.username,
          password: values.password,
          role: values.role,
        });
      } else {
        await updateUser({
          id: selectedUser.id,
          user: {
            username: values.username,
            password: values.password,
            role: values.role,
          },
        });
      }
      toast.success(
        `User ${selectedUser ? 'updated' : 'created'} successfully`,
      );
      resetForm();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  async function handleDelete(id: number) {
    setOnOk(async ()=> {
      // try {
      //   await deleteUser(id);
      //   toast.success('User deleted successfully');
      //   resetForm();
      // } catch (error) {
      //   toast.error('Failed to delete user');
      // }
      console.log('id');
    });
    setConfirmVisible(true);
  }
  // Transform settings data to match Formik's initialValues structure
  const initialFormValues = {
    incomingFeeDays:
      settings?.data.find((s: Setting) => s.key === 'incomingFeeDays')?.value ||
      '',
    reminderDays:
      settings?.data.find((s: Setting) => s.key === 'reminderDays')?.value ||
      '',
    autoDeactivateMember:
      settings?.data.find((s: Setting) => s.key === 'autoDeactivateMember')
        ?.value || 'No',
    registrationFee:
      settings?.data.find((s: Setting) => s.key === 'registrationFee')?.value ||
      0,
    lockerFee:
      settings?.data.find((s: Setting) => s.key === 'lockerFee')?.value || 0,
    gymOpenTime:
      settings?.data.find((s: Setting) => s.key === 'gymOpenTime')?.value || '',
    gymCloseTime:
      settings?.data.find((s: Setting) => s.key === 'gymCloseTime')?.value ||
      '',
  };

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true, // Reinitialize form when initialValues change
    validationSchema: Yup.object({
      incomingFeeDays: Yup.number()
        .required('Incoming Fee Days is required')
        .min(0, 'Must be a positive number')
        .integer('Must be an integer'),
      reminderDays: Yup.number()
        .required('Reminder Days is required')
        .min(0, 'Must be a positive number')
        .integer('Must be an integer'),
      registrationFee: Yup.number()
        .required('Registration Fee is required')
        .min(0, 'Must be a positive number')
        .integer('Must be an integer'),
      lockerFee: Yup.number()
        .required('Locker Fee is required')
        .min(0, 'Must be a positive number')
        .integer('Must be an integer'),
      autoDeactivateMember: Yup.string().required('Please select an option'),
      gymOpenTime: Yup.string().required('Gym Opening Time is required'),
      gymCloseTime: Yup.string().required('Gym Closing Time is required'),
    }),
    onSubmit: async (values) => {
      const settingsArray = Object.keys(values).map((key) => ({
        key,
        value: values[key as keyof typeof values],
      }));

      try {
        await updateSettings(settingsArray).unwrap();
        toast.success('Settings updated successfully');
      } catch (error) {
        console.error('Error updating settings:', error);
        toast.error(error.data.message);
      }
    },
  });

  return (
    <div className="container">
      <Breadcrumb pageName="Settings" />

      <form onSubmit={formik.handleSubmit}>
        <div className="col-span-5 xl:col-span-3 mb-5">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="font-medium text-black dark:text-white p-5 border-b border-stroke dark:border-strokedark">
              Fee Settings
            </h3>
            <div className="p-7">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="reminderDays"
                  >
                    Registration Fee
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    id="registrationFee"
                    name="registrationFee"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.registrationFee}
                    placeholder="Enter Registration Fee"
                  />
                  {formik.errors.registrationFee ? (
                    <div className="error">{formik.errors.registrationFee}</div>
                  ) : null}
                </div>
                <div className="w-full xl:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="reminderDays"
                  >
                    Locker Fee
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    id="lockerFee"
                    name="lockerFee"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.lockerFee}
                    placeholder="Enter Locker Fee"
                  />
                  {formik.errors.lockerFee ? (
                    <div className="error">{formik.errors.lockerFee}</div>
                  ) : null}
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="autoDeactivateMember"
                  >
                    Deactivate Member When Fee Date Passes
                  </label>
                  <select
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    id="autoDeactivateMember"
                    name="autoDeactivateMember"
                    onChange={formik.handleChange}
                    value={formik.values.autoDeactivateMember}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                  {formik.errors.autoDeactivateMember ? (
                    <div className="error">
                      {formik.errors.autoDeactivateMember}
                    </div>
                  ) : null}
                </div>
                <div className="w-full xl:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="incomingFeeDays"
                  >
                    Show in 'Incoming Fee' When Fee Date is X Days Away
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    id="incomingFeeDays"
                    name="incomingFeeDays"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.incomingFeeDays}
                    placeholder="Enter Days"
                  />
                  {formik.errors.incomingFeeDays ? (
                    <div className="error">{formik.errors.incomingFeeDays}</div>
                  ) : null}
                </div>
              </div>
              <div className="w-full xl:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="reminderDays"
                >
                  Remind When Fee Date is X Days Away
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  id="reminderDays"
                  name="reminderDays"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.reminderDays}
                  placeholder="Enter Days"
                />
                {formik.errors.reminderDays ? (
                  <div className="error">{formik.errors.reminderDays}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-5 xl:col-span-3 mb-5">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="font-medium text-black dark:text-white p-5 border-b border-stroke dark:border-strokedark">
              Gym Timings
            </h3>
            <div className="p-7">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="gymOpenTime"
                  >
                    Gym Opening Time
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    id="gymOpenTime"
                    name="gymOpenTime"
                    type="time"
                    onChange={formik.handleChange}
                    value={formik.values.gymOpenTime}
                    placeholder="Enter Opening Time"
                  />
                  {formik.errors.gymOpenTime ? (
                    <div className="error">{formik.errors.gymOpenTime}</div>
                  ) : null}
                </div>

                <div className="w-full xl:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="gymCloseTime"
                  >
                    Gym Closing Time
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    id="gymCloseTime"
                    name="gymCloseTime"
                    type="time"
                    onChange={formik.handleChange}
                    value={formik.values.gymCloseTime}
                    placeholder="Enter Closing Time"
                  />
                  {formik.errors.gymCloseTime ? (
                    <div className="error">{formik.errors.gymCloseTime}</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 rounded bg-blue-600 py-2 px-4 text-white"
        >
          Save Settings
        </button>
      </form>
      <div className="col-span-5 xl:col-span-3 my-5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-between items-center font-medium text-black dark:text-white p-5 border-b border-stroke dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Users</h3>
            <button
              type="button"
              onClick={() => setShowViewModal(true)}
              className="flex gap-3 items-center py-2 bg-secondary rounded-lg text-black px-4"
            >
              <FaPlus /> Add User
            </button>
          </div>
          <div className="p-7">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="bg-gray-500 dark:bg-meta-4 p-4">
                    <p className="hidden text-black dark:text-white sm:block">
                      Id
                    </p>
                  </th>
                  <th
                    scope="col"
                    className="bg-gray-500 dark:bg-meta-4 px-2 py-3"
                  >
                    <p className="text-black dark:text-white">username</p>
                  </th>
                  <th
                    scope="col"
                    className="bg-gray-500 dark:bg-meta-4 px-2 py-3"
                  >
                    <p className="text-black dark:text-white">role</p>
                  </th>
                  <th
                    scope="col"
                    className="bg-gray-500 dark:bg-meta-4 px-2 py-3"
                  >
                    <p className="text-black dark:text-white">created at</p>
                  </th>
                  <th
                    scope="col"
                    className="bg-gray dark:bg-meta-4 px-6 py-3 sticky right-0"
                  >
                    <p className="text-black dark:text-white">Actions</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.data?.map((user: User) => (
                  <tr
                    key={user.id}
                    className="bg-white border-b dark:bg-meta-4 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-2 py-3">
                      <p className="text-black dark:text-white">{user.id}</p>
                    </td>
                    <td className="px-2 py-3">
                      <div>
                        <p className="text-black dark:text-white mb-2">
                          {user.username}
                        </p>
                        {user.id === loggedInUser.id && (
                          <span
                            className={`rounded-full bg-meta-3/30 dark:text-white px-2 py-1`}
                          >
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-black dark:text-white">{user.role}</p>
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-sm text-gray-5 00 dark:text-gray-400">
                        {moment(user.created_at).format('DD/MM/YYYY h:m A')}
                      </p>
                    </td>
                    <td className="px-6 py-4 sticky right-0 bg-gray dark:bg-strokedark">
                      <div className="w-full flex justify-start gap-2">
                        <button
                          onClick={() => openViewModal(user)}
                          type="button"
                          className="px-3 border border-blue-500 bg-blue-500 bg-opacity-20 text-blue-500 rounded hover:bg-opacity-30 transition-colors duration-300"
                        >
                          Edit
                        </button>
                        {user.id !== loggedInUser.id && (
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            className={`px-3 border border-red-500 bg-red-500 text-red-500 bg-opacity-20  rounded hover:bg-opacity-30 transition-colors duration-300`}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="col-span-5 xl:col-span-3 mb-5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-between items-center font-medium text-black dark:text-white p-5 border-b border-stroke dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Lockers</h3>
          </div>
          <div className="p-7">
            <div className="max-h-[300px] overflow-auto">
              <table className="w-full relative overflow-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="bg-gray-500 dark:bg-meta-4 p-4">
                      <p className="hidden text-black dark:text-white sm:block">
                        Id
                      </p>
                    </th>
                    <th
                      scope="col"
                      className="bg-gray-500 dark:bg-meta-4 px-2 py-3"
                    >
                      <p className="text-black dark:text-white">
                        locker number
                      </p>
                    </th>
                    <th
                      scope="col"
                      className="bg-gray-500 dark:bg-meta-4 px-2 py-3"
                    >
                      <p className="text-black dark:text-white">assigned</p>
                    </th>
                    <th
                      scope="col"
                      className="bg-gray-500 dark:bg-meta-4 px-2 py-3"
                    >
                      <p className="text-black dark:text-white">updated at</p>
                    </th>
                    <th
                      scope="col"
                      className="bg-gray dark:bg-meta-4 px-6 py-3 sticky right-0"
                    >
                      <p className="text-black dark:text-white">Actions</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lockers?.data?.map((locker: Locker) => (
                    <tr
                      key={locker.id}
                      className="bg-white border-b dark:bg-meta-4 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-2 py-3">
                        <p className="text-black dark:text-white">
                          {locker.id}
                        </p>
                      </td>
                      <td className="px-2 py-3">
                        <p className="text-black dark:text-white mb-2">
                          {locker.locker_number}
                        </p>
                      </td>
                      <td className="px-2 py-3">
                        <p className="text-black dark:text-white">
                          {locker.is_assigned ? 'Yes' : 'No'}
                        </p>
                      </td>
                      <td className="px-2 py-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {moment(locker.updated_at).format('DD/MM/YYYY h:m A')}
                        </p>
                      </td>
                      <td className="px-6 py-4 sticky right-0 bg-gray dark:bg-strokedark">
                        <div className="w-full flex justify-start gap-2">
                          <button
                            type="button"
                            className="px-3 border border-blue-500 bg-blue-500 bg-opacity-20 text-blue-500 rounded hover:bg-opacity-30 transition-colors duration-300"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="px-3 border border-red-500 bg-red-500 text-red-500 bg-opacity-20 rounded hover:bg-opacity-30 transition-colors duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${
          !showViewModal ? 'hidden' : ''
        } z-[10000] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
      >
        <div className="bg-white dark:bg-strokedark p-8 rounded-lg shadow-xl text-black dark:text-white max-w-md w-full">
          <UserForm
            onCancel={resetForm}
            onSubmit={handleSubmit}
            initialValues={{
              id: selectedUser?.id || '',
              username: selectedUser?.username || '',
              password: selectedUser?.password || '',
              role: selectedUser?.role || '',
            }}
          />
        </div>
      </div>
      {onOk !==null && (
        <ConfirmDialog
          visible={confirmVisible}
          onOK={onOk}
          onCancel={handleCancel}
          action={confirmAction}
        />
      )}
    </div>
  );
};

export default Settings;
