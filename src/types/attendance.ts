export type Attendance = {
    id: number;               // Primary Key
    person_id: number;        // Foreign Key to the respective Staff or Member model
    attendance_date: string;  // Date of attendance
    checkin_time?: string;    // Time the person checked in
    checkout_time?: string;   // Time the person checked out
    status?: 'Present' | 'Absent' | 'Late';  // Optional status
    comments?: string;
};
