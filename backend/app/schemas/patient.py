
from pydantic import BaseModel, ConfigDict

class PatientCreate(BaseModel):
    name: str
    age: int
    blood_group: str

class PatientResponse(BaseModel):
    id: int
    name: str
    age: int
    blood_group: str

    model_config = ConfigDict(from_attributes=True)