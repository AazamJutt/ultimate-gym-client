import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAddStaffMutation } from '../../../services/staff.service';
import { Client } from '../../../types/Client';
import { Staff } from '../../../types/staff';
import MemberForm from '../MemberForm';

const AddStaff = () => {
  const [addStaff] = useAddStaffMutation();
  const [newMember, setNewMember] = useState<Partial<Staff>>();
  const navigate = useNavigate();
  const initialValues: Staff = {
    name: '',
    phone: '',
    secondary_phone: '',
    gender: '',
    cnic: '',
    joining_date: '',
    address: '',
    locker_number: '',
    blood_group: '',
    dob: '',
    fee: 0,
    type: '',
    image: '',
    role: '',
  };

  const handleSubmit = async (values: Client, image: File | undefined) => {
    const formData: any = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value),
    );

    if (image) {
      formData.append('image', image);
    }
    else if (image === null) formData.append('image', null);
    try {
      const response: any = await addStaff(formData);
      console.log(response);
      if (response?.data && response?.data?.data)
        setNewMember(response.data.data);
      if (!response.error) {
        toast.success('Member added successfully');
        navigate(`/staff/all`);
      } else toast.error('Could not add member');
    } catch (error: any) {
      console.error('Failed to add member:', error);
      toast.error('Failed to add member:', error.message);
    }
  };

  return (
    <MemberForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      staff={true}
      enableReinitialize
    />
  );
};

export default AddStaff;
