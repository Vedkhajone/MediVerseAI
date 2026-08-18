# 🏛 System Architecture

This document describes the high-level architecture of **MediVerse AI** and defines the separation of responsibilities between components.

---

## 1. High-Level Flow

The application is structured as a full-stack web application with a clean decoupling of the presentation layer and database persistence.

```
┌──────────────────────────────────────────────┐
│                  Frontend                    │ (React / TS UI Components)
└──────────────────────┬───────────────────────┘
                       │ React Query / Fetch
┌──────────────────────▼───────────────────────┐
│                 API Client                   │ (Vite env URL / Axios or Fetch)
└──────────────────────┬───────────────────────┘
                       │ HTTP Requests / JSON
┌──────────────────────▼───────────────────────┐
│                   FastAPI                    │ (Web Framework)
└──────────────────────┬───────────────────────┘
                       │ Routing & Validation
┌──────────────────────▼───────────────────────┐
│                   Routers                    │ (FastAPI APIRouter Endpoints)
└──────────────────────┬───────────────────────┘
                       │ Business Operations
┌──────────────────────▼───────────────────────┐
│                   Services                   │ (Pydantic / Business Logic Layer)
└──────────────────────┬───────────────────────┘
                       │ ORM Session Queries
┌──────────────────────▼───────────────────────┐
│                  SQLAlchemy                  │ (Database ORM Layer)
└──────────────────────┬───────────────────────┘
                       │ PostgreSQL Driver
┌──────────────────────▼───────────────────────┐
│                 PostgreSQL                   │ (Database Storage / RLS Policies)
└──────────────────────────────────────────────┘
```

### Component Details
1. **Frontend (React / TS):** Presentation layer built with React 19 and TanStack Start. It renders the UI layout, forms, dashboards, and charts.
2. **API Client (Future Integration):** A structured API client (e.g. `src/lib/api.ts`) that translates component actions into backend HTTP calls, using JSON. (Currently, components use a mock Supabase stub client).
3. **FastAPI (Backend):** Handles HTTP incoming requests, CORS, validation, exception mapping, and Swagger auto-documentation.
4. **Routers:** FastAPI `APIRouter` sub-modules grouped by domain (e.g., `patient.py`, `doctor.py`, `appointments.py`). They receive requests, call services, and return responses.
5. **Services (Planned):** Pure python business logic layer separating routers from data models. Handles access control, analytics calculations, and orchestrates database transactions.
6. **SQLAlchemy:** Translates python class-based database models into SQL syntax, manages sessions, transactions, and tables.
7. **PostgreSQL:** Persists relational data. When deployed on Supabase, it leverages built-in Row-Level Security (RLS) policies for tenant isolation.

---

## 2. AI / ML Services Integration

AI models and LLMs are treated as **Decision-Support Tools** (not autonomous medical diagnostics). They integrate with the architecture at the Backend / API level:

```
                  ┌──────────────────────┐
                  │   FastAPI Routers    │
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            │                                 │
┌───────────▼───────────┐         ┌───────────▼───────────┐
│   Tabular Predictions │         │  Medical Image ML     │
│ (Diabetes, Heart, etc)│         │ (Brain Tumor PyTorch) │
│   → Scikit-learn      │         │   → PyTorch / CUDA    │
└───────────────────────┘         └───────────────────────┘
```

1. **Tabular Machine Learning Models (Diabetes, Heart, Parkinson's):**
   - Implemented using `scikit-learn` and run directly as Python modules within backend service threads.
   - Predictions are computed on Pydantic-validated request bodies and persisted to the `predictions` table in PostgreSQL.
2. **Medical Image Analysis (Brain MRI / Brain Tumor Detection):**
   - Planned PyTorch/TensorFlow integrations.
   - Files are uploaded via FastAPI multipart uploads, stored in cloud storage (Supabase Bucket), and the image path is sent to the ML prediction pipeline.
3. **LLM Health Assistant:**
   - Standard chatbot functionality powered by OpenAI-compatible API configurations in the frontend router or backend routing layer.

---

## 3. Historical Architectural Decisions (ADRs)

### ADR-001 — FastAPI Selection
- **Decision:** Use FastAPI instead of Flask.
- **Reasoning:** Better OpenAPI auto-documentation, async capabilities, cleaner type safety/validation using Pydantic, and simplified integration with machine learning endpoints.
- **Date:** 30 June 2026

### ADR-002 — Lovable UI Role
- **Decision:** Keep Lovable only for UI component generation.
- **Reasoning:** Accelerates design and prototyping. Backend integrations and logic are custom-built to support custom SQLAlchemy logic and Python-based ML models.
- **Date:** 30 June 2026