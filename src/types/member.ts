import { Staff } from "./staff";

export type Member = {
    id: number;
    name: string;
    phone: string;
    gender: string;
    personalfee: number;
    trainingfee: number;
    joiningdate: string;
    feeDate: string;
    cnic?: string;
    address?: string;
    height?: number;
    lockernumber?: string;
    referencenumber?: string;
    trainer?: Staff;
    nutritionist?: string;
    bloodgroup?: string;
    profession?: string;
    howdidyouhear?: string;
    dob?: string;
    bodyweight?: number;
    secondaryphone?: string;
    image?: string;
}