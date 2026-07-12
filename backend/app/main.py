from fastapi import FastAPI
from fastapi import FastAPI
from app.routers.patient import router as patient_router

app = FastAPI(
    title="MediVerse AI API",
    version="1.0.0"
)
app.include_router(patient_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to MediVerse AI Backend"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }