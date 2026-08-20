from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.patient import router as patient_router
from app.database.database import engine, Base
from app.models.patient import Patient

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediVerse AI API",
    version="1.0.0"
)

# Enable CORS for local development frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
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