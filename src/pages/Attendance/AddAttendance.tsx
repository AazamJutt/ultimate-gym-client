import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useAddAttendanceMutation } from '../../services/attendance.service';
import { useGetStaffsQuery } from '../../services/staff.service';
import { toast } from 'react-toastify';

const AddAttendance = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [addAttendance] = useAddAttendanceMutation();
  const { data: staff } = useGetStaffsQuery({
    page: 1,
    pageSize: 1000,
  });
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    formik.setFieldValue('status', status.toLowerCase());
  };

  const formik = useFormik({
    initialValues: {
      member_id: '', // Person ID
      date: '', // Attendance date
      checkin_at: '', // Check-in time
      checkout_at: '', // Check-out time
      status: '', // Attendance status
    },
    validationSchema: Yup.object({
      member_id: Yup.number().required('Member ID is required'),
      date: Yup.date().required('Date is required'),
      checkin_at: Yup.string().required('Check-in time is required'),
      checkout_at: Yup.string().required('Check-out time is required'),
      status: Yup.string().required('Status is required'),
    }),
    onSubmit: async (values) => {
      try {
        await addAttendance({ attendanceData: values });
        toast.success('Attendance added successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to add attendance');
        console.error('Failed to add attendance:', error);
      }
    },
  });

  return (
    <>
      <Breadcrumb pageName="Add Attendance" />

      <div className="grid grid-cols-1 justify-center">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Attendance Form
              </h3>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="p-6.5">
                {/* Select Person */}
                <div className="mb-4.5">
                  <select
                    name="member_id"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={formik.handleChange}
                    value={formik.values.member_id}
                  >
                    <option value="">Select Staff Member</option>
                    {staff?.data?.map((staff) => (
                      <option key={staff.id} value={staff.member_id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Attendance Date */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Attendance Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.date}
                  />
                  {formik.touched.date && formik.errors.date ? (
                    <div className="text-red-500">{formik.errors.date}</div>
                  ) : null}
                </div>

                {/* Check-in Time */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    name="checkin_at"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.checkin_at}
                  />
                  {formik.touched.checkin_at && formik.errors.checkin_at ? (
                    <div className="text-red-500">
                      {formik.errors.checkin_at}
                    </div>
                  ) : null}
                </div>

                {/* Check-out Time */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    name="checkout_at"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.checkout_at}
                  />
                  {formik.touched.checkout_at && formik.errors.checkout_at ? (
                    <div className="text-red-500">
                      {formik.errors.checkout_at}
                    </div>
                  ) : null}
                </div>

                {/* Attendance Status */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Status
                  </label>
                  <div className="flex gap-4">
                    {['Present', 'Absent', 'Late'].map((status) => (
                      <div
                        key={status}
                        className={`cursor-pointer flex-1 rounded p-4 border-[1.5px] text-center ${
                          selectedStatus === status
                            ? 'bg-primary text-white'
                            : 'border-stroke bg-transparent text-black dark:border-form-strokedark dark:text-white'
                        }`}
                        onClick={() => handleStatusChange(status)}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                  {formik.touched.status && formik.errors.status ? (
                    <div className="text-red-500">{formik.errors.status}</div>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Add Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAttendance;
