import { useEffect, useState } from 'react';
import UserOne from '../../images/user/user-01.png';
import { Member } from '../../types/member';

const membersData: Member[] = [
  {
    id: 1,
    name: 'James Colby',
    phone: '1234567890',
    gender: 'Male',
    personalfee: 100,
    trainingfee: 200,
    joiningdate: '2022-01-01',
    feeDate: '2022-01-01',
    cnic: '1234567890',
  },
  {
    id: 2,
    name: 'Patricia Smith',
    phone: '1234567890',
    gender: 'Female',
    personalfee: 100,
    trainingfee: 200,
    joiningdate: '2022-01-01',
    feeDate: '2022-01-01',
    cnic: '1234567890',
  },
  {
    id: 3,
    name: 'John doe',
    phone: '1234567890',
    gender: 'Male',
    personalfee: 100,
    trainingfee: 200,
    joiningdate: '2022-01-01',
    feeDate: '2022-01-01',
    cnic: '1234567890',
  },
  {
    id: 4,
    name: 'Kamala Harris',
    phone: '1234567890',
    gender: 'Female',
    personalfee: 100,
    trainingfee: 200,
    joiningdate: '2022-01-01',
    feeDate: '2022-01-01',
    cnic: '1234567890',
  },
  {
    id: 5,
    name: 'Michael Scott',
    phone: '1234567890',
    gender: 'Male',
    personalfee: 100,
    trainingfee: 200,
    joiningdate: '2022-01-01',
    feeDate: '2022-01-01',
    cnic: '1234567890',
  },
  {
    id: 6,
    name: 'Emma Watson',
    phone: '1234567890',
    gender: 'Female',
    personalfee: 100,
    trainingfee: 200,
    joiningdate: '2022-01-01',
    feeDate: '2022-01-01',
    cnic: '1234567890',
  },
  {
    id: 7,
    name: 'Chris Evans',
    phone: '1234567890',
    gender: 'Male',
    personalfee: 100,
    trainingfee: 200,
    joiningdate: '2022-01-01',
    feeDate: '2022-01-01',
    cnic: '1234567890',
  },
];

const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-10 rounded-sm h-full animate-pulse">
      <div className="p-2.5 xl:p-5">
        <div className="w-12 h-4 bg-slate-300 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="p-2.5 flex items-center gap-4 xl:p-5 col-span-2">
        <div className="h-12 w-12 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        <div className="w-32 h-4 bg-slate-300 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="p-2.5 text-center xl:p-5">
        <div className="w-24 h-4 bg-slate-300 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="hidden p-2.5 text-center sm:block xl:p-5">
        <div className="w-20 h-4 bg-slate-300 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="hidden p-2.5 text-center sm:block xl:p-5">
        <div className="w-20 h-4 bg-slate-300 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="hidden p-2.5 text-center sm:block xl:p-5">
        <div className="w-20 h-4 bg-slate-300 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="hidden p-2.5 text-center sm:block xl:p-5">
        <div className="w-20 h-4 bg-slate-300 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="hidden p-2.5 text-center sm:block xl:p-5">
        <div className="w-20 h-4 bg-slate-300 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="hidden p-2.5 text-center sm:block xl:p-5">
        <div className="w-20 h-4 bg-slate-300 dark:bg-slate-700 rounded"></div>
      </div>
    </div>
  );
};

const MemberTable = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  return (
    <div className="rounded-sm max-h-[80vh] overflow-y-auto border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-col">
        <div className="grid grid-cols-2 sm:grid-cols-10 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <p className="hidden text-black dark:text-white sm:block">Id</p>
          </div>
          <div className="p-2.5 flex items-center xl:p-5 col-span-2">
            <p className="text-black dark:text-white">Name</p>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <p className="hidden text-black dark:text-white sm:block">Phone</p>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <p className="hidden text-black dark:text-white sm:block">Gender</p>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <p className="hidden text-black dark:text-white sm:block">
              Personal Fee
            </p>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <p className="hidden text-black dark:text-white sm:block">
              Training Fee
            </p>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <p className="hidden text-black dark:text-white sm:block">
              Joining Date
            </p>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <p className="hidden text-black dark:text-white sm:block">
              Fee Date
            </p>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <p className="hidden text-black dark:text-white sm:block">Cnic</p>
          </div>
        </div>
        {loading ? (
          <>
            {/* Render skeleton loaders */}
            {Array(8)
              .fill(0)
              .map((_, idx) => (
                <SkeletonLoader key={idx} />
              ))}
          </>
        ) : (
          <>
            {membersData.map((member) => (
              <div className="grid grid-cols-2 sm:grid-cols-10 rounded-sm h-full">
                <div className="p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{member.id}</p>
                </div>
                <div className="p-2.5 flex items-center gap-4 xl:p-5 col-span-2">
                  {/* Add the circle image before the name */}
                  <span className="h-12 w-12 rounded-full">
                    <img src={UserOne} alt="User" />
                  </span>
                  <p className="text-black dark:text-white">{member.name}</p>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <p className="text-black dark:text-white">{member.phone}</p>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <p className="text-black dark:text-white">{member.gender}</p>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <p className="text-black dark:text-white">
                    ${member.personalfee}
                  </p>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <p className="text-black dark:text-white">
                    ${member.trainingfee}
                  </p>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <p className="text-black dark:text-white">
                    {member.joiningdate}
                  </p>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <p className="text-black dark:text-white">{member.feeDate}</p>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <p className="text-black dark:text-white">{member.cnic}</p>
                </div>
              </div>
            ))}
            {membersData.map((member) => (
              <div className="grid grid-cols-2 sm:grid-cols-10 rounded-sm h-full">
                <div className="p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{member.id}</p>
                </div>
                <div className="p-2.5 flex items-center gap-4 xl:p-5 col-span-2">
                  {/* Add the circle image before the name */}
                  <span className="h-12 w-12 rounded-full">
                    <img src={UserOne} alt="User" />
                  </span>
                  <p className="text-black dark:text-white">{member.name}</p>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <p className="text-black dark:text-white">{member.phone}</p>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <p className="text-black dark:text-white">{member.gender}</p>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <p className="text-black dark:text-white">
                    ${member.personalfee}
                  </p>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <p className="text-black dark:text-white">
                    ${member.trainingfee}
                  </p>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <p className="text-black dark:text-white">
                    {member.joiningdate}
                  </p>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <p className="text-black dark:text-white">{member.feeDate}</p>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <p className="text-black dark:text-white">{member.cnic}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MemberTable;
