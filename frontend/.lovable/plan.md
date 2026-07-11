## MediVerse AI — MVP Plan

A light-themed(green and white type) healthcare SaaS frontend (TanStack Start + Tailwind + shadcn) with Patient / Doctor / Admin dashboards. Auth + data via Lovable Cloud. AI chat assistant + report summarization via Lovable AI Gateway (Gemini). ML predictions (diabetes, heart, brain tumor, etc.) call your external FastAPI endpoints — wired through a single typed client with a configurable base URL.

Design directions step is skipped: the create_directions tool requires a screenshot of existing UI, and there is none yet. I'll build straight to the spec — dark navy + cyan/blue healthcare SaaS aesthetic — and we can iterate on visuals after you see it live.

---

### Scope (shallow but end-to-end, all 3 roles)

**Auth & RBAC**

- Email/password + Google sign-in via Lovable Cloud
- `profiles` table + `user_roles` table (`patient` / `doctor` / `admin`) using the secure `has_role()` SECURITY DEFINER pattern
- `_authenticated` route guard + role-gated layouts (`/patient/*`, `/doctor/*`, `/admin/*`)
- Role assigned at signup (default `patient`); admin can promote

**Shared shell**

- Collapsible sidebar (role-specific items), top bar with user menu, dark theme tokens, toast notifications

**Patient dashboard** (`/patient/*`)

- Overview: KPI cards (reports, active meds, upcoming appts, latest risk score), health trends chart (Recharts), recent activity
- Medical Records: upload PDFs / images to Cloud Storage, list/filter/preview/download
- Predictions: forms for Diabetes, Heart, Symptom-based → POSTs to your FastAPI, stores result in `predictions` table, shows history
- Brain Tumor Analysis: MRI upload → FastAPI image endpoint → renders result + confidence
- Appointments: book/reschedule/cancel against a doctor list
- Medicine Reminders: CRUD with daily schedule + missed-dose tracking (in-app notifications; SMS/WhatsApp listed as future)
- Analytics: trend charts over stored vitals/predictions
- AI Assistant: streaming chat (AI Elements + Lovable AI Gateway, Gemini 3 Flash) with medical disclaimer banner; can also "Explain this report" from a record

**Doctor dashboard** (`/doctor/*`)

- Today's appointments, assigned patient list, patient detail (records + AI predictions read-only), prescription upload, basic analytics

**Admin dashboard** (`/admin/*`)

- Users table (promote/demote roles), doctors, clinics CRUD, platform stats (counts, storage usage), audit log viewer

**AI Report Analyzer**

- Server function: takes uploaded report (PDF/image), sends to Lovable AI (Gemini multimodal), returns structured summary + flagged abnormal values + plain-language explanation

**Notifications**

- In-app notification center fed by a `notifications` table; realtime via Supabase channel

---

### Technical details

**Stack mapping (vs. your original spec)**

- Frontend: TanStack Start v1 + React 19 + Tailwind v4 + shadcn (as specified)
- Backend for app data/auth/storage: **Lovable Cloud (Supabase)** instead of FastAPI+Postgres — same Postgres underneath, with built-in auth, RLS, storage, and edge runtime. No separate FastAPI server to host for CRUD.
- ML/DL inference: **your external FastAPI** — Lovable cannot run sklearn/TF/PyTorch models. I'll add a `VITE_ML_API_BASE_URL` secret + a typed `mlClient` wrapper. Until you provide the URL, calls return a clear "ML backend not configured" error in the UI.
- LLM features (chat assistant, report summarization, term explanations): **Lovable AI Gateway** with `google/gemini-3-flash-preview` (multimodal for report images/PDFs). Keys managed automatically.

**Database (Lovable Cloud migrations)**
Tables: `profiles`, `user_roles` (+ `app_role` enum + `has_role()`), `clinics`, `doctors`, `patients`, `appointments`, `medical_records` (with storage path), `predictions` (JSONB result + model name + confidence), `prescriptions`, `medications` (reminder schedule), `notifications`, `audit_logs`. Each table gets explicit GRANTs + RLS scoped by `auth.uid()` and `has_role()`. Storage bucket `medical-records` (private, signed URLs).

**Server boundaries (TanStack)**

- `createServerFn` for app-internal calls (record upload metadata, prediction logging, report analyzer)
- `src/routes/api/chat.ts` server route for streaming AI assistant
- `mlClient` calls go through a server function so the ML base URL/secret never ships to the browser

**Routing**

- `/auth`, `/_authenticated/patient/*`, `/_authenticated/doctor/*`, `/_authenticated/admin/*` (managed `_authenticated` route gate from the Supabase integration)
- Real routes per section (no hash anchors), each with its own `head()` metadata

**Security**

- RLS everywhere; role checks via `has_role()` (never client-side)
- Roles in separate `user_roles` table — never on `profiles`
- Zod validation on all server fn inputs; signed URLs for record downloads
- Medical disclaimer always rendered with AI output

**What I will NOT do in this MVP** (call out for clarity)

- No real ML training/serving (handled by your FastAPI)
- No SMS/WhatsApp/email reminder delivery (in-app only; add Twilio/Resend later)
- No telemedicine video, wearables, multi-language — listed as future
- No HIPAA-grade compliance work — this is a development prototype

---

### Build order

1. Enable Lovable Cloud, run schema migration, seed `app_role` enum + `has_role()`
2. Auth pages + role guard + sidebar shell + theme tokens
3. Patient dashboard (overview → records → predictions → appointments → reminders → analytics → AI assistant)
4. Doctor dashboard
5. Admin dashboard
6. ML client wrapper + Report Analyzer server function
7. Notifications + audit logging

After approval I'll start with step 1. Once the shell is up you can drop in your FastAPI URL via a secret and the prediction screens will go live.