import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAddMembershipMutation } from '../../services/membership.service';
import { Membership } from '../../types/Membership';
import MembershipTransactionForm from './MembershipTransactionForm';

const AddMembership = () => {
  // const { client_id } = useParams<{ client_id: string }>();
  const [addMembership] = useAddMembershipMutation();

  // const { data, isLoading, refetch } = useGetClientByIdQuery(
  //   String(client_id),
  //   {
  //     skip: !client_id,
  //   },
  // );
  // const member = data?.data;
  const navigate = useNavigate();
  // // When the ID changes, force the query to refetch
  // useEffect(() => {
  //   if (client_id) {
  //     refetch(); // Manually refetch to ensure the latest data is fetched
  //   }
  // }, [client_id]);

  // if (isLoading) return <div>Loading...</div>;
  // else if (!member) return <div>Client not found</div>;
  const handleSubmit = async (values: Membership) => {
    try {
      const response = await addMembership(values);
      if (!response.error) {
        toast.success('Membership added successfully');
        navigate(`/members/all`);
      } else toast.error(response?.data?.message || 'Could not add member');
    } catch (error) {
      console.error('Failed to add Membership:', error);
      toast.error(error?.data?.message || 'Failed to add Membership');
    }
  };
  return <MembershipTransactionForm  />;
};

export default AddMembership;
