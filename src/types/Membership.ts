export interface Membership {
  id: string;
  status: "active" | "inactive";
  fee_date: string;
  client_id: string;
  package_id: number | null;
  package_name: string;
  trainer_id?: number | null;
  nutritionist_id?: number | null;
  training_fee: number;
  personal_fee: number;
  invoice?: string;
  attendance: string;
  member_id: string;
}
