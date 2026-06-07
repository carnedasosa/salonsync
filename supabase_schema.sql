DROP TABLE IF EXISTS public.treatments_history;
DROP TABLE IF EXISTS public.appointments;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.services;
DROP TABLE IF EXISTS public.clients;
DROP TABLE IF EXISTS public.staff;
DROP TABLE IF EXISTS public.salon_settings;

-- 1. Tabella Impostazioni Salone
CREATE TABLE IF NOT EXISTS public.salon_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text,
    phone text,
    "businessHours" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "themeColors" jsonb NOT NULL DEFAULT '{"primary": "#000000"}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabella Staff
CREATE TABLE IF NOT EXISTS public.staff (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    role text NOT NULL,
    color text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabella Clienti
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text,
    phone text,
    birthday text,
    "skinType" text,
    allergies text,
    "generalNotes" text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabella Servizi
CREATE TABLE IF NOT EXISTS public.services (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    category text,
    price numeric NOT NULL,
    duration integer NOT NULL,
    buffer integer DEFAULT 0,
    color text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabella Prodotti
CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    category text,
    stock integer NOT NULL DEFAULT 0,
    "minStock" integer NOT NULL DEFAULT 5,
    price numeric NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabella Appuntamenti
CREATE TABLE IF NOT EXISTS public.appointments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- 7. Tabella Storico Trattamenti (CRM)
CREATE TABLE IF NOT EXISTS public.treatments_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Disabilitiamo RLS per velocizzare lo sviluppo (NON in produzione!)
ALTER TABLE public.salon_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments_history DISABLE ROW LEVEL SECURITY;

-- 8. Vista per lo Storico Fatturato (Monthly Revenue)
CREATE OR REPLACE VIEW public.monthly_revenue AS
SELECT 
    to_char(date::date, 'YYYY-MM') as month_key,
    SUM(price) as revenue,
    COUNT(*) as appointments
FROM 
    public.appointments
WHERE 
    status = 'completed'
GROUP BY 
    to_char(date::date, 'YYYY-MM')
ORDER BY 
    to_char(date::date, 'YYYY-MM');

