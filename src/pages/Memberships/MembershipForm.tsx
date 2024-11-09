import { useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useGetClientsQuery } from '../../services/client.service';
import { useGetPackagesQuery } from '../../services/package.service';
import { useGetStaffsQuery } from '../../services/staff.service';
import { Membership } from '../../types/Membership';
import { Package } from '../../types/Package';

interface MembershipFormProps {
  initialValues?: Membership; // Initial values for editing
  onSubmit?: any;
  isEditing?: boolean;
  enableReinitialize?: boolean;
  clientId?: string;
  name?: string;
  formik?: any;
  isSubForm?: boolean;
  locker_fee?: number;
  registration_fee?: number;
}

const MembershipForm = ({
  initialValues,
  onSubmit,
  isEditing = false,
  enableReinitialize = false,
  clientId,
  name,
  formik,
  isSubForm = false,
  locker_fee,
  registration_fee,
}: MembershipFormProps) => {
  const { data: trainers } = useGetStaffsQuery({
    page: 1,
    pageSize: 1000,
    filter: { type: 'trainer', status: 'active' },
  });
  const { data: nutritionists } = useGetStaffsQuery({
    page: 1,
    pageSize: 1000,
    filter: { type: 'nutritionist', status: 'active' },
  });
  const { data: packages } = useGetPackagesQuery({ status: 'active' });
  const [lockerFee, setLockerFee] = useState(locker_fee);
  useEffect(() => {
    setLockerFee(locker_fee);
  }, [locker_fee]);
  // const [search, setSearch] = useState('');

  // const { data: members } = useGetClientsQuery({
  //   page: 1,
  //   pageSize: 10,
  //   search,
  //   filter: { membership: false },
  // });
  if (!isSubForm) {
    formik = useFormik({
      enableReinitialize,
      initialValues: {
        status: initialValues?.status || 'active',
        fee_date:
          initialValues?.fee_date ||
          moment().add(1, 'month').format('YYYY-MM-DD'),
        client_id: initialValues?.client_id || clientId || '',
        package_id: initialValues?.package_id || null,
        trainer_id: initialValues?.trainer_id || null,
        nutritionist_id: initialValues?.nutritionist_id || null,
        training_fee: initialValues?.training_fee || 0,
        personal_fee: initialValues?.personal_fee || 0,
      },
      validationSchema: Yup.object({
        status: Yup.string(),
        fee_date: Yup.date().required('Fee date is required'),
        client_id: Yup.string().required('Client is required'),
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
      }),
      onSubmit: async (values: Membership) => {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Failed to submit:', error);
        }
      },
    });
  }
  const values = name ? formik.values[name] : formik.values;
  const errors = name ? formik.errors[name] : formik.errors;
  useEffect(() => {
    const selectedPackageId = values.package_id;
    // Assuming you want to set the fee_date based on the selected package
    const selectedPackage: Package = packages?.data?.find(
      (pkg: Package) => pkg.id === Number(selectedPackageId),
    );
    if (!selectedPackage) return;
    // Set the fee_date in formik
    formik.setFieldValue(
      name ? `${name}.fee_date` : 'fee_date',
      moment().add(selectedPackage.period, 'month').format('YYYY-MM-DD'),
    );
    formik.setFieldValue(
      name ? `${name}.personal_fee` : 'personal_fee',
      selectedPackage.price,
    );
    formik.validateForm();
  }, [values.package_id]);

  const handleTrainerChange = (e: any) => {
    const selectedTrainerId = e.target.value;
    formik.handleChange(e);
    // Assuming you want to set the trainer_id in formik
    const selectedTrainer = trainers?.data.find(
      (trainer) => trainer.staff_id === Number(selectedTrainerId),
    );
    let trainingFee = selectedTrainer?.fee || 0;
    if ((name ? formik.values[name] : formik.values).nutritionist_id) {
      const selectedNutritionist = nutritionists?.data.find(
        (nutritiinist) =>
          nutritiinist.staff_id ===
          Number((name ? formik.values[name] : formik.values).nutritionist_id),
      );
      if (selectedNutritionist) trainingFee += selectedNutritionist.fee;
    }
    // Assuming you want to set the trainer_id in formik
    formik.setFieldValue(
      name ? `${name}.training_fee` : 'training_fee',
      trainingFee,
    );
    formik.validateForm();
  };

  const handleNutritionistChange = (e: any) => {
    const selectedNutritiinistId = e.target.value;
    formik.handleChange(e);
    // Assuming you want to set the trainer_id in formik
    const selectedNutritiinist = nutritionists?.data.find(
      (nutritiinist) =>
        nutritiinist.staff_id === Number(selectedNutritiinistId),
    );
    let trainingFee = selectedNutritiinist?.fee || 0;
    if ((name ? formik.values[name] : formik.values).trainer_id) {
      const selectedTrainer = trainers?.data.find(
        (trainer) =>
          trainer.staff_id ===
          Number((name ? formik.values[name] : formik.values).trainer_id),
      );
      if (selectedTrainer) trainingFee += selectedTrainer.fee;
    }
    // Assuming you want to set the trainer_id in formik
    formik.setFieldValue(
      name ? `${name}.training_fee` : 'training_fee',
      trainingFee,
    );
    formik.validateForm();
  };
  let Wrapper = isSubForm ? 'div' : 'form';
  return (
    <>
      <div className="grid grid-cols-1 justify-center mb-3">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {isEditing ? 'Edit Membership' : 'Membership Form'}
              </h3>
            </div>
            <Wrapper onSubmit={onSubmit ? formik.handleSubmit : () => {}}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  {/* Package ID */}
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Packages
                    </label>
                    <select
                      name={name ? `${name}.package_id` : 'package_id'}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={formik.handleChange}
                      value={values.package_id}
                    >
                      <option value="">Select Package</option>
                      {packages?.data?.map((pkg: Package) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name}
                        </option>
                      ))}
                    </select>
                    {errors?.package_id ? (
                      <div className="text-red-500">{errors?.package_id}</div>
                    ) : null}
                  </div>
                  {/* Fee Date */}
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Fee Date
                    </label>
                    <input
                      type="date"
                      name={name ? `${name}.fee_date` : 'fee_date'}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={formik.handleChange}
                      value={values.fee_date}
                    />
                    {errors?.fee_date ? (
                      <div className="text-red-500">{errors.fee_date}</div>
                    ) : null}
                  </div>
                </div>
                {/* Trainer ID */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Trainer
                    </label>
                    <select
                      name={name ? `${name}.trainer_id` : 'trainer_id'}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleTrainerChange}
                      value={values.trainer_id}
                    >
                      <option value="">Select Trainer</option>
                      {trainers?.data?.map((trainer) => (
                        <option key={trainer.id} value={trainer.staff_id}>
                          {trainer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nutritionist ID */}
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nutritionist
                    </label>
                    <select
                      name={
                        name ? `${name}.nutritionist_id` : 'nutritionist_id'
                      }
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleNutritionistChange}
                      value={values.nutritionist_id}
                    >
                      <option value="">Select Nutritionist</option>
                      {nutritionists?.data?.map((nutritionist) => (
                        <option
                          key={nutritionist.id}
                          value={nutritionist.staff_id}
                        >
                          {nutritionist.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  {/* Personal Fee */}
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Membership Fee
                    </label>
                    <input
                      type="number"
                      name={name ? `${name}.personal_fee` : 'personal_fee'}
                      placeholder="Enter membership fee"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={formik.handleChange}
                      value={values.personal_fee}
                    />
                    {errors?.personal_fee ? (
                      <div className="text-red-500">{errors.personal_fee}</div>
                    ) : null}
                  </div>
                  {/* Training Fee */}
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Training Fee
                    </label>
                    <input
                      type="number"
                      name={name ? `${name}.training_fee` : 'training_fee'}
                      placeholder="Enter training fee"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={formik.handleChange}
                      value={values.training_fee}
                    />
                    {errors?.training_fee ? (
                      <div className="text-red-500">{errors.training_fee}</div>
                    ) : null}
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  {/* Personal Fee */}
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Registration Fee
                    </label>
                    <input
                      type="number"
                      placeholder="Enter registration fee"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={registration_fee}
                      disabled
                    />
                    {errors?.personal_fee ? (
                      <div className="text-red-500">{errors.personal_fee}</div>
                    ) : null}
                  </div>
                  {/* Training Fee */}
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Locker Fee
                    </label>
                    <input
                      type="number"
                      disabled
                      placeholder="Enter locker fee"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e) => setLockerFee(Number(e.target.value))}
                      value={lockerFee}
                    />
                    {errors?.training_fee ? (
                      <div className="text-red-500">{errors.training_fee}</div>
                    ) : null}
                  </div>
                </div>
                Total Fee: PKR {values.personal_fee + values.training_fee + registration_fee + lockerFee}/-
                {!isSubForm && (
                  <button
                    type="submit"
                    className="mt-4 w-full rounded bg-primary py-3 text-white"
                  >
                    {isEditing ? 'Update Membership' : 'Add Membership'}
                  </button>
                )}
              </div>
            </Wrapper>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipForm;
