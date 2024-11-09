import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { User } from '../../types/User';

interface UserFormProps {
  onSubmit: (values: User) => void;
  initialValues: User;
  onCancel?: () => void;
}

const UserForm = ({ onSubmit, initialValues, onCancel }: UserFormProps) => {
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    role: Yup.string()
      .oneOf(['admin', 'receptionist'])
      .required('Role is required'),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <Field
              type="text"
              name="username"
              placeholder="Enter username"
              id="username"
              className="bg-stroke dark:bg-strokedark mt-1 p-2 block w-full border dark:border-form-strokedark rounded"
            />
            <ErrorMessage
              name="username"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <Field
              type="password"
              placeholder="Enter new password"
              name="password"
              id="password"
              className="bg-stroke dark:bg-strokedark mt-1 p-2 block w-full border dark:border-form-strokedark rounded"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <Field
              type="text"
              placeholder="Enter role"
              name="role"
              id="role"
              className="bg-stroke dark:bg-strokedark mt-1 p-2 block w-full border dark:border-form-strokedark rounded"
            />
            <ErrorMessage
              name="role"
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
              {initialValues.id ? 'Update' : 'Create'} User
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

export default UserForm;
