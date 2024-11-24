import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Locker } from '../../types/Locker';
import { useGetLockersQuery } from '../../services/locker.service';

interface LockerFormProps {
  enableReinitialize?: boolean;
  onSubmit: (values: Locker) => void;
  initialValues: Locker;
  onCancel?: () => void;
}

const LockerForm = ({
  enableReinitialize,
  onSubmit,
  initialValues,
  onCancel,
}: LockerFormProps) => {
  console.log({ initialValues });
  const validationSchema = Yup.object({
    member_id: Yup.number().required("Member ID is required"),
    locker_number: Yup.string().required('Locker Number is required'),
  });
  const { data: lockers } = useGetLockersQuery({ assigned: false });

  return (
    <Formik
      enableReinitialize={enableReinitialize}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
             <Field
              type="string"
              name="member_id"
              disabled
              hidden
              id="member_id"
              className="hidden bg-stroke text-black-2 dark:bg-strokedark mt-1 p-2 block w-full border dark:border-form-strokedark rounded"
            />
          <div className="w-full mb-3 ">
            <label className="mb-2.5 block text-black dark:text-white">
              Locker
            </label>
            <Field
              as="select"
              name="locker_number"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">Select Locker</option>
              {lockers?.data?.map((locker: Locker) => (
                <option key={locker.id} value={locker.locker_number}>
                  {locker.locker_number}
                </option>
              ))}
            </Field>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isSubmitting}
            >
              Assign Locker
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

export default LockerForm;
