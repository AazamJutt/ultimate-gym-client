import moment from 'moment';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import defaultImage from '../../images/user/user-03.png';
import InvoiceForm from '../../pages/Memberships/InvoiceForm';
import { RootState } from '../../redux/store';
import {
  useAdjustInvoiceMutation,
  useDeleteInvoiceMutation,
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [note, setNote] = useState(selectedInvoice?.note || '');
  const [adjustInvoice] = useAdjustInvoiceMutation();
  const [returnInvoice] = useReturnInvoiceMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const [editInvoice] = useEditInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();

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

  const openDeleteModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteInvoice = async () => {
    if (selectedInvoice && note) {
      try {
        const response = await deleteInvoice({
          id: selectedInvoice.id,
          note,
        });
        if (response.data?.success) {
          toast.success(
            response.data?.message || 'Invoice deleted successfully',
          );
          setNote('');
          setSelectedInvoice(undefined);
          setIsDeleteModalOpen(false);
        } else {
          toast.error(response.data?.message || 'Failed to delete invoice');
        }
      } catch (error: any) {
        toast.error(error.data?.message || 'Failed to delete invoice');
      }
    }
  };

  const canDeleteInvoice = (invoice: Invoice) => {
    // Get all invoices for this membership
    const membershipInvoices = invoices.filter(
      (inv) => inv.membership_id === invoice.membership_id,
    );

    // Sort by created_at date descending
    const sortedInvoices = membershipInvoices.sort(
      (a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf(),
    );

    // Only allow deletion if this is not the most recent invoice
    return sortedInvoices[0]?.id !== invoice.id;
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
              <th scope="col" className="bg-gray-500 dark:bg-meta-4 px-6 py-3">
                <p className="text-black dark:text-white">Locker Number</p>
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
                {invoices.map((invoice) => {
                  const canDelete = canDeleteInvoice(invoice);
                  return (
                    <tr
                      key={invoice.id}
                      className="bg-white border-b dark:bg-meta-4 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="p-4">
                        <p className="text-black dark:text-white">
                          {invoice.membership_id}
                        </p>
                      </td>

                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          className="h-12 w-12 rounded-lg object-contain"
                          width={50}
                          src={
                            invoice.client_image
                              ? invoice.client_image
                              : defaultImage
                          }
                          alt="User"
                        />
                        <div>
                          <p className="text-black dark:text-white mb-2">
                            {invoice.client_name}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <p className="text-black dark:text-white">
                            {invoice.id}
                          </p>
                          {invoice?.status !== 'active' && (
                            <span
                              className={`rounded-full ${
                                invoice?.status === 'adjusted'
                                  ? 'bg-stroke dark:bg-boxdark'
                                  : ''
                              } ${
                                invoice?.status === 'returned'
                                  ? 'bg-meta-1/20 dark:bg-meta-1/40 dark:text-white'
                                  : ''
                              } px-2 py-1`}
                            >
                              {capitalize(invoice?.status)}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 min-w-[150px]">
                        <p className="text-black dark:text-white">
                          {moment(invoice.invoice_date).format('DD MMM YYYY')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          {invoice.client_phone}
                        </p>
                      </td>
                      <td className="px-6 py-4 min-w-[150px]">
                        <p className="text-black dark:text-white">
                          {invoice.due_date}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          {invoice.locker_number || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          Rs. {invoice.registration_fee}/-
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          Rs. {invoice.personal_fee}/-
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          Rs. {invoice.training_fee}/-
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          Rs. {invoice.locker_fee}/-
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          {invoice?.reciever_name || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          {invoice.package_name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          {invoice.trainer_name || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          {invoice.nutritionist_name || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black dark:text-white">
                          {invoice.note || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4 min-w-[200px]">
                        <p className="text-black dark:text-white">
                          {moment(invoice.created_at).format(
                            'DD MMM YYYY hh:mm A',
                          )}
                        </p>
                      </td>
                      <td className="h-[80px] flex items-center gap-3 px-6 py-4 sticky top-0 bottom-0 right-0 bg-gray dark:bg-strokedark">
                        <button
                          className="h-5 px-3 border border-primary bg-primary bg-opacity-20 text-primary rounded hover:bg-opacity-30 transition-colors duration-300"
                          onClick={() => openViewModal(invoice)}
                        >
                          View
                        </button>
                        {user?.role === 'admin' &&
                          invoice?.status !== 'returned' && (
                            <button
                              onClick={() => handleEditInvoice(invoice)}
                              className="h-5 px-3 border border-warning bg-warning bg-opacity-20 text-warning rounded hover:bg-opacity-30 transition-colors duration-300"
                            >
                              Edit
                            </button>
                          )}
                        {invoice?.status !== 'returned' && !canDelete && (
                          <button
                            onClick={() => openAdjustModal(invoice)}
                            className="h-5 px-3 border border-secondary bg-secondary text-black rounded"
                          >
                            Adjust
                          </button>
                        )}
                        {user?.role === 'admin' &&
                          canDelete &&
                          invoice?.status !== 'returned' && (
                            <button
                              onClick={() => openDeleteModal(invoice)}
                              className="h-5 px-3 border border-danger bg-danger bg-opacity-20 text-danger rounded hover:bg-opacity-30 transition-colors duration-300"
                            >
                              Delete
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })}
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

      {/* Delete Modal */}
      <div
        className={`${
          !selectedInvoice || !isDeleteModalOpen ? 'hidden' : ''
        } z-[10000] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}
      >
        <div className="bg-white dark:bg-strokedark p-8 rounded-lg shadow-xl text-black dark:text-white max-w-md w-full">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Delete Invoice</h3>
            <div className="font-light">
              <span className="font-medium">Note:</span> Please provide a reason
              for deleting this invoice
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="deleteNote" className="text-lg font-bold">
                Reason for deletion
              </label>
              <textarea
                id="deleteNote"
                className="w-full p-2 border border-stroke dark:border-strokedark rounded bg-transparent"
                rows={4}
                required
                placeholder="Enter reason..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 border border-stroke dark:border-strokedark rounded hover:bg-opacity-30 transition-colors duration-300"
                onClick={() => {
                  setNote('');
                  setSelectedInvoice(undefined);
                  setIsDeleteModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                disabled={!note}
                className="px-4 py-2 bg-danger disabled:bg-stroke dark:disabled:bg-strokedark disabled:text-bodydark text-white rounded hover:bg-opacity-90 transition-colors duration-300"
                onClick={handleDeleteInvoice}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesTable;
