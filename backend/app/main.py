from fastapi import FastAPI

app = FastAPI(
    title="MediVerse AI API",
    version="1.0.0"
)

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