# 🗄 Database Documentation

This document describes the PostgreSQL database schema for **MediVerse AI**. It outlines current tables, their columns, relationships, security policies, and planned extensions.

---

## 1. Schema Overview

The database is built on PostgreSQL, utilizing custom `ENUM` types and UUID primary keys.

### Enums
- **`app_role`:** `patient` | `doctor` | `admin`
- **`appointment_status`:** `pending` | `approved` | `completed` | `cancelled`
- **`record_category`:** `lab_report` | `mri` | `ct_scan` | `xray` | `prescription` | `other`
- **`prediction_kind`:** `diabetes` | `heart` | `symptom` | `brain_tumor` | `liver` | `parkinsons`

---

## 2. CURRENT Tables

These tables are defined in the SQL migrations and TypeScript types.

### `profiles`
Stores profile details for all registered users.
- **Columns:**
  - `id`: `UUID` (Primary Key, references `auth.users`)
  - `full_name`: `TEXT`
  - `email`: `TEXT`
  - `phone`: `TEXT`
  - `date_of_birth`: `DATE`
  - `gender`: `TEXT`
  - `avatar_url`: `TEXT`
  - `created_at`: `TIMESTAMPTZ` (default `now()`)
  - `updated_at`: `TIMESTAMPTZ` (default `now()`)

### `user_roles`
Maps users to access roles.
- **Columns:**
  - `id`: `UUID` (Primary Key)
  - `user_id`: `UUID` (references `auth.users`)
  - `role`: `app_role`
  - `created_at`: `TIMESTAMPTZ`
  - *Constraints:* Unique combination of `(user_id, role)`.

### `clinics`
Stores details of registered clinics.
- **Columns:**
  - `id`: `UUID` (Primary Key)
  - `name`: `TEXT` (Not Null)
  - `address`: `TEXT`
  - `phone`: `TEXT`
  - `created_at`: `TIMESTAMPTZ`

### `doctors`
Stores professional profiles for medical practitioners. Extends `profiles` using a foreign key.
- **Columns:**
  - `id`: `UUID` (Primary Key, references `auth.users`)
  - `specialty`: `TEXT`
  - `license_no`: `TEXT`
  - `clinic_id`: `UUID` (references `clinics.id`)

### `appointments`
Tracks bookings between patients and doctors.
- **Columns:**
  - `id`: `UUID` (Primary Key)
  - `patient_id`: `UUID` (references `profiles.id`)
  - `doctor_id`: `UUID` (references `doctors.id`)
  - `scheduled_at`: `TIMESTAMPTZ` (Not Null)
  - `reason`: `TEXT`
  - `notes`: `TEXT`
  - `status`: `appointment_status` (default `pending`)
  - `created_at`: `TIMESTAMPTZ`
  - `updated_at`: `TIMESTAMPTZ`

### `medical_records`
Stores file metadata for patient health reports, scans, and documents.
- **Columns:**
  - `id`: `UUID` (Primary Key)
  - `patient_id`: `UUID` (references `profiles.id`)
  - `title`: `TEXT` (Not Null)
  - `description`: `TEXT`
  - `category`: `record_category`
  - `storage_path`: `TEXT` (Not Null)
  - `mime_type`: `TEXT`
  - `file_size`: `INTEGER`
  - `uploaded_by`: `UUID`
  - `created_at`: `TIMESTAMPTZ`

### `medications`
Tracks patient prescriptions and drug courses.
- **Columns:**
  - `id`: `UUID` (Primary Key)
  - `patient_id`: `UUID` (references `profiles.id`)
  - `name`: `TEXT` (Not Null)
  - `dosage`: `TEXT`
  - `frequency`: `TEXT`
  - `times_of_day`: `TEXT[]`
  - `start_date`: `DATE`
  - `end_date`: `DATE`
  - `active`: `BOOLEAN` (default `true`)
  - `created_at`: `TIMESTAMPTZ`

### `predictions`
Persists outputs of AI classification and diagnostic models.
- **Columns:**
  - `id`: `UUID` (Primary Key)
  - `patient_id`: `UUID` (references `profiles.id`)
  - `kind`: `prediction_kind` (Not Null)
  - `input`: `JSONB` (Not Null, stores input features)
  - `result`: `JSONB` (Not Null, model classification output)
  - `confidence`: `NUMERIC`
  - `risk_level`: `TEXT`
  - `model_name`: `TEXT`
  - `created_at`: `TIMESTAMPTZ`

### `prescriptions`
Tracks prescriptions written by doctors.
- **Columns:**
  - `id`: `UUID` (Primary Key)
  - `patient_id`: `UUID` (references `profiles.id`)
  - `doctor_id`: `UUID` (references `doctors.id`)
  - `notes`: `TEXT`
  - `storage_path`: `TEXT`
  - `created_at`: `TIMESTAMPTZ`

### `notifications`
System alerts dispatched to users.
- **Columns:**
  - `id`: `UUID` (Primary Key)
  - `user_id`: `UUID` (references `profiles.id`)
  - `title`: `TEXT` (Not Null)
  - `body`: `TEXT`
  - `kind`: `TEXT`
  - `read`: `BOOLEAN` (default `false`)
  - `created_at`: `TIMESTAMPTZ`

### `audit_logs`
Tracks admin-level modifications and security activities.
- **Columns:**
  - `id`: `UUID` (Primary Key)
  - `action`: `TEXT` (Not Null)
  - `actor_id`: `UUID`
  - `target_id`: `UUID`
  - `target_table`: `TEXT`
  - `metadata`: `JSONB`
  - `created_at`: `TIMESTAMPTZ`

---

## 3. PLANNED Tables

These tables are planned for future modules and do not exist in the current SQL migrations.

### `medication_reminders`
To track automated SMS, Email, or Push notifications triggered at specific `times_of_day`.
- **Columns (Draft):**
  - `id`: `UUID` (Primary Key)
  - `medication_id`: `UUID` (references `medications.id`)
  - `remind_at`: `TIME`
  - `channel`: `TEXT` (e.g. `sms`, `push`, `email`)
  - `is_enabled`: `BOOLEAN`

### `chats` & `messages`
To persist dialog transcripts between patients and the AI Health Assistant.
- **Columns (Draft):**
  - `id`: `UUID` (Primary Key)
  - `user_id`: `UUID` (references `profiles.id`)
  - `session_id`: `TEXT`
  - `sender`: `TEXT` (e.g., `user` or `ai`)
  - `message`: `TEXT`
  - `created_at`: `TIMESTAMPTZ`