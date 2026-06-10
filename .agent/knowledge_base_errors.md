# Knowledge Base — Registro degli Errori

> Questo file è la **memoria collettiva** dell'Apex Factory.
> **LETTURA OBBLIGATORIA** per The Architect e The Conductor prima di ogni nuovo task.
> Aggiornato da The Conductor ogni volta che un errore significativo viene risolto.

---

## 2026-06-09 — Bug di Stato, UX e Accessibilità nel Form Auth

**Agente responsabile:** The Artist
**Identificato da:** The Critic
**Categoria:** Frontend / UI/UX / Accessibilità

### Contesto
Implementazione dell'interfaccia di Login e Registrazione (AuthPage.jsx) con logiche di caricamento, gestione errori e design Glassmorphism.

### Errore
1. Mancata pulizia dello stato (campi ed errori) al cambio tra tab Login e Signup (la funzione di reset era in dead code).
2. Mancato campo "Conferma Password" e assenza di validazione nel form di registrazione.
3. Uso massiccio di stili inline per il layout (icone assolute negli input).
4. Uso di `<a href="#" onClick={...}>` per i link al posto di button stilizzati, causando problemi di accessibilità.
- **File:** `src/features/auth/AuthPage.jsx`

### Soluzione
Il componente è stato rifattorizzato per:
- Chiamare correttamente la funzione di pulizia (reset state) quando si cambia modalità.
- Aggiungere il campo e la validazione per la conferma password in modalità signup.
- Estrarre gli stili inline in classi CSS apposite dentro `AuthPage.css`.
- Utilizzare tag `<button type="button">` al posto di link fasulli per elementi interattivi.

### Regola di Prevenzione
> ⚠️ **REGOLA:**
> - Verificare sempre che le funzioni di reset dello stato (Dead Code) vengano chiamate ai cambi di contesto visivo (es. cambio tab).
> - Richiedere sempre un campo di conferma password nei form di registrazione.
> - Vietare l'uso ripetitivo di stili inline per il layout nel JSX; preferire sempre classi CSS esterne.
> - Mai usare `<a href="#">` per triggerare azioni JavaScript; usare `<button type="button">` per preservare l'accessibilità (WCAG).

---

## 2026-06-09 — Vulnerabilità RLS su Viste, Cache Leak e Race Condition DB

**Agente responsabile:** The Engine
**Identificato da:** The Critic
**Categoria:** Backend / Database / Sicurezza / Performance

### Contesto
Implementazione della sessione utente e aggiunta di Policy RLS su Supabase, e integrazione in React Query.

### Errore
1. **Data Leak:** La vista `public.monthly_revenue` esponeva i dati di tutti gli utenti perché le viste Postgres operano di default come `security definer`.
2. **Cache Leak:** Le `queryKey` di React Query non includevano l'ID utente e il logout non puliva la cache, causando la permanenza dei dati del primo utente dopo il logout.
3. **Race Condition (Lost Update):** In `CatalogContext`, lo stock veniva aggiornato in modo assoluto lato client (`stock = oldStock + amount`) rischiando sovrascritture concorrenti.
4. **Istruzioni SQL discordanti:** Commenti che indicano "DISABLE RLS" seguiti subito da "ENABLE RLS".
- **File:** `supabase_schema.sql`, file Context, `AuthContext.jsx`.

### Soluzione
In attesa di risoluzione da parte di The Engine tramite: utilizzo di `security_invoker = on` per le viste, query keys dipendenti da `user?.id` / pulizia cache al logout, creazione RPC Supabase per aggiornamenti stock relativi, e pulizia degli script SQL.

### Regola di Prevenzione
> ⚠️ **REGOLA:**
> - Aggiungere SEMPRE `WITH (security_invoker = on)` quando si creano Viste in Postgres che devono rispettare la RLS.
> - Le chiavi di `useQuery` per dati privati DEVONO includere l'ID utente (es. `['appointments', user?.id]`) o la cache deve essere esplicitamente invalidata al logout.
> - Non effettuare aggiornamenti incrementali lato client basati sullo stato letto; usare sempre funzioni RPC sul DB per update atomici e relativi (`stock = stock + X`).
> - Mantenere gli script SQL di migrazione puliti e coerenti coi commenti descrittivi.

---

## 2026-06-09 — Problemi Semantici e di Accessibilità nei Form (UI)

**Agente responsabile:** The Artist
**Identificato da:** The Critic
**Categoria:** Frontend / Accessibilità

### Contesto
Revisione delle correzioni all'interfaccia `AuthPage.jsx`.

