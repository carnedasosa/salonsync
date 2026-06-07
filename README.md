# salonSync 💅

Un gestionale moderno per saloni di bellezza (estetica, unghie, ecc.) sviluppato con React, Vite e Supabase.

> [!WARNING]  
> **🚨 TO-DO PER LA PRODUZIONE (MOLTO IMPORTANTE) 🚨**  
> Attualmente la sicurezza a livello di riga (Row Level Security - RLS) su Supabase è **DISABILITATA** per facilitare lo sviluppo e i test locali. 
> Prima di pubblicare l'app in produzione (quando ci saranno dati di clienti veri o pagamenti online), **DEVI ASSOLUTAMENTE**:
> 1. Abilitare RLS su tutte le tabelle nel pannello di Supabase.
> 2. Creare le "Policy" di Supabase (es. permettere la lettura/scrittura solo agli utenti autenticati).
> 3. Implementare una vera e propria schermata di Login nell'app.

## Struttura e Tecnologie

- **Frontend:** React, Vite, React Router
- **State Management:** React Context (per evitare prop-drilling) + React Query (per la cache e chiamate a Supabase)
- **Backend & Database:** Supabase (PostgreSQL)
- **Stile:** Vanilla CSS + Lucide React per le icone

## Setup Locale

1. Installa le dipendenze: `npm install`
2. Inserisci le tue chiavi Supabase (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`) nel file `.env.local`.
3. Crea le tabelle eseguendo lo script `supabase_schema.sql` nell'SQL Editor di Supabase.
4. Avvia il server di sviluppo: `npm run dev`

