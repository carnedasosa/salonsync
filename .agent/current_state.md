# Stato Attuale del Progetto: SalonSync (10 Giugno 2026)

## 🎯 Obiettivo Raggiunto (Fase 1 & Fase 2)
Il progetto è stato inizializzato e protetto tramite un'architettura multi-tenant sicura basata su **React** e **Supabase**.
Abbiamo implementato l'Autenticazione e un sistema di "Paywall Manuale" per gestire gli abbonamenti dei saloni.

## 🏗️ Architettura Attuale
1. **Autenticazione (`AuthContext.jsx`):** Gestisce il login/signup e recupera il profilo utente.
2. **Routing Protetto (`ProtectedRoute.jsx`):** 
   - Se non sei loggato -> Vai a `/auth`
   - Se sei loggato ma il tuo `profile.status !== 'active'` -> Vai a `/paywall`
   - Se sei loggato e `active` -> Accedi all'App.
3. **Database (Supabase):**
   - Tutte le tabelle di business (`clients`, `appointments`, `products`, ecc.) hanno una colonna `user_id`.
   - **Row Level Security (RLS)** è attiva con policy che limitano il CRUD a `auth.uid() = user_id`.
   - Esiste una tabella `profiles` (legata ad `auth.users` tramite un Trigger SQL). I nuovi utenti nascono con `status = 'pending'`.
4. **Viste e RPC:**
   - Creata la vista `monthly_revenue` con `WITH (security_invoker = on)` e un safe cast `safe_cast_to_date` per le date.
   - Creata una RPC `increment_stock` per aggiornamenti sicuri allo stock prodotti senza race condition.

## 📚 Knowledge Base (MOLTO IMPORTANTE)
Il file `c:\Users\desim\Desktop\salonsync\.agent\knowledge_base_errors.md` contiene la memoria vitale del progetto. **Tutti i nuovi agenti DEVONO leggerlo prima di toccare codice**.
Principali regole apprese a caro prezzo:
- MAI usare tag `<button>` per navigazione (usa tag `<a>` stilizzati).
- MAI usare `<div>` con `onClick` per elementi interattivi.
- SEMPRE creare `CREATE POLICY` quando si abilita RLS (altrimenti è Deny-All).
- SEMPRE creare `CREATE INDEX` sulle colonne `user_id` per non distruggere le performance RLS.
- Usare `security_invoker = on` nelle Viste Postgres protette.
- Drop idempotenti: droppare le viste prima delle tabelle.

## 🚀 Prossimi Passi Possibili
- Sviluppare le logiche interne dei vari Context (Clienti, Appuntamenti, Catalogo) per interagire effettivamente con Supabase tramite chiamate API o React Query.
- Sviluppare l'interfaccia della Dashboard interna.
- Passare da un Paywall Manuale a un'integrazione con Stripe.
