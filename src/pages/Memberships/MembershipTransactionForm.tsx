import { useFormik } from 'formik';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { ultimateGymApiSlice } from '../../redux/slices/gymApi.slice';
import { useAddMembershipTransactionMutation } from '../../services/membership.service';
import { useGetSettingsQuery } from '../../services/setting.service';
import { Setting } from '../../types/Setting';
import MemberForm from '../Members/MemberForm';
import MembershipForm from './MembershipForm';
import useLocalStorage from '../../hooks/useLocalStorage';

const FORM_STORAGE_KEY = 'membershipTransactionForm';

const MembershipTransactionForm = () => {
  const [addMembershipTransaction] = useAddMembershipTransactionMutation();
  const { data: settings } = useGetSettingsQuery();

  const dispatch = useDispatch();
  const [clientImage, setClientImage] = useState<File | undefined>();
  const navigate = useNavigate();

  // Get initial values from localStorage or use defaults
  const defaultValues = {
    client: {
      name: '',
      phone: '',
      secondary_phone: '',
      gender: '',
      cnic: '',
      joining_date: moment().format('YYYY-MM-DD'),
      address: '',
      blood_group: '',
      dob: '',
      profession: '',
      discovery_method: '',
    },
    membership: {
      status: 'active',
      locker_number: '',
      fee_date: moment().add(1, 'month').format('YYYY-MM-DD'),
      package_id: null,
      trainer_id: null,
      nutritionist_id: null,
      training_fee: 0,
      personal_fee: 0,
      locker_fee: 0,
      registration_fee:
        settings?.data.find(
          (setting: Setting) => setting.key === 'registrationFee',
        )?.value || 0,
    },
  };

  const [formValues, setFormValues] = useLocalStorage(FORM_STORAGE_KEY, defaultValues);

  const validationSchema = Yup.object({
    client: Yup.object({
      name: Yup.string().required('Name is required'),
      phone: Yup.string().required('Phone is required'),
      secondary_phone: Yup.string(),
      gender: Yup.string().required('Gender is required'),
      cnic: Yup.string().required('Cnic is required'),
      joining_date: Yup.date().required('Joining date is required'),
      address: Yup.string(),
      blood_group: Yup.string(),
      dob: Yup.date(),
      profession: Yup.string(),
      discovery_method: Yup.string(),
    }),
    membership: Yup.object({
      status: Yup.string(),
      fee_date: Yup.date(),
      locker_number: Yup.string(),
      package_id: Yup.string().required('Package is required'),
      trainer_id: Yup.string()
        .nullable()
        .transform((value) => (value === '' ? null : value)),
      nutritionist_id: Yup.string()
        .nullable()
        .transform((value) => (value === '' ? null : value)),
      training_fee: Yup.number().min(0),
      personal_fee: Yup.number()
        .min(0)
        .required('Membership fee is required'),
      locker_fee: Yup.number().min(0).required('Membership fee is required'),
      registration_fee: Yup.number()
        .min(0)
        .required('Membership fee is required'),
    }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formValues,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values: any) => {
      const formData: any = new FormData();

      const appendFormData = (data: any, rootKey: string | null = null) => {
        if (data && typeof data === 'object' && !(data instanceof File)) {
          Object.entries(data).forEach(([key, value]) => {
            const formKey = rootKey ? `${rootKey}[${key}]` : key;
            appendFormData(value, formKey);
          });
        } else {
          if (data === null || data === undefined) {
            formData.append(rootKey!, '');
          } else {
            formData.append(rootKey!, data);
          }
        }
      };

      appendFormData(values);

      if (clientImage) {
        formData.append('client[image]', clientImage);
      }

      try {
        const response = await addMembershipTransaction(formData).unwrap();
        dispatch(ultimateGymApiSlice.util.resetApiState());
        if (!response.error) {
          // Clear saved form data on successful submission
          localStorage.removeItem(FORM_STORAGE_KEY);
          toast.success('Membership added successfully');
          navigate(`/memberships/all?invoice_id=${response.data?.invoice.id}`);
        } else toast.error(response?.data?.message || 'Could not add Membership');
      } catch (error) {
        console.error('Failed to add Membership:', error);
        toast.error(error?.data?.details || 'Failed to add Membership');
      }
    },
  });

  // Save form values to localStorage whenever they change
  useEffect(() => {
    if (formik.values) {
      setFormValues(formik.values);
    }
  }, [formik.values]);

  const handleClear = () => {
    localStorage.removeItem(FORM_STORAGE_KEY);
    setClientImage(undefined);
    formik.resetForm({values: defaultValues});
    toast.success('Form cleared successfully');
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Breadcrumb pageName="Create Membership" />
      <MemberForm
        formik={formik}
        name="client"
        isSubForm={true}
        setClientImage={setClientImage}
      />
      <MembershipForm
        formik={formik}
        name="membership"
        isSubForm={true}
      />
      <div className="mt-4 flex gap-4">
        <button
          type="submit"
          className="w-90 rounded bg-primary px-4 py-2 text-white"
        >
          Add Membership
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded bg-danger px-4 py-2 text-white"
        >
          Clear Form
        </button>
      </div>
    </form>
  );
};

export default MembershipTransactionForm;