### Errore
1. **Mancanza di semantica interattiva:** I tab per cambiare tra Login e Registrazione utilizzavano tag `<div>` con `onClick`. Questo rende i controlli inaccessibili via tastiera e invisibili agli screen reader.
2. **Disconnessione Label/Input:** I tag `<label>` non avevano l'attributo `htmlFor` e i relativi `<input>` non avevano un `id`, rendendo inusabile il form tramite screen reader.
- **File:** `src/features/auth/AuthPage.jsx`

### Soluzione
In attesa di correzione da parte di The Artist: i div dei tab devono diventare `<button type="button" role="tab">` (o simile), le label devono avere `htmlFor={id}` e gli input `id={id}`.

### Regola di Prevenzione
> ⚠️ **REGOLA:**
> - Non usare MAI `<div>` o `<span>` con `onClick` per creare elementi interattivi. Usa sempre tag nativi come `<button type="button">` o form elements per garantire focalizzabilità e accessibilità.
> - Ogni `<input>` o campo form DEVE avere un attributo `id` univoco, accoppiato a un tag `<label>` con il corrispondente attributo `htmlFor`.

---

## 2026-06-09 — Uso Errato di Button per Navigazione e Aria-Label Ridondanti

**Agente responsabile:** The Artist
**Identificato da:** The Critic
**Categoria:** Frontend / Accessibilità

### Contesto
Creazione dell'interfaccia `PaywallPage.jsx`.

### Errore
1. **Navigazione con Button:** Utilizzati tag `<button onClick={() => window.location.href = ...}>` per navigare ad ancore (`#`) o a link `mailto:`. I button non vanno usati per la navigazione.
2. **Aria-Label Ridondante:** Inseriti `aria-label` nei pulsanti che duplicavano esattamente il testo già visibile all'interno del pulsante stesso.
3. **Encoding:** File salvato con encoding errato causando corruzione dei caratteri accentati ("è", "à").
- **File:** `src/features/auth/PaywallPage.jsx`

### Soluzione
In attesa di correzione da parte di The Artist: sostituire i `<button>` di navigazione con tag `<a>` (con le stesse classi CSS) e rimuovere gli `aria-label` superflui, salvando il file in UTF-8.

### Regola di Prevenzione
> ⚠️ **REGOLA:**
> - Usa SEMPRE tag `<a>` (o `<Link>`) per la navigazione e i collegamenti esterni/mailto. Non usare MAI `<button>` con `window.location.href`. Puoi stilizzare il tag `<a>` per farlo apparire come un bottone usando le classi CSS.
> - Non aggiungere `aria-label` a elementi che possiedono già testo visibile e descrittivo, per evitare ridondanze negli screen reader.
> - Controllare sempre l'encoding UTF-8 dei file quando si usano caratteri speciali o accentati nel testo in italiano.

---

## 2026-06-09 — Vulnerabilità Critiche SQL e Cast Fragili su Viste

**Agente responsabile:** The Engine
**Identificato da:** The Critic
**Categoria:** Backend / Database / Sicurezza

### Contesto
Ispezione finale delle migrazioni e degli schemi Supabase (`supabase_schema.sql`).

### Errore
1. **Esposizione Totale dei Dati:** Presenza di `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` su tutte le tabelle principali (`salon_settings`, `staff`, `clients`, ecc.). Questo espone tutto lo schema ad accessi non autorizzati e annulla le policy RLS.
2. **Sintassi inesatta per security invoker:** L'uso di `WITH (security_invoker = true)` anziché `WITH (security_invoker = on)`. La Knowledge Base richiede esplicitamente `on`.
3. **Crash della Vista (Type Cast Fragile):** Nella vista `monthly_revenue`, la conversione `date::date` su un campo `date` di tipo `text` è fragile. Se il db contiene una riga con data malformata o vuota, la view andrà in crash irreversibile (Type Error postgres).
- **File:** `supabase_schema.sql`

### Soluzione
In attesa di correzione da parte di The Engine: tutte le occorrenze di `DISABLE ROW LEVEL SECURITY` devono essere sostituite con `ENABLE ROW LEVEL SECURITY`. Il cast deve essere reso sicuro (gestito lato app o sistemando il formato del DB). La vista deve usare `security_invoker = on`.

