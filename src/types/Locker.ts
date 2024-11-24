export interface Locker {
  id: number;
  locker_number: string;
  is_assigned: boolean;
  member_id: number;
  created_at?: Date;
  updated_at?: Date;
  assigned_at?: Date;
}