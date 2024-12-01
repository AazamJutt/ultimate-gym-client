import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import defaultImage from '../../images/user/user-03.png';
import { useGetClientByIdQuery } from '../../services/client.service';
import {
  useGetMembershipByIdQuery,
  useUpdateMembershipMutation,
} from '../../services/membership.service';
import { Membership } from '../../types/Membership';
import MembershipForm from './MembershipForm';

const EditMembership = () => {
  const { membership_id } = useParams<{ membership_id: string }>();
  const [updateMembership] = useUpdateMembershipMutation();

  const { data, isLoading, refetch } = useGetMembershipByIdQuery(
    String(membership_id),
    {
      skip: !membership_id,
    },
  );

  const membership = data?.data;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: memberData, refetch: refetchMember } = useGetClientByIdQuery(
    membership?.client_id,
    {
      skip: !membership_id || !membership,
    },
  );

  const member = memberData?.data;
  // When the ID changes, force the query to refetch
  useEffect(() => {
    if (membership_id) {
      refetch();
    }
  }, [membership_id]);

  useEffect(() => {
    if (membership) {
      refetchMember();
    }
  }, [membership]);

  if (isLoading) return <div>Loading...</div>;
  else if (!membership) return <div>Client not found</div>;
  const handleSubmit = async (values: Membership) => {
    try {
      if (!membership_id) return;
      const response = await updateMembership({
        id: membership_id,
        membershipData: values,
      });

      if (!response.error) {
        toast.success('Membership updated successfully');
        navigate(`/memberships/all`);
      } else toast.error(response?.data?.message || 'Could not update Membership');
    } catch (error) {
      console.error('Failed to update Membership:', error);
      toast.error(error?.data?.message || 'Failed to update Membership');
    }
  };
  return (
    <>
      <div className="bg-white dark:bg-meta-4 border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Client Details
        </h3>
      </div>
      <div className="bg-white dark:bg-meta-4 p-6 rounded-lg shadow-lg flex items-center gap-6">
        {/* Display member image */}
        <img
          className="h-32 w-32 object-cover rounded-xl border-2 border-gray-300"
          src={
            member?.image
              ? member.image
              : defaultImage
          }
          alt="User"
        />

        {/* Member details */}
        <div className="text-gray-700 dark:text-white">
          <div className="flex items-center gap-4 mb-2">
            <p className="font-semibold">Member Id:</p>
            <p>{member?.client_id}</p>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <p className="font-semibold">Name:</p>
            <p>{member?.name}</p>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <p className="font-semibold">Phone:</p>
            <p>{member?.phone}</p>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <p className="font-semibold">CNIC:</p>
            <p>{member?.cnic || 'N/A'}</p>
          </div>
        <button type="button" className="text-primary">
          <Link
            className="hover:underline"
            to={`/members/${membership.client_id}/edit`}
          >
            Edit Member Details
          </Link>
        </button>
        </div>
      </div>

      {membership && (
        <MembershipForm
          enableReinitialize
          onSubmit={handleSubmit}
          initialValues={membership}
          isEditing
        />
      )}
    </>
  );
};

export default EditMembership;