### Regola di Prevenzione
> ⚠️ **REGOLA:**
> - Mai utilizzare `DISABLE ROW LEVEL SECURITY` nei file schema principali per velocizzare lo sviluppo, poiché espone i dati e introduce vulnerabilità critiche. Utilizzare SEMPRE `ENABLE ROW LEVEL SECURITY`.
> - Rispettare in modo pedissequo la sintassi `security_invoker = on` per le viste Postgres.
> - Evitare cast di tipi fragili (`string::date`) all'interno di viste SQL se il formato stringa non è rigorosamente validato a monte, per prevenire il crash totale della view.

---

## 2026-06-09 — RLS senza Policy (Deny-All), Date Regex fallace e Mancanza di Multi-Tenant

**Agente responsabile:** The Engine
**Identificato da:** The Critic
**Categoria:** Backend / Database / Sicurezza

### Contesto
Re-ispezione finale delle migrazioni e degli schemi Supabase (`supabase_schema.sql`).

### Errore
1. **Blocco Applicazione (Deny-All):** RLS è stato abilitato su tutte le tabelle ma non sono state definite le relative policy `CREATE POLICY`. Questo causa un "deny-all" di default che rompe ogni fetch del frontend.
2. **Regex Date Fallace:** L'uso della regex `^\d{4}-\d{2}-\d{2}$` non garantisce che la data esista (es. `2024-02-30` passa ma rompe il cast `date::date`).
3. **Mancato Isolamento (Multi-Tenant):** Le tabelle principali (`appointments`, `clients`, ecc.) non hanno la colonna `user_id`, rendendo impossibile isolare i dati tramite RLS per singolo utente.
- **File:** `supabase_schema.sql`

### Soluzione
In attesa di correzione da parte di The Engine: aggiungere `user_id` uuid in tutte le tabelle. Creare policy CRUD in cui `auth.uid() = user_id`. Gestire la data convertendo il tipo o tramite safe function plpgsql.

### Regola di Prevenzione
> ⚠️ **REGOLA:**
> - Non abilitare mai RLS senza creare le relative Policy (`CREATE POLICY`), altrimenti si genera un Deny-All che rompe il sistema.
> - Se l'app è multi-utente, ogni tabella di dati generati deve avere un riferimento al proprietario (es. `user_id` UUID) per isolare i record.
> - Non usare regex per validare date; usa il tipo nativo `DATE` di Postgres oppure una funzione SQL `safe_cast_to_date` che cattura l'eccezione.

---

## 2026-06-10 — Accessibilità Incompleta in Menu Custom (Combobox Pattern)

**Agente responsabile:** The Artist
**Identificato da:** The Critic
**Categoria:** Frontend / Accessibilità

### Contesto
Creazione di un componente `CustomSelect` in sostituzione dei select nativi.

### Errore
1. **Focus Screen Reader:** L'attributo `aria-activedescendant` era impostato su `<ul>` (listbox) ma il focus restava sul `<button>`. Gli screen reader non leggevano le opzioni.
2. **Collegamento Semantico:** Mancava `aria-controls` sul bottone e `id` sul listbox.
3. **ID Duplicati:** La prop `id` non aveva un fallback sicuro (causando id come `undefined-option-0`).

### Soluzione
Applicato il pattern "Select-Only Combobox": `role="combobox"` sul bottone, spostato `aria-activedescendant`, aggiunto `aria-controls`, e usato `useId()` come fallback.

### Regola di Prevenzione
> ⚠️ **REGOLA:**
> - Quando si crea un Select custom, usare sempre il pattern **Select-Only Combobox**: il `<button>` trigger deve avere `role="combobox"` e `aria-activedescendant` mantenendo il focus del DOM.
> - Collegare il trigger e il menu tramite `aria-controls` e `id`.
> - Fornire un fallback sicuro per gli ID usando `useId()` per prevenire duplicazioni.

---

## 2026-06-09 — Bug Idempotenza (Viste) e Performance (Indici RLS)

**Agente responsabile:** The Engine
**Identificato da:** The Critic
**Categoria:** Backend / Database / Performance

### Contesto
Ispezione delle correzioni in `supabase_schema.sql` (Aggiunta multi-tenant e RLS).

### Errore
1. **Idempotenza Fallita (Viste):** Nello script di migrazione idempotente, è stato inserito `DROP TABLE IF EXISTS appointments` senza droppare prima la vista `monthly_revenue` che dipendeva da esso, causando un crash di Postgres (`cannot drop table appointments because other objects depend on it`).
2. **Crollo delle Performance (Mancanza Indici RLS):** È stata implementata l'RLS con check su `auth.uid() = user_id`, ma senza creare gli indici (INDEX) sulla colonna `user_id` per ogni tabella. Questo causa Full Table Scan continui a ogni lettura dell'app.
- **File:** `supabase_schema.sql`

