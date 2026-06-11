# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: appointments.spec.js >> Appuntamenti E2E >> dovrebbe poter aprire il modale per un nuovo appuntamento
- Location: e2e\appointments.spec.js:5:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Calendario')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - button "Torna al Login" [ref=e4] [cursor=pointer]:
    - img [ref=e5]
    - generic [ref=e7]: Torna al Login
  - generic [ref=e8]:
    - img [ref=e10]
    - heading "Account in attesa di approvazione" [level=1] [ref=e13]
    - paragraph [ref=e14]:
      - text: Il tuo account è stato creato con successo, ma al momento si trova in stato di
      - strong [ref=e15]: sospensione
      - text: . Per sbloccare l'accesso a tutte le funzionalità di salonSync, scegli una delle seguenti opzioni.
    - generic [ref=e16]:
      - button "Sottoscrivi un Abbonamento" [ref=e17] [cursor=pointer]:
        - img [ref=e18]
        - text: Sottoscrivi un Abbonamento
        - img [ref=e20]
      - link "Contatta l'Assistenza" [ref=e22] [cursor=pointer]:
        - /url: mailto:support@salonsync.it
        - img [ref=e23]
        - text: Contatta l'Assistenza
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { loginE2E } from './loginHelper.js';
  3  | 
  4  | test.describe('Appuntamenti E2E', () => {
  5  |   test('dovrebbe poter aprire il modale per un nuovo appuntamento', async ({ page }) => {
  6  |     await loginE2E(page);
  7  | 
  8  |     // Clicca sul tab Calendario nella Sidebar
> 9  |     await page.click('text=Calendario');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  10 | 
  11 |     // Assicurati che l'app sia caricata vedendo il titolo del calendario
  12 |     await expect(page.locator('text=Calendario Salone')).toBeVisible();
  13 | 
  14 |     // Clicca sul pulsante "Nuova Prenotazione"
  15 |     await page.click('text=Nuova Prenotazione');
  16 | 
  17 |     // Verifica che il modale sia aperto
  18 |     await expect(page.locator('text=Nuova Prenotazione Appuntamento')).toBeVisible();
  19 |     
  20 |     // Chiudi il modale
  21 |     await page.click('.modal-close');
  22 |     
  23 |     // Verifica che il modale sia chiuso
  24 |     await expect(page.locator('text=Nuova Prenotazione Appuntamento')).not.toBeVisible();
  25 |   });
  26 | });
  27 | 
```