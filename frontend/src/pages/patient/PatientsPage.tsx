import { patients } from "../../data/patients";

export default function PatientsPage() {
  return (
    <div>
      <h1>Patients</h1>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Blood Group</th>
            <th>Phone</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.firstName} {patient.lastName}</td>
              <td>{patient.age}</td>
              <td>{patient.bloodGroup}</td>
              <td>{patient.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}