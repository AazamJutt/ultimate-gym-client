import { useState } from 'react';
import { FaCheck, FaFileInvoice } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import defaultImage from '../../images/user/user-03.png';
import { Invoice } from '../../types/Invoice';
import { capitalize } from '../../utils/helpers';
import InvoicePrint from '../InvoicePrint';
import moment from 'moment';

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

interface InvoicesTableProps {
  loading: boolean;
  invoices: any[];
}

const InvoicesTable = ({ loading, invoices }: InvoicesTableProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const openViewModal = (invoices: any) => {
    setSelectedInvoice(invoices);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedInvoice(null);
    setIsViewModalOpen(false);
  };
  return (
    <div className="border border-stroke dark:border-graydark relative overflow-x-auto sm:rounded-t-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        {invoices?.length ? (
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 p-4">
                <p className="hidden text-black dark:text-white sm:block">
                  Membership Id
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
                className="bg-gray-500 dark:bg-meta-4 min-w-[120px] px-6 py-3"
              >
                <p className="text-black dark:text-white">Invoice Id</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 dark:bg-meta-4 min-w-32 px-6 py-3"
              >
                <p className="text-black dark:text-white">Invoice Date</p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="text-black dark:text-white">Phone</p>
              </th>
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3 min-w-32">
                <p className="text-black dark:text-white">Due Date</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 min-w-[155px]
               dark:bg-meta-4 px-6 py-3"
              >
                <p className="text-black dark:text-white">Personal Fee</p>
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
                className="bg-gray-500 min-w-[135px]
               dark:bg-meta-4 px-6 py-3"
              >
                <p className="text-black dark:text-white">Receiver Name</p>
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
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3 min-w-[200px]">
                <p className="text-black dark:text-white">Created At</p>
              </th>
              <th
                scope="col"
                className="bg-gray dark:bg-meta-4 px-6 py-3 sticky right-0"
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
            {invoices && invoices.length > 0 && (
              <tbody>
                {invoices.map((invoices) => (
                  <tr
                    key={invoices.id}
                    className="bg-white border-b dark:bg-meta-4 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="p-4">
                      <p className="text-black dark:text-white">
                        {invoices.membership_id}
                      </p>
                    </td>

                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        className="h-12 w-12 rounded-lg object-contain"
                        width={50}
                        src={
                          invoices.client_image
                            ? invoices.client_image
                            : defaultImage
                        }
                        alt="User"
                      />
                      <div>
                        <p className="text-black dark:text-white mb-2">
                          <Link
                            className="hover:underline"
                            to={`/members/${invoices.client_id}/edit`}
                          >
                            {invoices.client_name}
                          </Link>
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {invoices.id}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {invoices.invoice_date || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {invoices.client_phone}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {invoices.due_date}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        Rs. {invoices.personal_fee}/-
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        Rs. {invoices.training_fee}/-
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {invoices?.reciever_name || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {invoices.package_name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {invoices.trainer_name || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {invoices.nutritionist_name || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {moment(invoices.created_at).format('MM/DD/YYYY hh:mm A')}
                      </p>
                    </td>
                    <td className="px-6 py-4 sticky right-0 bg-gray dark:bg-strokedark">
                      <div className="w-full flex justify-start gap-2">
                        <button
                          className="px-3 border border-primary bg-primary bg-opacity-20 text-primary rounded hover:bg-opacity-30 transition-colors duration-300"
                          onClick={() => openViewModal(invoices)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </>
        )}
      </table>

      {!invoices?.length && (
        <div className="h-100 w-full flex justify-center items-center">
          No Data
        </div>
      )}
      {/* 
      <ViewMembershipModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        invoices={selectedInvoice}
      /> */}

      <div
        className={`${
          !selectedInvoice ? 'hidden' : ''
        } z-[10000] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
      >
        <div className="bg-white dark:bg-strokedark p-8 rounded-lg shadow-xl text-black dark:text-white max-w-md w-full">
          {selectedInvoice && (
            <InvoicePrint
              invoiceData={selectedInvoice}
              setInvoiceData={setSelectedInvoice}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicesTable;
