# 🗺 Development Roadmap

This roadmap documents the status of feature modules in **MediVerse AI**.

---

## 🟩 COMPLETED

- **Project Initialization (v0.1):** Set up React frontend with Vite, Tailwind, and TanStack Start. Setup FastAPI backend skeleton.
- **Route Definitions & UI Shells:** Standardised patient, doctor, and admin dashboard UI structures.
- **Mock Patient Endpoints:** Simple in-memory patient lookup and creation router implemented.
- **Repository Reorganization:** Added root `.gitignore`, unified documentation structure (`docs/`), created AI Agent guide (`AGENTS.md`), and cleaned untracked local env secrets.

---

## 🟨 IN PROGRESS

- **SQLAlchemy Database Binding:** Connecting database sessions (`SessionLocal`) to FastAPI endpoints (currently patient CRUD relies on hardcoded list).
- **Frontend API client mapping:** Planning real API requests from React components to the FastAPI backend instead of the placeholder stubs.

---

## 🟦 PLANNED

### Phase 1: Authentication & Role-Based Access Control
- [ ] JWT authentication endpoints (`/auth/login`, `/auth/register`).
- [ ] Role-based middleware guards to restrict route views to `patient`, `doctor`, or `admin`.
- [ ] Profile metadata synchronization on signup.

### Phase 2: Patient Portal CRUD
- [ ] Connect appointments, records, and prescriptions to database schemas.
- [ ] Implement file upload pipelines for lab reports and PDF documents.

### Phase 3: AI Diagnosis & Tabular Predictors
- [ ] Create predictive modules using standard `scikit-learn` libraries.
- [ ] Integrate Diabetes, Heart Disease, and Parkinson's prediction calculators.
- [ ] Enable history tracking for past prediction computations.

### Phase 4: Medical Imaging ML
- [ ] Set up PyTorch inference module on backend server.
- [ ] Develop Brain MRI upload channel and classification pipeline.

### Phase 5: Dashboards & Analytics
- [ ] Doctor Dashboard: review patients, write prescriptions, manage bookings.
- [ ] Admin Portal: audit logs viewing, user access editing.
- [ ] Advanced metrics graphs using Recharts.