### Soluzione
In attesa di correzione da parte di The Engine: inserire `DROP VIEW IF EXISTS public.monthly_revenue;` prima dei DROP TABLE. Aggiungere istruzioni `CREATE INDEX` per la colonna `user_id` in tutte le tabelle.

### Regola di Prevenzione
> ⚠️ **REGOLA:**
> - Quando si creano script SQL idempotenti che includono viste, assicurarsi SEMPRE di usare `DROP VIEW IF EXISTS` prima di droppare le tabelle da cui la vista dipende, altrimenti PostgreSQL andrà in errore.
> - Le colonne utilizzate frequentemente nelle policy RLS (come `user_id` per il multi-tenant) richiedono **INDICI ESPLICITI** (`CREATE INDEX`) per evitare full table scan che distruggono le performance dell'app.

---

## 2026-06-10 — Bug Logico e Memory Leak nel Polling (useEffect) e A11y

**Agente responsabile:** The Artist
**Identificato da:** The Critic
**Categoria:** Frontend / Performance / UI/UX / Accessibilità

### Contesto
Implementazione di un meccanismo di polling asincrono per l'attesa della conferma di pagamento da Stripe sulla pagina `PaywallPage.jsx`.

### Errore
1. **Memory Leak / Infinite Loop:** L'hook `useEffect` dipendeva dallo stato `profile` o da funzioni rigenerate a ogni render (come `refreshProfile`). Senza un adeguato `clearTimeout` nel cleanup, si creavano infiniti timer e interval zombie, saturando il browser e non risolvendo mai lo stato di caricamento.
2. **Accessibilità (Icone SVG):** Le icone `lucide-react` venivano renderizzate senza l'attributo `aria-hidden="true"`, creando potenziale rumore per gli screen reader.

### Soluzione
The Critic ha respinto il codice. La correzione applicata prevede di isolare le dipendenze al solo parametro URL `searchParams.get('success')`, includere `clearInterval` e `clearTimeout` nel blocco `return () => {}` di cleanup, e aggiungere `aria-hidden="true"` a tutti i componenti icona SVG decorativi.

### Regola di Prevenzione
> ⚠️ **REGOLA:**
> - Quando si impostano timer (`setTimeout` o `setInterval`) all'interno di un `useEffect`, è **OBBLIGATORIO** salvarne i riferimenti e distruggerli (`clearTimeout`, `clearInterval`) nella funzione di cleanup restituita.
> - Attenzione estrema all'array di dipendenze nei `useEffect` che eseguono chiamate asincrone: non includere mai stati generati internamente (es. funzioni di contesto non memorizzate o l'oggetto restituito) se questo causa cicli infiniti.
> - Le icone SVG decorative (es. da `lucide-react`) DEVONO sempre avere l'attributo `aria-hidden="true"` per conformità all'accessibilità.

---

## 2026-06-10 — Webhook Rifiutato da Supabase (401 UNAUTHORIZED_NO_AUTH_HEADER)

**Agente responsabile:** The Engine / Orchestratore
**Identificato da:** Log di Stripe
**Categoria:** Backend / Supabase Edge Functions / Sicurezza

### Contesto
Deploy dell'Edge Function `stripe-webhook` per ascoltare gli eventi di pagamento da Stripe.

### Errore
Supabase per impostazione predefinita protegge tutte le Edge Functions richiedendo un header `Authorization: Bearer <JWT>`. Poiché i webhook (come Stripe) sono chiamate server-to-server anonime e sicure tramite firma crittografica (`Stripe-Signature`), non inviano un JWT. Supabase bloccava la chiamata restituendo `401 Missing authorization header` prima ancora che la funzione potesse eseguire la logica di verifica.

### Soluzione
Il deploy della funzione deve essere effettuato esplicitamente disabilitando il controllo JWT tramite il flag `--no-verify-jwt` o configurando `supabase/config.toml`.

### Regola di Prevenzione
> ⚠️ **REGOLA:**
> - Qualsiasi Edge Function progettata per fungere da **Webhook di terze parti** (es. Stripe, GitHub, ecc.) DEVE essere deployata con il parametro `--no-verify-jwt`.
> - Mai disabilitare il JWT su funzioni che servono dati direttamente al client frontend, farlo *solo* per i webhook server-to-server validati crittograficamente.

---

## 2026-06-10 — Errore Webhook Stripe (Key length is zero)

**Agente responsabile:** L'utente / Ambiente
**Identificato da:** Log di Stripe
**Categoria:** Backend / Variabili d'ambiente / Crittografia

