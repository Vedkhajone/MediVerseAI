const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface Patient {
  id: number;
  name: string;
  age: number;
  blood_group: string;
}

export interface PatientCreate {
  name: string;
  age: number;
  blood_group: string;
}

export async function getPatients(): Promise<Patient[]> {
  try {
    const response = await fetch(`${API_URL}/patients/`);
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`Failed to fetch patients (Status: ${response.status}): ${errorText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("API Error in getPatients:", error);
    throw error;
  }
}

export async function createPatient(patient: PatientCreate): Promise<{ message: string; patient: Patient }> {
  try {
    const response = await fetch(`${API_URL}/patients/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patient),
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`Failed to create patient (Status: ${response.status}): ${errorText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("API Error in createPatient:", error);
    throw error;
  }
}
