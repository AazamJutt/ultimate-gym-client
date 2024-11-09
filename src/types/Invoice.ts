export interface Invoice {
  membership_id: string;
  invoice_date: string;
  training_fee: number;
  personal_fee: number;
  client_id: string;                                                                        
  package_id: string;                                                                        
  reciever_name: string;
  reciever_phone: string;
  package_name: string;
  reciever_id: string;                                                                        
  trainer_id: string | null;
  nutritionist_id: string | null;
  payment_type: 'cash' | 'credit card' | 'debit card';
  due_date: string;
}
