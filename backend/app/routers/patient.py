from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.patient import PatientCreate, PatientResponse
from app.database.database import get_db
from app.services import patient as patient_service

router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


@router.get("/", response_model=List[PatientResponse])
def get_all_patients(db: Session = Depends(get_db)):
    return patient_service.get_all_patients(db)


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = patient_service.get_patient_by_id(db, patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    return patient


@router.post("/", response_model=dict)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    new_patient = patient_service.create_patient(db, patient)
    return {
        "message": "Patient created successfully",
        "patient": PatientResponse.model_validate(new_patient)
    }