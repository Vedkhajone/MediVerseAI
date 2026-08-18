# 🌐 API Specification

This document specifies the HTTP API interface for the **MediVerse AI** backend service.

---

## 1. CURRENT Endpoints

These endpoints are fully implemented and running in [backend/app/main.py](file:///c:/MediVerseAI/backend/app/main.py) and [backend/app/routers/patient.py](file:///c:/MediVerseAI/backend/app/routers/patient.py).

### System & Health

#### `GET /`
Returns a general welcome message.
- **Response (200 OK):**
  ```json
  {
    "message": "Welcome to MediVerse AI Backend"
  }
  ```

#### `GET /health`
Returns backend health status.
- **Response (200 OK):**
  ```json
  {
    "status": "healthy"
  }
  ```

---

### Patient Management (`/patients`)

#### `GET /patients/{patient_id}`
Retrieves a specific patient record by integer ID (looks up from temporary in-memory list).
- **Path Parameters:**
  - `patient_id` (integer)
- **Response (200 OK - Found):**
  ```json
  {
    "id": 1,
    "name": "Ved Khajone",
    "age": 21,
    "blood_group": "O+"
  }
  ```
- **Response (200 OK - Not Found):**
  ```json
  {
    "error": "Patient not found"
  }
  ```

#### `POST /patients/`
Creates a new patient record and appends it to the in-memory array.
- **Request Body (Application/JSON):**
  ```json
  {
    "name": "Jane Doe",
    "age": 30,
    "blood_group": "AB-"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Patient created successfully",
    "patient": {
      "id": 4,
      "name": "Jane Doe",
      "age": 30,
      "blood_group": "AB-"
    }
  }
  ```

---

## 2. PLANNED Endpoints

These endpoints are required by the frontend interface (mapped to Supabase stubs today) and will be implemented in subsequent phases.

### Authentication & Profiles
- `POST /auth/register` — Create user credential profile
- `POST /auth/login` — Authenticate and return JWT token
- `POST /auth/logout` — Revoke active token session
- `GET /profiles/me` — Retrieve active profile session details

### Clinical & Appointments
- `GET /appointments` — List active patient/doctor bookings
- `POST /appointments` — Schedule a new appointment slot
- `PATCH /appointments/{id}` — Modify/cancel appointment status
- `GET /medications` — Retrieve user's active prescriptions and schedules
- `POST /medications` — Add medication dosage plan

### Diagnostic ML predictions
- `POST /predictions/diabetes` — Submit survey variables to retrieve diabetes likelihood
- `POST /predictions/heart` — Run cardiac risk calculation
- `POST /predictions/brain-tumor` — Upload brain MRI scan and classification request