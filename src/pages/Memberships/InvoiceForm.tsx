import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Invoice } from '../../types/Invoice';

interface InvoiceFormProps {
  isEditing?: boolean;
  onSubmit: (values: Invoice) => void;
  initialValues: Invoice;
  onCancel?: () => void;
}

const InvoiceForm = ({
  isEditing = false,
  onSubmit,
  initialValues,
  onCancel,
}: InvoiceFormProps) => {
  console.log({ initialValues });
  const validationSchema = Yup.object({
    membership_id: Yup.string().required('Membership ID is required'),
    invoice_date: Yup.date().required('Invoice date is required'),
    training_fee: Yup.number()
      .required('Training fee is required')
      .min(0)
      .typeError('Training fee must be a number'),
    personal_fee: Yup.number()
      .required('Personal fee is required')
      .min(0)
      .typeError('Personal fee must be a number'),
    locker_fee: Yup.number()
      .required('Locker fee is required')
      .min(0)
      .typeError('Locker fee must be a number'),
    client_id: Yup.string().required('Client ID is required'),
    locker_number: Yup.string().nullable().default(null),
    trainer_id: Yup.number().nullable().default(null),
    nutritionist_id: Yup.number().nullable().default(null),
    payment_type: Yup.string()
      .oneOf(['cash', 'credit card', 'debit card'], 'Invalid payment type')
      .required('Payment type is required'),
    due_date: Yup.date().required('Due date is required'),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label
              htmlFor="membership_id"
              className="block text-sm font-medium"
            >
              Membership ID
            </label>
            <Field
              type="text"
              disabled
              name="membership_id"
              id="membership_id"
              className="bg-stroke dark:bg-strokedark mt-1 p-2 block w-full border dark:border-form-strokedark rounded"
            />
            <ErrorMessage
              name="membership_id"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="invoice_date"
              className="block text-sm font-medium"
            >
              Invoice Date
            </label>
            <Field
              type="date"
              name="invoice_date"
              disabled
              id="invoice_date"
              className="bg-stroke dark:bg-strokedark mt-1 p-2 block w-full border dark:border-form-strokedark rounded"
            />
            <ErrorMessage
              name="invoice_date"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="locker_number"
              className="block text-sm font-medium"
            >
              Locker Number
            </label>
            <Field
              type="string"
              name="locker_number"
              disabled
              id="locker_number"
              className="bg-stroke dark:bg-strokedark mt-1 p-2 block w-full border dark:border-form-strokedark rounded"
            />
            <ErrorMessage
              name="locker_number"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="training_fee"
              className="block text-sm font-medium"
            >
              Training Fee
            </label>
            <Field
              type="number"
              name="training_fee"
              disabled={!isEditing}
              id="training_fee"
              className="bg-stroke dark:bg-strokedark mt-1 p-2 block w-full border dark:border-form-strokedark rounded"
            />
            <ErrorMessage
              name="training_fee"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="personal_fee"
              className="block text-sm font-medium"
            >
              Personal Fee
            </label>
            <Field
              type="number"
              name="personal_fee"
              disabled={!isEditing}
              id="personal_fee"
              className="bg-stroke dark:bg-strokedark mt-1 p-2 block w-full border dark:border-form-strokedark rounded"
            />
            <ErrorMessage
              name="personal_fee"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="locker_fee"
              className="block text-sm font-medium"
            >
              Locker Fee
            </label>
            <Field
              type="number"
              name="locker_fee"
              disabled={!isEditing}
              id="locker_fee"
              className="bg-stroke dark:bg-strokedark mt-1 p-2 block w-full border dark:border-form-strokedark rounded"
            />
            <ErrorMessage
              name="locker_fee"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Field
              hidden
              type="number"
              name="client_id"
              id="client_id"
              className="hidden bg-white dark:bg-meta-4 mt-1 p-2 block w-full border rounded"
            />
          </div>

          <div>
            <Field
              hidden
              type="number"
              name="trainer_id"
              id="trainer_id"
              className="hidden bg-white dark:bg-meta-4 mt-1 p-2 block w-full border rounded"
            />
          </div>

          <div>
            <Field
              hidden
              type="number"
              name="nutritionist_id"
              id="nutritionist_id"
              className="hidden bg-white dark:bg-meta-4 mt-1 p-2 block w-full border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="payment_type"
              className="block text-sm font-medium"
            >
              Payment Type
            </label>
            <Field
              as="select"
              name="payment_type"
              id="payment_type"
              className="bg-white dark:bg-meta-4 mt-1 p-2 block w-full border border-form-strokedark rounded"
            >
              <option value="">Select Payment Type</option>
              <option value="cash">Cash</option>
              <option value="credit card">Credit Card</option>
              <option value="debit card">Debit Card</option>
            </Field>
            <ErrorMessage
              name="payment_type"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Field
              type="date"
              name="due_date"
              id="due_date"
              className="hidden bg-white dark:bg-meta-4 mt-1 p-2 block w-full border rounded"
            />
            <ErrorMessage
              name="due_date"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isEditing ? 'Update Invoice' : 'Create Invoice'}
            </button>
            {onCancel && (
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={isSubmitting}
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default InvoiceForm;
