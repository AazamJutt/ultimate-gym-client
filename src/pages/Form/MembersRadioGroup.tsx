import { Client } from '../../types/Client';

interface Props {
  members: Client[];
  name: string;
  value: string;
  onChange: any;
}

const MemberRadioGroup = ({ members, name, value, onChange }: Props) => {
  console.log(value);
  return (
    <div className="space-y-4">
      {members?.map((member) => (
        <label
          key={member.id}
          className={`flex items-center p-3 border rounded-lg cursor-pointer ${
            value === member.client_id
              ? 'border-blue-500 bg-blue-100'
              : 'border-gray-300'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={member.client_id}
            // checked={true}
            onChange={onChange}
            className="mr-4"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{member.name}</span>
            <span className="text-gray-600">Phone: {member.phone}</span>
            <span className="text-gray-600">CNIC: {member.cnic}</span>
          </div>
        </label>
      ))}
    </div>
  );
};

export default MemberRadioGroup;
