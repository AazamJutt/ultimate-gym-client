import moment from 'moment';
import { useState } from 'react';
import { Locker } from '../../types/Locker';

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

interface LockersTableProps {
  loading: boolean;
  lockers: any[];
}

const LockersTable = ({
  loading,
  lockers,
}: LockersTableProps) => {
  return (
    <div className="border border-stroke dark:border-graydark relative overflow-x-auto sm:rounded-t-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        {lockers?.length ? (
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="bg-gray-500 dark:bg-meta-4 min-w-[120px] px-6 py-3"
              >
                <p className="text-black dark:text-white">Locker Number</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 min-w-[220px] dark:bg-meta-4 px-2 py-3"
              >
                <p className="text-black dark:text-white">Assignee Name</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 min-w-[220px] dark:bg-meta-4 px-2 py-3"
              >
                <p className="text-black dark:text-white">Assignee Phone</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 dark:bg-meta-4 px-6 py-3 min-w-[200px]"
              >
                <p className="text-black dark:text-white">Is Assigned</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 dark:bg-meta-4 px-6 py-3 min-w-[200px]"
              >
                <p className="text-black dark:text-white">Assigned At</p>
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
            {lockers && lockers.length > 0 && (
              <tbody>
                {lockers.map((lockers) => (
                  <tr
                    key={lockers.id}
                    className="bg-white border-b dark:bg-meta-4 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="p-4">
                      <p className="text-black dark:text-white">
                        {lockers.locker_number}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-black dark:text-white mb-2">
                        {lockers.client_name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {lockers.client_phone}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {lockers.is_assigned ? 'Yes' : 'No'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {lockers.assigned_at
                          ? moment(lockers.assigned_at).format(
                              'DD MMM YYYY hh:mm A',
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

      {!lockers?.length && (
        <div className="h-100 w-full flex justify-center items-center">
          No Data
        </div>
      )}
    </div>
  );
};

export default LockersTable;
