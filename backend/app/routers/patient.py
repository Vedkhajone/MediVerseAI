from fastapi import APIRouter

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
    }
]


@router.get("/")
def get_patients():
    return patients