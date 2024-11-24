import { useFormik } from 'formik';
import moment from 'moment';
import { useState } from 'react';
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

const MembershipTransactionForm = () => {
  const [addMembershipTransaction] = useAddMembershipTransactionMutation();
  const { data: settings } = useGetSettingsQuery();

  const dispatch = useDispatch();
  const [image, setClientImage] = useState<File | undefined>();
  const navigate = useNavigate();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
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
    },
    validationSchema: Yup.object({
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
    }),
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

      if (image) {
        formData.append('client[image]', image);
      }

      try {
        const response = await addMembershipTransaction(formData).unwrap();
        dispatch(ultimateGymApiSlice.util.resetApiState());
        if (!response.error) {
          toast.success('Membership added successfully');
          navigate(`/memberships/all?invoice_id=${response.data?.invoice.id}`);
        } else toast.error('Could not add Membership');
      } catch (error) {
        console.error('Failed to add Membership:', error);
        toast.error('Failed to add Membership:', error.message);
      }
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Breadcrumb pageName="Create Member" />
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
      <button
        type="submit"
        className="mt-4 w-full rounded bg-primary py-3 text-white"
      >
        Add Member
      </button>
    </form>
  );
};

export default MembershipTransactionForm;
