# Connecting Your Own Backend to MediVerse AI

The UI is fully preserved. The database layer has been replaced with a
no-op stub so every screen renders with empty state and no network calls.

---

## Where the data layer lives

Every data call in the app goes through **one** import:

```ts
import { supabase } from "@/integrations/supabase/client";
```

That file (`src/integrations/supabase/client.ts`) is now a stub that returns
empty arrays / null for every query. Swap it out and the whole app is wired
back to a real backend.

Files that currently read/write data (use these as your "endpoint checklist"):

| Screen                              | File                                      | Resource                     |
|-------------------------------------|-------------------------------------------|------------------------------|
| Patient dashboard                   | `src/routes/patient/index.tsx`            | appointments, predictions    |
| Medical records                     | `src/routes/patient/records.tsx`          | `medical_records` + storage  |
| Disease predictions                 | `src/routes/patient/predictions.tsx`      | `predictions`                |
| Brain MRI                           | `src/routes/patient/brain.tsx`            | `predictions` + storage      |
| Appointments                        | `src/routes/patient/appointments.tsx`     | `appointments`               |
| Medications                         | `src/routes/patient/medications.tsx`      | `medications`                |
| Health analytics                    | `src/routes/patient/analytics.tsx`        | `predictions`                |
| Doctor dashboard                    | `src/routes/doctor/index.tsx`             | `appointments`, `prescriptions` |
| Admin users / logs / stats          | `src/routes/admin/*.tsx`                  | `profiles`, `audit_logs`, ... |
| Auth session                        | `src/hooks/use-current-user.ts`           | current user + role          |

The demo user is hard-coded in `src/hooks/use-current-user.ts` — replace it
with a real session lookup when you wire auth back on.

---

## Option 1 — Bring your own Supabase / Postgres (fastest)

You keep every existing query as-is.

1. Create a Supabase project (or run Postgres + PostgREST yourself).
2. Run the SQL in `supabase/migrations/` against your database.
3. Restore the real client. Replace `src/integrations/supabase/client.ts`
   with the standard Supabase client:

   ```ts
   import { createClient } from "@supabase/supabase-js";
   import type { Database } from "./types";

   export const supabase = createClient<Database>(
     import.meta.env.VITE_SUPABASE_URL!,
     import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
   );
   ```
4. Put your keys in `.env`:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=YOUR-ANON-KEY
   ```
5. Restore `src/hooks/use-current-user.ts` to read the real session
   (see git history for the original implementation).

Done — every screen becomes live.

---

## Option 2 — Custom REST/GraphQL backend (FastAPI, Node, Django, …)

Recommended if you already have your own server.

1. **Create a thin API client** at `src/lib/api.ts`:

   ```ts
   const BASE_URL = import.meta.env.VITE_API_URL!;

   async function request<T>(path: string, init?: RequestInit): Promise<T> {
     const res = await fetch(`${BASE_URL}${path}`, {
       headers: { "Content-Type": "application/json" },
       credentials: "include",
       ...init,
     });
     if (!res.ok) throw new Error(await res.text());
     return res.json() as Promise<T>;
   }

   export const api = {
     appointments: {
       list: () => request("/appointments"),
       create: (body: unknown) =>
         request("/appointments", { method: "POST", body: JSON.stringify(body) }),
       cancel: (id: string) =>
         request(`/appointments/${id}/cancel`, { method: "POST" }),
     },
     records:    { list: () => request("/records"), /* ... */ },
     predictions:{ list: () => request("/predictions"), /* ... */ },
     medications:{ list: () => request("/medications"), /* ... */ },
     // add one namespace per table in the checklist above
   };
   ```

2. **In each route**, replace the Supabase call with the api call. Example
   (`src/routes/patient/appointments.tsx`):

   ```ts
   // before
   const { data } = await supabase.from("appointments").select("*")...
   // after
   const data = await api.appointments.list();
   ```

   The React Query wiring (`useQuery`, `useMutation`) stays exactly the same.

3. Add `VITE_API_URL=https://your-backend.example.com` to `.env`.

4. For auth, replace `src/hooks/use-current-user.ts` with a hook that reads
   your session (JWT in cookie, `/me` endpoint, etc.) and returns the same
   shape the components already consume.

---

## Endpoints your backend should expose (checklist)

Match these resources and the UI works without further changes:

- `GET/POST /appointments`, `PATCH /appointments/:id`
- `GET/POST/DELETE /records` (+ file upload endpoint)
- `GET/POST /predictions`
- `GET/POST/PATCH/DELETE /medications`
- `GET/POST /prescriptions`
- `GET /profiles`, `GET /profiles/me`
- `GET /audit-logs`  (admin)
- `GET /clinics`, `GET /doctors`  (admin)
- `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`

Column shapes are defined in `src/integrations/supabase/types.ts` — use it as
your OpenAPI reference.

---

## What was removed vs. kept

- ✅ Kept: all UI, routing, styling, React Query wiring, AI chat endpoint.
- ✅ Kept: the auto-generated TypeScript types in `types.ts` (useful as a
  schema reference).
- 🚫 Disabled: every read/write goes through a stub that returns empty data.
- 🚫 Disabled: auth (a demo patient is injected in `use-current-user.ts`).

You can delete `supabase/`, `src/integrations/supabase/client.server.ts`,
`auth-middleware.ts`, `auth-attacher.ts`, and the `@supabase/*` dependencies
once you've migrated — nothing in the running UI needs them.
