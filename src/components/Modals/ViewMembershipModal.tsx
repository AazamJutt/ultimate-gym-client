import moment from 'moment';
import {
  FaIdCard
} from 'react-icons/fa';
import defaultImage from '../../images/user/user-03.png';

interface Membership {
  id: number;
  client_id: number;
  client_name: string;
  client_phone: string;
  package_name: string;
  trainer_name: string;
  nutritionist_name: string;
  training_fee: number;
  personal_fee: number;
  fee_date: string;
  gender: string; 
  address: string;
  joining_date: string;
  cnic: string;
  locker_number: string;
  blood_group: string;
  client_image: string; 
}

interface Props {
  membership: Partial<Membership> | null;
  onClose: () => void;
  isOpen: boolean;
}

const ViewMembershipModal = ({ isOpen, onClose, membership }: Props) => {
  if (!isOpen || !membership) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-strokedark p-6 rounded-lg shadow-xl text-black dark:text-white max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Membership Details
        </h2>

        <div className="flex items-center mb-4">
          <img
            src={
              membership.client_image
                ? membership.client_image
                : defaultImage
            }
            alt="Client"
            className="w-32 h-32 rounded-lg object-contain"
          />
          <div className="ml-4">
            <p className="text-gray-800 font-medium">
              {membership.client_name}
            </p>
            <p className="text-gray-600">{membership.client_phone}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">
            <strong className="text-gray-800">Joining Date:</strong>{' '}
            {moment(membership.joining_date).format('YYYY-MM-DD')}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">CNIC:</strong> {membership.cnic}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">Locker Number:</strong>{' '}
            {membership?.locker_number || 'N/A'}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">Blood Group:</strong>{' '}
            {membership?.blood_group || 'N/A'}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">Package:</strong>{' '}
            {membership.package_name}
          </p>
          {membership.id ? (
            <>
              <p className="text-gray-600">
                <strong className="text-gray-800">Personal Fee:</strong> PKR{' '}
                {membership.personal_fee}
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-800">Training Fee:</strong>{' '}
                {membership?.training_fee ? `PKR ${membership.training_fee}` : 'N/A'}
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-800">Locker Fee:</strong>{' '}
                {membership?.locker_fee ? `PKR ${membership.locker_fee}` : 'N/A'}
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-800">Fee Date:</strong>{' '}
                {moment(membership.fee_date).format('YYYY-MM-DD')}
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-800">Trainer:</strong>{' '}
                {membership?.trainer_name || 'N/A'}
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-800">Nutritionist:</strong>{' '}
                {membership?.nutritionist_name || 'N/A'}
              </p>
            </>
          ) : (
            <p className="p-3 text-center border border-blue-500 bg-blue-500 bg-opacity-20 text-blue-500 rounded">
              <strong>This membership has no active details</strong>
              <FaIdCard className="inline-block ml-1" />
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 transition-colors text-white py-2 rounded-lg text-center"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewMembershipModal;