### Contesto
Ricezione di un webhook legittimo da Stripe e tentativo di verifica della firma (Signature) tramite `stripe.webhooks.constructEventAsync`.

### Errore
Stripe Webhook Dashboard riporta un errore `400 Bad Request` con un JSON in risposta: `{"error": "Key length is zero"}`.
Questo errore è lanciato internamente dal `SubtleCryptoProvider` di Stripe (o di Deno) quando il parametro `secret` passato alla funzione di verifica è una stringa vuota `""` o `undefined`. 
Questo significa invariabilmente che la variabile d'ambiente `STRIPE_WEBHOOK_SECRET` non è stata impostata nel cloud provider (Supabase) o non è stata letta correttamente, portando la costante al valore di fallback vuoto.

### Soluzione
Eseguire il comando di upload dei secrets: `npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...` con la chiave esatta ricavata dalla dashboard dei Webhook di Stripe.

### Regola di Prevenzione
> ⚠️ **REGOLA:**
> - Se `constructEvent` di Stripe lancia `"Key length is zero"`, **non è un problema di codice**, ma significa categoricamente che manca la chiave segreta del webhook (o è vuota). Verificare sempre il deploy dei secrets.

---

## 2026-06-10 — Mancanza di Affordance e ARIA Incompleta in Scroll Orizzontali

**Agente responsabile:** The Architect (fase di pianificazione) / The Artist
**Identificato da:** The Critic
**Categoria:** Frontend / Accessibilità / UI/UX

### Contesto
Progettazione del componente `.date-selector-tabs` con scroll orizzontale nativo per mobile, nascondendo la scrollbar per motivi estetici.

### Errore
1. **Accessibilità (ARIA) incompleta**: L'uso di `role="tablist"` e `role="tab"` è stato proposto senza implementare la gestione del focus e la navigazione da tastiera, violando le WAI-ARIA.
2. **Scorrimento e Visibilità**: Con lo scroll orizzontale, la data selezionata poteva trovarsi fuori viewport (invisibile all'utente) senza un auto-scroll che la riportasse al centro.
3. **Affordance dello scorrimento**: Nascondendo la scrollbar nativa senza aggiungere cue visivi, l'utente perdeva la percezione che l'elemento fosse scrollabile.
- **File:** `src/features/calendar/CalendarView.jsx`, `src/features/calendar/Calendar.css`

### Soluzione
Piano corretto per utilizzare ruoli ARIA meno esigenti (es. `role="group"` e `aria-pressed`) se non si vuole implementare il complex tab focus, per includere un `scrollIntoView` sull'elemento attivo tramite `useEffect`, e per aggiungere cue visivi (come il taglio parziale dell'ultimo elemento) per l'affordance.

### Regola di Prevenzione
> - Quando si implementano scroll orizzontali senza scrollbar nativa, è obbligatorio: 1) implementare l'auto-scroll all'elemento attivo (`scrollIntoView`), 2) garantire affordance visiva dello scroll (es. elementi parzialmente tagliati o edge gradient) e 3) supportare integralmente la navigazione da tastiera se si usano ruoli ARIA specifici (come `tablist`/`tab`), oppure fare un fallback a ruoli più semplici (`group`).

---

## 2026-06-10 — Difetto Layout: Padding Errato su Bottom Navbar

**Agente responsabile:** The Artist
**Identificato da:** The Critic
**Categoria:** Frontend / UI/UX / Layout

### Contesto
Implementazione di una Bottom Navigation Bar mobile (fissata in basso) e adattamento del main content padding.

### Errore
1. **Padding di Compensazione Errato**: In `index.css`, è stato lasciato `padding-top: 5rem` su `.main-content`, sebbene la navbar fosse diventata una bottom bar (`bottom: 0`). Questo lasciava spazio vuoto in cima e nascondeva i contenuti in fondo sotto la barra di navigazione.
- **File:** `src/index.css`

### Soluzione
Rimuovere `padding-top` e impostare un `padding-bottom` calcolato per includere sia l'altezza della navbar sia la safe area di iOS (`calc(5.5rem + env(safe-area-inset-bottom, 1rem))`).

### Regola di Prevenzione
> ⚠️ **REGOLA:**
> - Assicurarsi che il padding di compensazione sul layout principale corrisponda sempre alla posizione della navbar mobile (top vs bottom). Se la navbar è posizionata `fixed` in basso, si deve utilizzare `padding-bottom` e **NON** `padding-top`, calcolandolo in modo da evitare che i contenuti finiscano sotto la UI di navigazione.
