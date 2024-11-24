export interface Membership {
  id: number;
  status: "active" | "inactive";
  fee_date: string;
  client_id: string;
  package_id: number;
  package_name: string;
  trainer_id?: number | null;
  nutritionist_id?: number | null;
  training_fee: number;
  personal_fee: number;
  locker_fee: number;
  locker_number: string;
  registration_fee: number;
  invoice?: string;
  attendance: string;
  member_id: string;
}
