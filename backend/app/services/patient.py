from sqlalchemy.orm import Session
from app.models.patient import Patient
from app.schemas.patient import PatientCreate
from typing import List, Optional

def get_all_patients(db: Session) -> List[Patient]:
    return db.query(Patient).all()

def get_patient_by_id(db: Session, patient_id: int) -> Optional[Patient]:
    return db.query(Patient).filter(Patient.id == patient_id).first()

def create_patient(db: Session, patient_data: PatientCreate) -> Patient:
    db_patient = Patient(
        name=patient_data.name,
        age=patient_data.age,
        blood_group=patient_data.blood_group
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient
