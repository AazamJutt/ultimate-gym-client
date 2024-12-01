import { useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import * as Yup from 'yup';
import defaultImage from '../../images/user/user-03.png';
import { useGetLockersQuery } from '../../services/locker.service';
import { Client } from '../../types/Client';
import { Locker } from '../../types/Locker';
import { Setting } from '../../types/Setting';
import { Staff } from '../../types/staff';
import { formatCnic } from '../../utils/helpers';

interface MemberFormProps {
  initialValues?: Client | Staff; // Allow passing initial values for editing
  onSubmit?: any; // Handle submit logic externally
  isEditing?: boolean;
  enableReinitialize?: boolean;
  staff?: boolean;
  isSubForm?: boolean;
  name?: string;
  formik?: any;
  setClientImage?: any;
  locker_fee?: number;
}

const MemberForm = ({
  initialValues,
  onSubmit,
  isEditing = false,
  enableReinitialize = true,
  staff = false,
  isSubForm = false,
  formik,
  name,
  setClientImage,
  locker_fee,
}: MemberFormProps) => {
  const fileInputRef = useRef(null);

  const [image, setImage] = useState<File | null>();
  const [imageSrc, setImageSrc] = useState<string>(defaultImage);
  if (!isSubForm) {
    formik = useFormik({
      enableReinitialize,
      initialValues: {
        name: initialValues?.name || '',
        phone: initialValues?.phone || '',
        secondary_phone: initialValues?.secondary_phone || '',
        gender: initialValues?.gender || '',
        cnic: initialValues?.cnic || '',
        joining_date:
          initialValues?.joining_date || moment().format('YYYY-MM-DD'),
        address: initialValues?.address || '',
        blood_group: initialValues?.blood_group || '',
        dob: initialValues?.dob || '',
        ...(staff
          ? {
              fee: initialValues?.fee || '',
              type: initialValues?.type || '',
              role: initialValues?.role || '',
            }
          : {
              profession: initialValues?.profession || '',
              discovery_method: initialValues?.discovery_method || '',
            }),
      },
      validationSchema: Yup.object({
        name: Yup.string().required('Name is required'),
        phone: Yup.string()
          .required('Phone is required')
          .length(11, 'Phone must be exactly 11 characters long'),
        secondary_phone: Yup.string().length(
          11,
          'Secondary phone must be exactly 11 characters long',
        ),
        gender: Yup.string().required('Gender is required'),
        cnic: Yup.string()
          .required('CNIC is required')
          .matches(
            /^\d{5}-\d{7}-\d{1}$/,
            'CNIC must be in the format xxxxx-xxxxxxx-x',
          ),
        joining_date: Yup.date().required('Joining date is required'),
        address: Yup.string(),
        blood_group: Yup.string(),
        dob: Yup.date(),
        ...(staff
          ? {
              type: Yup.string().required('Staff Type is required'),
              fee: Yup.number().when('type', ([type], schema) => {
                return ['trainer', 'nutritionist'].includes(type)
                  ? schema
                      .required(`Training Fee is required for ${type}`)
                      .min(0, 'Fee must be positive')
                  : schema.notRequired();
              }),
              role: Yup.string().required(`Role is required`),
            }
          : {
              profession: Yup.string(),
              discovery_method: Yup.string(),
            }),
      }),
      onSubmit: async (values: Client | Staff) => {
        try {
          await onSubmit(values, image);
        } catch (error) {
          console.error('Failed to submit:', error);
        }
      },
    });
  }
  const values = name ? formik.values[name] : formik.values;
  const errors = name ? formik.errors[name] : formik.errors;
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      isSubForm && setClientImage ? setClientImage(file) : setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    const selectedType = values.type;

    if (['trainer', 'nutritionist'].includes(selectedType)) {
      formik.setFieldValue(name ? `${name}.role` : 'role', selectedType);
      return;
    }
  }, [values.type]);

  useEffect(() => {
    if (initialValues?.image) {
      setImageSrc(initialValues?.image);
    }
    return () => setImageSrc('');
  }, [initialValues]);

  let Wrapper = isSubForm ? 'div' : 'form';
  return (
    <div className="grid grid-cols-1 justify-center mb-3">
      <div className="flex flex-col gap-9">
        {/* Member Form */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              {staff ? 'Staff' : ''} Member Form
            </h3>
          </div>
          <Wrapper onSubmit={onSubmit ? formik.handleSubmit : () => {}}>
            <div className="p-6.5">
              <div className="flex gap-10">
                <div className="mb-10 flex items-center flex-col  gap-3">
                  <div className="h-50 w-50 overflow-hidden">
                    <img
                      src={imageSrc || defaultImage}
                      alt="User"
                      className="h-full w-full rounded-xl object-contain bg-gray"
                    />
                  </div>
                  <div className="flex gap-5">
                    <button
                      type="button"
                      className="text-sm hover:text-primary"
                      onClick={() => {
                        setImage(null);
                        setImageSrc('');
                      }}
                    >
                      <span className="flex h-10 w-10 items-center text-primary justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <MdDelete />
                      </span>
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current?.click(); // Trigger file input click
                        }
                      }}
                      className=" block hover:text-primary cursor-pointer appearance-none"
                    >
                      <div className="text-sm">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                              fill="#3C50E0"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                              fill="#3C50E0"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                              fill="#3C50E0"
                            />
                          </svg>
                        </span>
                        Update
                      </div>
                    </button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden inset-0 z-50 m-0 h-full w-full p-0 opacity-0 outline-none"
                  onChange={handleImageChange} // Handle image upload
                />
                <div className="w-full mb-4.5 flex flex-col gap-6 ">
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name={name ? `${name}.name` : 'name'}
                      placeholder="Enter member's name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={formik.handleChange}
                      value={values.name}
                    />
                    {errors?.name ? (
                      <div className="text-red-500">{errors?.name}</div>
                    ) : null}
                  </div>

                  {/* Phone */}
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Phone
                    </label>
                    <input
                      type="text"
                      name={name ? `${name}.phone` : 'phone'}
                      maxLength={11}
                      minLength={11}
                      placeholder="Enter phone number"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={formik.handleChange}
                      value={values.phone}
                    />
                    {errors?.phone ? (
                      <div className="text-red-500">{errors.phone}</div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Gender and CNIC */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Secondary Phone
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    minLength={11}
                    name={name ? `${name}.secondary_phone` : 'secondary_phone'}
                    placeholder="Enter secondary phone"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={formik.handleChange}
                    value={values.secondary_phone}
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    CNIC
                  </label>
                  <input
                    type="text"
                    name={name ? `${name}.cnic` : 'cnic'}
                    placeholder="Enter CNIC"
                    maxLength={15}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e) => {
                      const formattedCnic = formatCnic(e.target.value);
                      formik.setFieldValue(
                        name ? `${name}.cnic` : 'cnic',
                        formattedCnic,
                      );
                    }}
                    value={values.cnic}
                  />

                  {errors?.cnic ? (
                    <div className="text-red-500">{errors?.cnic}</div>
                  ) : null}
                </div>
              </div>

              {/* Address */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Address
                </label>
                <input
                  type="text"
                  name={name ? `${name}.address` : 'address'}
                  placeholder="Enter address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={formik.handleChange}
                  value={values.address}
                />
              </div>

              {/* Joining Date */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    name={name ? `${name}.joining_date` : 'joining_date'}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={formik.handleChange}
                    value={values.joining_date}
                  />
                </div>

                {/* Gender */}
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Select Gender
                  </label>
                  <select
                    name={name ? `${name}.gender` : 'gender'}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={formik.handleChange}
                    value={values.gender}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors?.gender ? (
                    <div className="text-red-500">{errors.gender}</div>
                  ) : null}
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {/* Gender */}
                <div className="w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Select Blood Group
                  </label>
                  <select
                    name={name ? `${name}.blood_group` : 'blood_group'}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={formik.handleChange}
                    value={values.blood_group}
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors?.blood_group ? (
                    <div className="text-red-500">{errors.blood_group}</div>
                  ) : null}
                </div>
                {!staff && (
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Profession
                    </label>
                    <input
                      type="text"
                      name={name ? `${name}.profession` : 'profession'}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={formik.handleChange}
                      value={values.profession}
                    />
                  </div>
                )}
              </div>
              {staff ? (
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div
                    className={`w-full ${
                      values.type && values.type !== 'other' && 'xl:w-1/2'
                    }`}
                  >
                    <label className="mb-2.5 block text-black dark:text-white">
                      Type
                    </label>
                    <select
                      name={name ? `${name}.type` : 'type'}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={formik.handleChange}
                      value={values.type}
                    >
                      <option value="">Select Type</option>
                      <option value="trainer">Trainer</option>
                      <option value="nutritionist">Nutritionist</option>
                      <option value="other">Other</option>
                    </select>
                    {errors?.type ? (
                      <div className="text-red-500">{errors.type}</div>
                    ) : null}
                  </div>
                  {values.type && values.type !== 'other' ? (
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Training Fee
                      </label>
                      <input
                        type="number"
                        name={name ? `${name}.fee` : 'fee'}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        onChange={formik.handleChange}
                        value={values.fee}
                      />
                      {errors?.fee ? (
                        <div className="text-red-500">{errors.fee}</div>
                      ) : null}
                    </div>
                  ) : (
                    values.type === 'other' && (
                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Role
                        </label>
                        <input
                          type="text"
                          name={name ? `${name}.role` : 'role'}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          onChange={formik.handleChange}
                          value={values.role}
                        />
                        {errors?.role ? (
                          <div className="text-red-500">{errors.role}</div>
                        ) : null}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  {/* Gender */}
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Discovery Method
                    </label>
                    <select
                      name={
                        name ? `${name}.discovery_method` : 'discovery_method'
                      }
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={formik.handleChange}
                      value={values.discovery_method}
                    >
                      <option value="">Select discovery method</option>
                      <option value="social media">Social Media</option>
                      <option value="referral">Referral</option>
                      <option value="advertisement">Advertisement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              )}
              {/* Submit */}
              {!isSubForm && (
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="flex w-50 justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-95"
                  >
                    {isEditing
                      ? `Update ${staff ? 'Staff' : ''} Member`
                      : `Add ${staff ? 'Staff' : ''} Member`}
                  </button>
                </div>
              )}
            </div>
          </Wrapper>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
