
-- 1. APPOINTMENTS: split patient ALL policy into per-command policies with strict WITH CHECK,
--    and add a trigger to lock patient_id / doctor_id on UPDATE.
DROP POLICY IF EXISTS "appts patient own" ON public.appointments;

CREATE POLICY "appts patient select" ON public.appointments
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "appts patient insert" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "appts patient update" ON public.appointments
  FOR UPDATE USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "appts patient delete" ON public.appointments
  FOR DELETE USING (auth.uid() = patient_id);

CREATE OR REPLACE FUNCTION public.appointments_lock_ownership()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.patient_id IS DISTINCT FROM OLD.patient_id THEN
    RAISE EXCEPTION 'patient_id cannot be changed';
  END IF;
  IF NEW.doctor_id IS DISTINCT FROM OLD.doctor_id
     AND NOT public.has_role(auth.uid(), 'admin'::app_role)
     AND auth.uid() IS DISTINCT FROM OLD.doctor_id THEN
    RAISE EXCEPTION 'doctor_id can only be changed by the assigned doctor or an admin';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS appointments_lock_ownership ON public.appointments;
CREATE TRIGGER appointments_lock_ownership
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.appointments_lock_ownership();

-- 2. DOCTORS: add WITH CHECK on self-update and lock id/clinic_id changes via trigger.
DROP POLICY IF EXISTS "doctors self update" ON public.doctors;
CREATE POLICY "doctors self update" ON public.doctors
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.doctors_lock_identity()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'doctor id cannot be changed';
  END IF;
  IF NEW.clinic_id IS DISTINCT FROM OLD.clinic_id
     AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'clinic assignment can only be changed by an admin';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS doctors_lock_identity ON public.doctors;
CREATE TRIGGER doctors_lock_identity
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.doctors_lock_identity();

-- 3. PRESCRIPTIONS: add explicit restrictive policy so patients cannot write, even if a
--    permissive policy is ever added by mistake.
DROP POLICY IF EXISTS "rx block patient writes" ON public.prescriptions;
CREATE POLICY "rx block patient writes" ON public.prescriptions
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR auth.uid() = doctor_id
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR auth.uid() = doctor_id
  );

-- 4. SECURITY DEFINER functions: revoke EXECUTE from public/authenticated on functions
--    that should not be callable by signed-in users. has_role stays executable because
--    RLS policies invoke it as the querying role.
REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
