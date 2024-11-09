import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetClientByIdQuery,
  useUpdateClientMutation,
} from '../../../services/client.service';
import { Client } from '../../../types/Client';
import MemberForm from '../MemberForm';
import { useEffect, useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

const EditMember = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, refetch } = useGetClientByIdQuery(String(id), {
    skip: !id,
  });

  const member = data?.data;
  const [updateMember] = useUpdateClientMutation();

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
    if(image)
      formData.append('image', image);
    else if (image === null) formData.append('image', null);
    try {
      const memberPromise = updateMember({ id, clientData: formData });
      toast.promise(memberPromise, {
        pending: 'Updating Member...',
        success: 'Member updated successfully',
        error: 'Failed to update member',
      });
    } catch (error) {
      console.error('Failed to update member:', error);
    }
  };

  return (
    <>
      <Breadcrumb backButton pageName="Edit Member" />
      <MemberForm
        initialValues={member}
        onSubmit={handleSubmit}
        isEditing
        enableReinitialize
      />
    </>
  );
};

export default EditMember;
