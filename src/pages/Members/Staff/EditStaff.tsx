import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
} from '../../../services/staff.service';
import { Client } from '../../../types/Client';
import MemberForm from '../MemberForm';

const EditStaff = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, refetch } = useGetStaffByIdQuery(String(id), {
    skip: !id,
  });

  const member = data?.data;
  const [updateStaff] = useUpdateStaffMutation();

  // When the ID changes, force the query to refetch
  useEffect(() => {
    if (id) {
      refetch(); // Manually refetch to ensure the latest data is fetched
    }
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  else if (!member) return <div>Client not found</div>;

  const handleSubmit = async (values: Client, image: File | undefined) => {
    if (!id) return;
    const formData: any = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value),
    );

    if (image) formData.append('image', image);
    else if (image === null) formData.append('image', null);

    try {
      const response = await updateStaff({ id, staffData: formData });
      if (!response.error) {
        toast.success('Staff Member edited successfully')
        // navigate(`/staff/all`)
      } else toast.error('Could not edit staff  member');
    } catch (error) {
      console.error('Failed to update staff member:', error);
    }
  };

  return (
    <MemberForm
      initialValues={member}
      onSubmit={handleSubmit}
      isEditing
      enableReinitialize
      staff
    />
  );
};

export default EditStaff;
