from fastapi import APIRouter # type: ignore
from app.schemas.patient import PatientCreate
router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)

patients = [
    {
        "id": 1,
        "name": "Ved Khajone",
        "age": 21,
        "blood_group": "O+"
    },
    {
        "id": 2,
        "name": "Rahul Sharma",
        "age": 24,
        "blood_group": "A+"
    },
    {
        "id": 3,
        "name": "Jadyaaaa",
        "age": 1000,
        "blood_group": "z-"
    }
]


@router.get("/{patient_id}")
def get_patient(patient_id: int):
    for patient in patients:
        if patient["id"] == patient_id:
            return patient

    return {
        "error": "Patient not found"
    }
@router.post("/")
def create_patient(patient: PatientCreate):

    new_patient = {
        "id": len(patients) + 1,
        "name": patient.name,
        "age": patient.age,
        "blood_group": patient.blood_group,
    }

    patients.append(new_patient)

    return {
        "message": "Patient created successfully",
        "patient": new_patient,
    }