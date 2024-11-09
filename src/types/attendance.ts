export type Attendance = {
  id?: number; // Primary Key
  member_id: number; // Foreign Key to the respective Staff or Member model
  date: string; // Date of attendance
  checkin_at?: string; // Time the person checked in
  checkout_at?: string; // Time the person checked out
  status?: 'present' | 'absent' | 'late'; // Optional status
};
