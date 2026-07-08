import { Patient } from "../types/patient";

export const patients: Patient[] = [
  {
    id: "P001",

    firstName: "Ved",

    lastName: "Khajone",

    age: 21,

    gender: "Male",

    bloodGroup: "O+",

    phone: "9876543210",

    email: "ved@example.com",

    address: "Ahmednagar",

    emergencyContact: "9876543211",

    allergies: ["Dust"],

    medicalHistory: ["Diabetes"],

    createdAt: new Date(),
  },
];