export type Staff = {
  id?: number; // Primary Key
  staff_id?: number; // Primary Key
  name: string;
  image: string;
  phone: string;
  gender: string;
  cnic?: string;
  address?: string;
  dob?: string;
  fee: number;
  type: 'trainer' | 'nutritionist' | 'other';
  member_id?: number;
  personal_fee?: number;
  training_fee?: number;
  joining_date: string;
  fee_date?: string;
  locker_number?: string;
  trainer?: Staff;
  nutritionist?: string;
  blood_group?: string;
  profession?: string;
  discovery_method?: string;
  bodyweight?: number;
  secondary_phone?: string;
  status?: string;
  role: string;
  attendance: string;
};
