import moment from 'moment';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import defaultImage from '../../images/user/user-03.png';
import InvoiceForm from '../../pages/Memberships/InvoiceForm';
import { RootState } from '../../redux/store';
import {
  useAdjustInvoiceMutation,
  useEditInvoiceMutation,
  useReturnInvoiceMutation,
} from '../../services/invoice.service';
import { Invoice } from '../../types/Invoice';
import { capitalize } from '../../utils/helpers';
import InvoicePrint from '../InvoicePrint';
import { confirmDialog } from 'primereact/confirmdialog';

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
  const [isAdjustReturnModalOpen, setIsAdjustReturnModalOpen] = useState(false);
  const [note, setNote] = useState(selectedInvoice?.note || '');
  const [adjustInvoice] = useAdjustInvoiceMutation();
  const [returnInvoice] = useReturnInvoiceMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const [editInvoice] = useEditInvoiceMutation();

  const openViewModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
    setIsAdjustReturnModalOpen(false);
  };

  const openAdjustModal = async (invoice: Invoice) => {
    setSelectedInvoice({ ...invoice, status: 'adjusted' });
    setIsViewModalOpen(false);
    setIsAdjustReturnModalOpen(true);
  };

  const handleAdjustInvoice = async () => {
    if (selectedInvoice) {
      try {
        const response = await adjustInvoice({
          id: selectedInvoice.id,
          data: { note: note || 'Invoice Adjusted' },
        });
        console.log(response);
        toast.success(response.data?.message);
        setNote('');
        setSelectedInvoice(undefined);
        setIsAdjustReturnModalOpen(false);
      } catch (error: any) {
        toast.error(error.data?.message || 'Failed to adjust invoice');
      }
    }
  };

  const handleReturnInvoice = async () => {
    if (selectedInvoice) {
      try {
        const response = await returnInvoice({
          id: selectedInvoice.id,
          data: { note: note || 'Invoice Returned' },
        });
        toast.success(response.data?.message);
        setSelectedInvoice(undefined);
        setIsAdjustReturnModalOpen(false);
      } catch (error: any) {
        toast.error(error.data?.message || 'Failed to return invoice');
      }
    }
  };

  const handleEditInvoice = async (invoice: Invoice) => {
    setIsEditModalOpen(true);
    setSelectedInvoice(invoice);
  };

  const handleUpdateInvoice = async (invoice: Invoice) => {
    confirmDialog({
      title: 'Update Invoice',
      message: 'Are you sure you want to update this invoice?',
      confirmText: 'Update',
      cancelText: 'Cancel',
      accept: async () => {
        try {
          const response = await editInvoice({
            id: selectedInvoice?.id,
            data: invoice,
          });
          if (response.data?.success) {
            toast.success(response.data?.message);
            setSelectedInvoice(undefined);
            setIsEditModalOpen(false);
          } else {
            toast.error(response.data?.message || 'Failed to update invoice');
          }
        } catch (error: any) {
          console.log(error);
          toast.error(error.data?.message || 'Failed to update invoice');
        }
      },
    });
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
              <th
                scope="col"
                className="bg-gray-500 dark:bg-meta-4 px-6 py-3 min-w-32"
              >
                <p className="text-black dark:text-white">Due Date</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 min-w-[155px]
               dark:bg-meta-4 px-6 py-3"
              >
                <p className="text-black dark:text-white">Registration Fee</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 min-w-[135px]
               dark:bg-meta-4 px-6 py-3"
              >
                <p className="text-black dark:text-white">Membership Fee</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 min-w-[155px]
               dark:bg-meta-4 px-6 py-3"
              >
                <p className="text-black dark:text-white">Training Fee</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 min-w-[135px]
               dark:bg-meta-4 px-6 py-3"
              >
                <p className="text-black dark:text-white">Locker Fee</p>
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
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="text-black dark:text-white">Adjustment Reason</p>
              </th>
              <th
                scope="col"
                className="bg-gray-500 dark:bg-meta-4 px-6 py-3 min-w-[200px]"
              >
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
                          {invoices.client_name}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-black dark:text-white">
                          {invoices.id}
                        </p>
                        {invoices?.status !== 'active' && (
                          <span
                            className={`rounded-full ${
                              invoices?.status === 'adjusted'
                                ? 'bg-stroke dark:bg-boxdark'
                                : ''
                            } ${
                              invoices?.status === 'active'
                                ? 'bg-meta-3/30 dark:text-white'
                                : ''
                            } ${
                              invoices?.status === 'returned'
                                ? 'bg-meta-1/20 dark:bg-meta-1/40 dark:text-white'
                                : ''
                            } px-2 py-1`}
                          >
                            {capitalize(invoices?.status)}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 min-w-[150px]">
                      <p className="text-black dark:text-white">
                        {moment(invoices.invoice_date).format('DD MMM YYYY')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        {invoices.client_phone}
                      </p>
                    </td>
                    <td className="px-6 py-4 min-w-[150px]">
                      <p className="text-black dark:text-white">
                        {invoices.due_date}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white">
                        Rs. {invoices.registration_fee}/-
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
                        Rs. {invoices.locker_fee}/-
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
                        {invoices.note || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <p className="text-black dark:text-white">
                        {moment(invoices.created_at).format(
                          'DD MMM YYYY hh:mm A',
                        )}
                      </p>
                    </td>
                    <td className="flex gap-3 h-auto px-6 py-4 sticky right-0 bg-gray dark:bg-strokedark">
                      <div className="w-full flex justify-start gap-2">
                        <button
                          className="px-3 border border-primary bg-primary bg-opacity-20 text-primary rounded hover:bg-opacity-30 transition-colors duration-300"
                          onClick={() => openViewModal(invoices)}
                        >
                          View
                        </button>
                      </div>
                      {user?.role === 'admin' &&
                        invoices?.status !== 'returned' && (
                          <div className="w-full flex justify-start gap-2">
                            <button
                              onClick={() => handleEditInvoice(invoices)}
                              className="px-3 border bg-danger text-danger bg-opacity-20 rounded hover:bg-opacity-30 transition-colors duration-300"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      {invoices?.status !== 'returned' && (
                        <div className="w-full flex justify-start gap-2">
                          <button
                            onClick={() => openAdjustModal(invoices)}
                            className="px-3 border border-secondary bg-secondary text-black rounded"
                          >
                            Adjust
                          </button>
                        </div>
                      )}
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
      {/* View Modal */}
      <div
        className={`${
          !selectedInvoice || !isViewModalOpen ? 'hidden' : ''
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
      {/* Edit Modal */}
      <div
        className={`${
          !selectedInvoice || !isEditModalOpen ? 'hidden' : ''
        } z-[10000] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}
      >
        <div className="bg-white dark:bg-strokedark p-8 rounded-lg shadow-xl text-black dark:text-white max-w-md w-full">
          <h3 className="text-xl font-semibold mb-4">Edit Invoice</h3>
          {selectedInvoice && (
            <InvoiceForm
              isEditing={true}
              initialValues={{
                membership_id: selectedInvoice.membership_id,
                trainer_id: selectedInvoice?.trainer_id || null,
                package_id: selectedInvoice.package_id,
                package_name: selectedInvoice.package_name,
                nutritionist_id: selectedInvoice?.nutritionist_id || null,
                training_fee: selectedInvoice?.training_fee || 0,
                registration_fee: selectedInvoice?.registration_fee || 0,
                personal_fee: selectedInvoice?.personal_fee || 0,
                locker_fee: selectedInvoice?.locker_fee || 0,
                locker_number: selectedInvoice?.locker_number || '',
                client_id: selectedInvoice.client_id,
                invoice_date: moment().format('YYYY-MM-DD'),
                due_date: selectedInvoice.due_date,
                payment_type: 'cash',
              }}
              onSubmit={handleUpdateInvoice}
              onCancel={() => {
                setSelectedInvoice(undefined);
                setIsEditModalOpen(false);
              }}
            />
          )}
        </div>
      </div>

      {/* Adjustment/Return Modal */}
      <div
        className={`${
          !selectedInvoice || !isAdjustReturnModalOpen ? 'hidden' : ''
        } z-[10000] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}
      >
        <div className="bg-white dark:bg-strokedark p-8 rounded-lg shadow-xl text-black dark:text-white max-w-md w-full">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">
              {selectedInvoice?.status === 'adjusted'
                ? 'Adjust Invoice'
                : 'Return Invoice'}
            </h3>
            <div className="font-light">
              <span className="font-medium">Note:</span> Adjusting this invoice
              will update it's details to the underlying Membership's details
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="note" className="text-lg font-bold">
                Reason of the adjustment
              </label>
              <textarea
                id="note"
                className="w-full p-2 border border-stroke dark:border-strokedark rounded bg-transparent"
                rows={4}
                required
                placeholder="Enter note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 border border-stroke dark:border-strokedark rounded hover:bg-opacity-30 transition-colors duration-300"
                onClick={() => {
                  setSelectedInvoice(undefined);
                  setIsAdjustReturnModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                disabled={!note || note === selectedInvoice?.note}
                className="px-4 py-2 bg-primary disabled:bg-stroke dark:disabled:bg-strokedark disabled:text-bodydark text-white rounded hover:bg-opacity-90 transition-colors duration-300"
                onClick={
                  selectedInvoice?.status === 'adjusted'
                    ? handleAdjustInvoice
                    : handleReturnInvoice
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesTable;
