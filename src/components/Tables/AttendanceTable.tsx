import moment from 'moment';
import { Link } from 'react-router-dom';
import defaultImage from '../../images/user/user-03.png';
import { capitalize } from '../../utils/helpers';

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

interface AttendanceTableProps {
  loading: boolean;
  attendances: any[];
}

const AttendanceTable = ({ loading, attendances }: AttendanceTableProps) => {
  return (
    <div className="border border-stroke dark:border-graydark relative overflow-x-auto sm:rounded-t-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        {attendances?.length ? (
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 p-4">
                <p className="hidden text-black dark:text-white sm:block">
                  Member Id
                </p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 min-w-[220px] dark:bg-meta-4 px-2 py-3"
              >
                <p className="text-black dark:text-white">Client Name</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 min-w-[220px] dark:bg-meta-4 px-2 py-3"
              >
                <p className="text-black dark:text-white">Status</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 dark:bg-meta-4 min-w-32 px-6 py-3"
              >
                <p className="text-black dark:text-white">Date</p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="text-black dark:text-white">Phone</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 dark:bg-meta-4 px-6 py-3 min-w-[200px]"
              >
                <p className="text-black dark:text-white">Checkin At</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 dark:bg-meta-4 px-6 py-3 min-w-[200px]"
              >
                <p className="text-black dark:text-white">Checkout At</p>
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
            {attendances && attendances.length > 0 && (
              <tbody>
                {attendances.map((attendance) => (
                  <tr
                    key={attendance.id}
                    className="bg-white border-b dark:bg-meta-4 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="p-4">
                      <p className="text-black dark:text-white">
                        {attendance.member_id}
                      </p>
                    </td>

                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        className="h-12 w-12 rounded-lg object-contain"
                        width={50}
                        src={
                          attendance.client_image
                            ? `http://localhost:8080/${attendances.member_image}`
                            : defaultImage
                        }
                        alt="User"
                      />
                      <div>
                        <p className="text-black dark:text-white mb-2">
                          {attendance.member_name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          {attendance.status && (
                            <span
                              className={`mr-2 rounded-full ${`${
                                attendance.status === 'late'
                                  ? 'bg-stroke dark:bg-boxdark'
                                  : ''
                              } ${
                                attendance.status ===
                                'present'
                                  ? 'bg-meta-3/30 dark:text-white'
                                  : ''
                              } ${
                                attendance.status ===
                                'absent'
                                  ? 'bg-meta-1/20 dark:bg-meta-1/40 dark:text-white'
                                  : ''
                              }`} px-2 py-1`}
                            >
                              {capitalize(
                                attendance.status,
                              )}
                            </span>
                          )}
                        </p>
                      </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {attendance.date || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {attendance.member_phone}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {attendance.checkin_at
                          ? moment(attendance.checkin_at, "HH:mm").format(
                              'hh:mm A',
                            )
                          : 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {attendance.checkout_at
                          ? moment(attendance.checkout_at, "HH:mm").format(
                              'hh:mm A',
                            )
                          : 'N/A'}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </>
        )}
      </table>

      {!attendances?.length && (
        <div className="h-100 w-full flex justify-center items-center">
          No Data
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
