import type { Patient } from "../types/patient";

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
  {
  id: "P002",
  firstName: "Rahul",
  lastName: "Sharma",
  age: 24,
  gender: "Male",
  bloodGroup: "A+",
  phone: "9988776655",
  email: "rahul@example.com",
  address: "Pune",
  emergencyContact: "9988776656",
  allergies: [],
  medicalHistory: [],
  createdAt: new Date(),
},
];
