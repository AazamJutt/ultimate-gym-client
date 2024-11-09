import moment from 'moment';
import {
  FaUser,
  FaPhone,
  FaDollarSign,
  FaCalendarAlt,
  FaIdCard,
  FaAddressCard,
} from 'react-icons/fa';
import { Client } from '../../types/Client';
import { IoMaleFemaleSharp } from 'react-icons/io5';
import { Staff } from '../../types/staff';

interface Props {
  member: Partial<Client> | Partial<Staff> | null;
  onClose: () => void;
  isOpen: boolean;
}
const ViewMemberModal = ({ isOpen, onClose, member }: Props) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-strokedark p-8 rounded-lg shadow-xl text-black dark:text-white max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Member Details
        </h2>

        <div className="space-y-4">
          <p className="text-gray-600">
            <strong className="text-gray-800">
              <FaAddressCard className="inline-block ml-1" /> Member ID:
            </strong>{' '}
            {(member as Client)?.client_id || (member as Staff)?.staff_id}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">
              {' '}
              <FaUser className="inline-block ml-1" /> Name:
            </strong>{' '}
            {member.name}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">
              {' '}
              <FaPhone className="inline-block ml-1" /> Phone:
            </strong>{' '}
            {member.phone}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">
              <IoMaleFemaleSharp className="inline-block ml-1" /> Gender:
            </strong>{' '}
            {member.gender}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">
              <FaCalendarAlt className="inline-block ml-1" /> Joining Date:
            </strong>{' '}
            {moment(member.joining_date).format('YYYY-MM-DD')}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">
              <FaIdCard className="inline-block ml-1" /> CNIC:
            </strong>{' '}
            {member.cnic}
          </p>

          <p className="text-gray-600">
            <strong className="text-gray-800">
              {' '}
              <FaDollarSign className="inline-block ml-1" /> Personal Fee:
            </strong>{' '}
            PKR {member.personal_fee}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">
              <FaDollarSign className="inline-block ml-1" /> Training Fee:
            </strong>{' '}
            PKR {member.training_fee}{' '}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">
              {' '}
              <FaCalendarAlt className="inline-block ml-1" /> Fee Date:
            </strong>{' '}
            {moment(member.fee_date).format('YYYY-MM-DD')}{' '}
          </p>
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

export default ViewMemberModal;
