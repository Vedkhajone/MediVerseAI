
from pydantic import BaseModel

class PatientCreate(BaseModel):
    name: str
    age: int
    blood_group: str