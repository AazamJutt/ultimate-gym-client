import MemberForm from '../MemberForm';
import { useAddClientMutation } from '../../../services/client.service';
import { toast } from 'react-toastify';
import { Client } from '../../../types/Client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddMember = () => {
  const [addMember] = useAddClientMutation();
  const [newMember, setNewMember] = useState<Partial<Client>>();
  const  navigate = useNavigate();
  const initialValues: Client = {
    name: '',
    phone: '',
    secondary_phone: '',
    gender: '',
    cnic: '',
    joining_date: '',
    address: '',
    locker_number: undefined,
    blood_group: '',
    dob: '',
    profession: '',
    discovery_method: '',
    image: '', // Default empty image
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
      const response = await addMember(formData);
      console.log(response);
      if (response?.data && response?.data?.data)
        setNewMember(response.data.data);
      if (!response.error) {
        toast.success('Member added successfully')
        navigate(`/members/all`)
      } else toast.error('Could not add member');;
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error('Failed to add member:', error.message);
    }
  };

  return <MemberForm initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default AddMember;
