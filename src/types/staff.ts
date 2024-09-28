export type Staff = {
    id: number;               // Primary Key
    name: string;
    image: string;
    joiningdate: string;
    phone: string;
    gender: string;
    cnic?: string;
    address?: string;
    height?: number;
    lockernumber?: string;
    referencenumber?: string;
    is_trainer: boolean;      // True if the staff is a trainer
    is_nutritionist: boolean; // True if the staff is a nutritionist
    dob?: string;
    bodyweight?: number;
    secondaryphone?: string;
};
