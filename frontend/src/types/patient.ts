export interface Patient {
  id: string;

  firstName: string;

  lastName: string;

  age: number;

  gender: "Male" | "Female" | "Other";

  bloodGroup: string;

  phone: string;

  email: string;

  address: string;

  emergencyContact: string;

  allergies: string[];

  medicalHistory: string[];

  createdAt: Date;
}