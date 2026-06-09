-- 1. Aggiungiamo la colonna user_id per associare ogni record all'utente autenticato
ALTER TABLE public.salon_settings ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.treatments_history ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- 2. Riabilitiamo la Row Level Security
ALTER TABLE public.salon_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments_history ENABLE ROW LEVEL SECURITY;

-- 3. Creiamo le policy per permettere all'utente di operare solo sui propri dati
-- salon_settings
CREATE POLICY "Users can manage their own salon settings" ON public.salon_settings
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- staff
CREATE POLICY "Users can manage their own staff" ON public.staff
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- clients
CREATE POLICY "Users can manage their own clients" ON public.clients
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- services
CREATE POLICY "Users can manage their own services" ON public.services
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- products
CREATE POLICY "Users can manage their own products" ON public.products
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- appointments
CREATE POLICY "Users can manage their own appointments" ON public.appointments
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- treatments_history
CREATE POLICY "Users can manage their own treatments history" ON public.treatments_history
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Aggiungiamo RLS anche alla view, in Supabase le viste con security barrier o eseguite col chiamante 
-- ereditano RLS dalle tabelle sottostanti, quindi non serve Policy sulla vista in sé
-- finché auth.uid() viene rispettato nella tabella appointments.

-- Funzione RPC per incrementare/decrementare lo stock in modo atomico (evitando race conditions)
CREATE OR REPLACE FUNCTION public.increment_stock(product_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, stock + amount)
  WHERE id = product_id AND user_id = auth.uid();
END;
$$;
