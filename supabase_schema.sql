DROP VIEW IF EXISTS public.monthly_revenue;
DROP TABLE IF EXISTS public.treatments_history;
DROP TABLE IF EXISTS public.appointments;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.services;
DROP TABLE IF EXISTS public.clients;
DROP TABLE IF EXISTS public.staff;
DROP TABLE IF EXISTS public.salon_settings;

CREATE OR REPLACE FUNCTION public.safe_cast_to_date(text) RETURNS date AS $$
BEGIN
    RETURN $1::date;
EXCEPTION WHEN others THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 1. Tabella Impostazioni Salone
CREATE TABLE IF NOT EXISTS public.salon_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    "businessHours" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "themeColors" jsonb NOT NULL DEFAULT '{"primary": "#000000"}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_salon_settings_user_id ON public.salon_settings (user_id);
ALTER TABLE public.salon_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own salon_settings" ON public.salon_settings FOR ALL USING (auth.uid() = user_id);

-- 2. Tabella Staff
CREATE TABLE IF NOT EXISTS public.staff (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    color text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_staff_user_id ON public.staff (user_id);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own staff" ON public.staff FOR ALL USING (auth.uid() = user_id);

-- 3. Tabella Clienti
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    birthday text,
    "skinType" text,
    allergies text,
    "generalNotes" text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_clients_user_id ON public.clients (user_id);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own clients" ON public.clients FOR ALL USING (auth.uid() = user_id);

-- 4. Tabella Servizi
CREATE TABLE IF NOT EXISTS public.services (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    name text NOT NULL,
    category text,
    price numeric NOT NULL,
    duration integer NOT NULL,
    buffer integer DEFAULT 0,
    color text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_services_user_id ON public.services (user_id);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own services" ON public.services FOR ALL USING (auth.uid() = user_id);

-- 5. Tabella Prodotti
CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    name text NOT NULL,
    category text,
    stock integer NOT NULL DEFAULT 0,
    "minStock" integer NOT NULL DEFAULT 5,
    price numeric NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_products_user_id ON public.products (user_id);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own products" ON public.products FOR ALL USING (auth.uid() = user_id);

-- 6. Tabella Appuntamenti
CREATE TABLE IF NOT EXISTS public.appointments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    "clientId" uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    "clientName" text,
    "serviceId" uuid REFERENCES public.services(id) ON DELETE SET NULL,
    "serviceName" text,
    "operatorId" uuid REFERENCES public.staff(id) ON DELETE SET NULL,
    "operatorName" text,
    date text NOT NULL,
    time text NOT NULL,
    duration integer,
    buffer integer,
    price numeric,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_appointments_user_id ON public.appointments (user_id);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own appointments" ON public.appointments FOR ALL USING (auth.uid() = user_id);

-- 7. Tabella Storico Trattamenti (CRM)
CREATE TABLE IF NOT EXISTS public.treatments_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    "clientId" uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    "appointmentId" uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
    date text,
    "serviceName" text,
    "operatorName" text,
    notes text,
    price numeric,
    "beforePhoto" text,
    "afterPhoto" text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_treatments_history_user_id ON public.treatments_history (user_id);
ALTER TABLE public.treatments_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own treatments" ON public.treatments_history FOR ALL USING (auth.uid() = user_id);

-- 8. Vista per lo Storico Fatturato (Monthly Revenue)
CREATE OR REPLACE VIEW public.monthly_revenue WITH (security_invoker = on) AS
SELECT 
    to_char(public.safe_cast_to_date(date), 'YYYY-MM') as month_key,
    SUM(price) as revenue,
    COUNT(*) as appointments
FROM 
    public.appointments
WHERE 
DROP VIEW IF EXISTS public.monthly_revenue;
DROP TABLE IF EXISTS public.treatments_history;
DROP TABLE IF EXISTS public.appointments;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.services;
DROP TABLE IF EXISTS public.clients;
DROP TABLE IF EXISTS public.staff;
DROP TABLE IF EXISTS public.salon_settings;

CREATE OR REPLACE FUNCTION public.safe_cast_to_date(text) RETURNS date AS $$
BEGIN
    RETURN $1::date;
EXCEPTION WHEN others THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 1. Tabella Impostazioni Salone
CREATE TABLE IF NOT EXISTS public.salon_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    "businessHours" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "themeColors" jsonb NOT NULL DEFAULT '{"primary": "#000000"}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_salon_settings_user_id ON public.salon_settings (user_id);
ALTER TABLE public.salon_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own salon_settings" ON public.salon_settings FOR ALL USING (auth.uid() = user_id);

-- 2. Tabella Staff
CREATE TABLE IF NOT EXISTS public.staff (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    color text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_staff_user_id ON public.staff (user_id);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own staff" ON public.staff FOR ALL USING (auth.uid() = user_id);

-- 3. Tabella Clienti
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    birthday text,
    "skinType" text,
    allergies text,
    "generalNotes" text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_clients_user_id ON public.clients (user_id);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own clients" ON public.clients FOR ALL USING (auth.uid() = user_id);

-- 4. Tabella Servizi
CREATE TABLE IF NOT EXISTS public.services (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    name text NOT NULL,
    category text,
    price numeric NOT NULL,
    duration integer NOT NULL,
    buffer integer DEFAULT 0,
    color text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_services_user_id ON public.services (user_id);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own services" ON public.services FOR ALL USING (auth.uid() = user_id);

-- 5. Tabella Prodotti
CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    name text NOT NULL,
    category text,
    stock integer NOT NULL DEFAULT 0,
    "minStock" integer NOT NULL DEFAULT 5,
    price numeric NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_products_user_id ON public.products (user_id);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own products" ON public.products FOR ALL USING (auth.uid() = user_id);

-- 6. Tabella Appuntamenti
CREATE TABLE IF NOT EXISTS public.appointments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    "clientId" uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    "clientName" text,
    "serviceId" uuid REFERENCES public.services(id) ON DELETE SET NULL,
    "serviceName" text,
    "operatorId" uuid REFERENCES public.staff(id) ON DELETE SET NULL,
    "operatorName" text,
    date text NOT NULL,
    time text NOT NULL,
    duration integer,
    buffer integer,
    price numeric,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_appointments_user_id ON public.appointments (user_id);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own appointments" ON public.appointments FOR ALL USING (auth.uid() = user_id);

-- 7. Tabella Storico Trattamenti (CRM)
CREATE TABLE IF NOT EXISTS public.treatments_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    "clientId" uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    "appointmentId" uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
    date text,
    "serviceName" text,
    "operatorName" text,
    notes text,
    price numeric,
    "beforePhoto" text,
    "afterPhoto" text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_treatments_history_user_id ON public.treatments_history (user_id);
ALTER TABLE public.treatments_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own treatments" ON public.treatments_history FOR ALL USING (auth.uid() = user_id);

-- 8. Vista per lo Storico Fatturato (Monthly Revenue)
CREATE OR REPLACE VIEW public.monthly_revenue WITH (security_invoker = on) AS
SELECT 
    to_char(public.safe_cast_to_date(date), 'YYYY-MM') as month_key,
    SUM(price) as revenue,
    COUNT(*) as appointments
FROM 
    public.appointments
WHERE 
    status = 'completed' AND public.safe_cast_to_date(date) IS NOT NULL
GROUP BY 
    to_char(public.safe_cast_to_date(date), 'YYYY-MM')
ORDER BY 
    to_char(public.safe_cast_to_date(date), 'YYYY-MM');

-- 9. Funzione per aggiornare lo stock in modo atomico
CREATE OR REPLACE FUNCTION public.update_stock(product_id uuid, amount_change integer)
RETURNS void AS $$
BEGIN
    UPDATE public.products
    SET stock = stock + amount_change
    WHERE id = product_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
