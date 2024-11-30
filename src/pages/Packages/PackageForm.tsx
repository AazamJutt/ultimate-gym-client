import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Package } from '../../types/Package';

interface PackageFormProps {
  onSubmit: (values: Package) => void;
  initialValues: Package;
  onCancel?: () => void;
  isEditing: boolean;
}

const PackageForm = ({
  onSubmit,
  initialValues,
  onCancel,
  isEditing = false,
}: PackageFormProps) => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Package name is required')
      .min(2, 'Name is too short'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be a positive number')
      .typeError('Price must be a number'),
    status: Yup.string()
      .oneOf(['active', 'inactive'], 'Invalid status')
      .required('Status is required'),
    period: Yup.number()
      .required('Period is required')
      .positive('Period must be a positive number')
      .integer('Period must be an integer')
      .typeError('Period must be a number'),
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
              htmlFor="name"
              className="block text-sm font-medium"
            >
              Package Name
            </label>
            <Field
              type="text"
              name="name"
              id="name"
              className="bg-white dark:bg-meta-4 mt-1 p-2 block w-full border rounded"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium"
            >
              Price
            </label>
            <Field
              type="number"
              name="price"
              id="price"
              className="bg-white dark:bg-meta-4 mt-1 p-2 block w-full border rounded"
            />
            <ErrorMessage
              name="price"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium"
            >
              Status
            </label>
            <Field
              as="select"
              name="status"
              id="status"
              className="bg-white dark:bg-meta-4 mt-1 p-2 block w-full border rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Field>
            <ErrorMessage
              name="status"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="period"
              className="block text-sm font-medium"
            >
              Period (in months)
            </label>
            <Field
              type="number"
              name="period"
              id="period"
              className="bg-white dark:bg-meta-4 mt-1 p-2 block w-full border rounded"
            />
            <ErrorMessage
              name="period"
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
              {isSubmitting ? 'Submitting...' : isEditing ? 'Update' : 'Submit'}
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

export default PackageForm;
