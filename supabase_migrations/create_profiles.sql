-- Crea la tabella profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    status text DEFAULT 'pending' NOT NULL
);

-- Abilita RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy per SELECT: ogni utente può LEGGERE solo il proprio profilo.
-- NON creiamo policy di UPDATE/INSERT/DELETE per l'utente, 
-- in modo che non possa modificare il proprio status (Paywall Manuale).
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING ( auth.uid() = id );

-- Funzione per il trigger (eseguita con privilegi elevati, bypassa RLS)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $body$
BEGIN
    INSERT INTO public.profiles (id, status)
    VALUES (new.id, 'pending');
    RETURN new;
END;
$body$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger su auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

