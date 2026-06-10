---
name: salonSync
description: Un gestionale moderno e minimale per saloni di bellezza.
colors:
  primary: "#0f172a"
  primary-light: "#334155"
  primary-deep: "#000000"
  primary-cta: "#1e293b"
  neutral-bg: "#f8fafc"
  neutral-card: "#ffffff"
  neutral-glass: "rgba(255, 255, 255, 0.95)"
  text-main: "#0f172a"
  text-sub: "#64748b"
  text-muted: "#94a3b8"
  border-glass: "#e2e8f0"
  success: "#10b981"
  warning: "#f59e0b"
  danger: "#ef4444"
  info: "#3b82f6"
typography:
  display:
    fontFamily: "'Playfair Display', serif"
    fontWeight: 600
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Inter', sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Inter', sans-serif"
    fontWeight: 600
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.25rem"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.8)"
    textColor: "{colors.text-main}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.25rem"
  button-danger:
    backgroundColor: "rgba(239, 68, 68, 0.15)"
    textColor: "{colors.danger}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.25rem"
---

# Design System: salonSync

## 1. Overview

**Creative North Star: "The Minimalist Salon"**

Questo design system si basa sull'estrema chiarezza operativa e sulla riduzione assoluta del rumore visivo. L'ambiente è dominato da tanto spazio bianco e superfici vetrate, dove il colore interviene solo per guidare l'attenzione sui dati essenziali o sulle azioni primarie. Rifugge categoricamente le interfacce affollate tipiche dei gestionali legacy, prediligendo un approccio arioso, professionale e chirurgicamente preciso.

**Key Characteristics:**
- Estrema pulizia visiva e ampio uso di spazio negativo.
- Focus chirurgico: le interazioni sono precise e reattive.
- Sospeso e arioso: uso di ombre tenui e glassmorphism leggero.

## 2. Colors

La palette è costruita su una base di bianchi, grigi chiari e accenti nero/antracite per definire l'identità visiva e l'interazione.

### Primary
- **Black / Slate 900** (#0f172a): Il colore principale per azioni e pulsanti importanti. Porta energia senza appesantire.
- **Deep Black** (#000000): Usato per stati hover e accenti profondi.
- **Slate 800** (#1e293b): Un accento complementare per hover secondari.
- **Slate 700** (#334155): Usato per accenti leggeri.

### Neutral
- **Black Text** (#0f172a): Il colore principale per il testo. Molto più neutro e pulito del nero puro.
- **Gray Text** (#64748b): Testo secondario, etichette e testi di supporto.
- **Slate 50 Bg** (#f8fafc): Il background tecnico e rassicurante su cui fluttuano le card.
- **Light Gray Border** (#e2e8f0): Bordi leggermente tinti di grigio per separare i contenitori bianchi.

**The Focus Rule.** Il colore deciso (nero/antracite) va usato esclusivamente dove serve l'azione dell'utente o per evidenziare i dati chiave. Il resto è spazio vuoto o vetro.

## 3. Typography

**Display Font:** 'Playfair Display', serif
**Body Font:** 'Inter', sans-serif

**Character:** Un equilibrio sofisticato. Il Playfair Display conferisce l'eleganza editoriale e premium tipica dei saloni di alto livello, mentre l'Inter assicura leggibilità assoluta e precisione tecnica per i dati e la UI.

### Hierarchy
- **Display** (600, fluid): Titoli principali e saluti. Da usare con parsimonia.
- **Body** (400, 1rem, 1.5): Testo principale, dati della tabella, contenuti standard.
- **Label** (600, 0.75rem-0.85rem, uppercase, 0.05em): Elementi di navigazione, badge, intestazioni di tabella e piccoli indicatori di stato.

**The Functional Serif Rule.** Il serif (Playfair) si usa solo ed esclusivamente per grandi intestazioni (h1-h6). Tutto il testo operativo, i bottoni e i dati devono utilizzare il font sans-serif (Inter).

## 4. Elevation

Sospeso e arioso. Le card sembrano fluttuare su una superficie chiara grazie a ombre grigie neutre.

### Shadow Vocabulary
- **Main Float** (`0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.03)`): Applicato alle card principali per staccarle dallo sfondo senza appesantire.
- **Hover Lift** (`0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)`): Usato al passaggio del mouse per le card interattive.

**The Float Rule.** Gli elementi interattivi (card, modal) si sollevano ulteriormente sull'hover, non si schiacciano verso il basso.

## 5. Components

I componenti sono precisi e reattivi: curve definite (14px), risposte immediate al click e un focus chirurgico sulle azioni.

### Buttons
- **Shape:** Arrotondati in modo netto ma non a pillola (14px).
- **Primary:** Sfondo Slate 900 solido, testo bianco.
- **Hover / Focus:** Transizione netta, traslazione in alto (-1px) e ombra incrementata.
- **Secondary:** Fondo chiaro con testo nero.

### Cards / Containers
- **Corner Style:** Radius generoso e definito (20px per le macro-aree).
- **Background:** Effetto vetro molto leggero (95% bianco) con sfocatura retrostante (8px).
- **Border:** Bordo grigio chiaro per definire i limiti senza appesantire.
- **Shadow Strategy:** Main Float per simulare galleggiamento.

### Inputs / Fields
- **Style:** Sfondo bianco opaco (90%), bordo in vetro.
- **Focus:** Niente bagliori fuori controllo, ma uno shift del bordo verso Slate 900 e un'ombra interna netta (`inset 0 0 0 1px`). Precise e reattive.

### Badges / Status Chips
- **Style:** Sfondi molto leggeri (15% opacità del colore base) con testo saturo e bordi sottili al 20%. Lettere in maiuscoletto molto spaziate.

## 6. Do's and Don'ts

### Do:
- **Do** usare ampi margini vuoti per separare le sezioni; lascia respirare i dati.
- **Do** mantenere le ombre grigie e neutre. Un'ombra scura rovinerebbe la pulizia ariosa.
- **Do** assicurarti che il contrasto del testo sui bottoni sia elevato.

### Don't:
- **Don't** sovraccaricare la UI; nascondi o metti in secondo piano le funzionalità secondarie.
- **Don't** usare gradienti colorati; la palette si fonda su bianchi, grigi e neri.
- **Don't** utilizzare il font Serif (Playfair) per form, tabelle o piccoli bottoni; perderebbe in leggibilità e precisione.
