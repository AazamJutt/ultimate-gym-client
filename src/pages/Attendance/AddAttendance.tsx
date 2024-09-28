import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const AddAttendance = () => {
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
    };

    return (
        <>
            <Breadcrumb pageName="Add Attendance" />

            <div className="grid grid-cols-1 justify-center">
                <div className="flex flex-col gap-9">
                    {/* <!-- Attendance Form --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Attendance Form
                            </h3>
                        </div>
                        <form action="#">
                            <div className="p-6.5">

                                {/* Select Person */}
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Select Person
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter name or ID"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                    />
                                </div>

                                {/* Attendance Date */}
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Attendance Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                    />
                                </div>

                                {/* Check-in Time */}
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Check-in Time
                                    </label>
                                    <input
                                        type="time"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                    />
                                </div>

                                {/* Check-out Time */}
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Check-out Time
                                    </label>
                                    <input
                                        type="time"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                    />
                                </div>

                                {/* Attendance Status */}
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Status
                                    </label>
                                    <div className="flex gap-4">
                                        {/* Present Card */}
                                        <div
                                            className={`cursor-pointer flex-1 rounded p-4 border-[1.5px] text-center ${selectedStatus === 'Present'
                                                    ? 'bg-primary text-white'
                                                    : 'border-stroke bg-transparent text-black dark:border-form-strokedark dark:text-white'
                                                }`}
                                            onClick={() => handleStatusChange('Present')}
                                        >
                                            Present
                                        </div>

                                        {/* Absent Card */}
                                        <div
                                            className={`cursor-pointer flex-1 rounded p-4 border-[1.5px] text-center ${selectedStatus === 'Absent'
                                                    ? 'bg-primary text-white'
                                                    : 'border-stroke bg-transparent text-black dark:border-form-strokedark dark:text-white'
                                                }`}
                                            onClick={() => handleStatusChange('Absent')}
                                        >
                                            Absent
                                        </div>

                                        {/* Late Card */}
                                        <div
                                            className={`cursor-pointer flex-1 rounded p-4 border-[1.5px] text-center ${selectedStatus === 'Late'
                                                    ? 'bg-primary text-white'
                                                    : 'border-stroke bg-transparent text-black dark:border-form-strokedark dark:text-white'
                                                }`}
                                            onClick={() => handleStatusChange('Late')}
                                        >
                                            Late
                                        </div>
                                    </div>
                                </div>

                                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                                    Add Attendance
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddAttendance;
