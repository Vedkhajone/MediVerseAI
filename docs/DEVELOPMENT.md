# 🛠 Development Guide

This document describes how to setup, run, configure, and develop on **MediVerse AI**.

---

## 1. Setup Instructions

Make sure you have python 3.10+ and Node.js v18+ installed on your computer.

### Frontend Setup
1. Open a terminal and navigate to the frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Backend Setup
1. Open a terminal and navigate to the backend:
   ```bash
   cd backend
   ```
2. Create or verify the virtual environment:
   ```bash
   # Create venv if it doesn't exist
   python -m venv venv
   ```
3. Activate the virtual environment:
   - **Windows PowerShell:**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows Command Prompt:**
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## 2. Running the Application

### Start Frontend Server
From the `frontend` folder:
```bash
npm run dev
```
The server typically runs at `http://localhost:3000` or `http://localhost:5173`. Look at the CLI output to find the exact address.

### Start Backend FastAPI Server
From the `backend` folder, with the virtual environment activated:
```bash
uvicorn app.main:app --reload
```
The backend server runs at `http://localhost:8000`.

---

## 3. Environment Variables

Create a `.env` file in the appropriate folders to store environment-specific configurations.

### Frontend (`frontend/.env`)
The frontend contains Supabase stubs but requires variables to point to the real Supabase project if using Option 1:
```env
VITE_SUPABASE_URL=https://olbqmwozftbfbsszqsxn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_RGDa9PXpa65sGb1p4z-jTA_a5nj62ZH
```
Or point to the FastAPI backend:
```env
VITE_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
Create a `.env` file inside `backend/`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/mediverse
```

---

## 4. API Documentation (Swagger)

FastAPI automatically generates interactive Swagger and ReDoc documentation:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs) (Use this to test endpoints directly).
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc).

---

## 5. Development Workflow Guidelines

1. **Keep Frontend & Backend Independent:** Do not place database or ORM logic directly in the React frontend. Communicate purely via JSON APIs.
2. **Strict Request Validation:** When adding backend routes, define a Pydantic schema in `backend/app/schemas/` to enforce incoming data formats.
3. **Database Migrations:** Modifying columns requires updating PostgreSQL.
   - For Supabase: SQL migration files are generated in `frontend/supabase/migrations/`.
   - For SQLAlchemy: Models must reflect these tables.
4. **Git Check:** Before pushing, ensure you do not commit any credentials or `.env` files. Ensure you run local builds to verify code integrity.
