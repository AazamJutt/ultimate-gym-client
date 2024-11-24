export interface Invoice {
  membership_id: number | null;
  invoice_date: string;
  training_fee: number;
  personal_fee: number;
  locker_fee: number;
  locker_number: string;
  registration_fee: number;
  client_id: string;
  package_id: number;
  reciever_name: string;
  package_name: string;
  reciever_id: string;
  trainer_id: number | null;
  nutritionist_id: number | null;
  payment_type: 'cash' | 'credit card' | 'debit card';
  due_date: string;
}
