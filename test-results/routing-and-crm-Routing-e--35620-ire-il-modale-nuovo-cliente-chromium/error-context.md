# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: routing-and-crm.spec.js >> Routing e CRM E2E >> dovrebbe navigare dalla dashboard al CRM e aprire il modale nuovo cliente
- Location: e2e\routing-and-crm.spec.js:5:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Ciao, Aurora')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Ciao, Aurora')

```

```yaml
- button "Torna al Login"
- heading "Account in attesa di approvazione" [level=1]
- paragraph:
  - text: Il tuo account è stato creato con successo, ma al momento si trova in stato di
  - strong: sospensione
  - text: . Per sbloccare l'accesso a tutte le funzionalità di salonSync, scegli una delle seguenti opzioni.
- button "Sottoscrivi un Abbonamento"
- link "Contatta l'Assistenza":
  - /url: mailto:support@salonsync.it
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { loginE2E } from './loginHelper.js';
  3  | 
  4  | test.describe('Routing e CRM E2E', () => {
  5  |   test('dovrebbe navigare dalla dashboard al CRM e aprire il modale nuovo cliente', async ({ page }) => {
  6  |     await loginE2E(page);
  7  |     
  8  |     // Intercetta la richiesta a Supabase per assicurare che ci sia un salone (salta l'onboarding)
  9  |     await page.route('**/rest/v1/salon*', async route => {
  10 |       if (route.request().method() === 'GET') {
  11 |         await route.fulfill({
  12 |           status: 200,
  13 |           contentType: 'application/json',
  14 |           body: JSON.stringify([{ id: '1', name: 'Centro Estetico Aurora', isOpen: true }])
  15 |         });
  16 |       } else {
  17 |         await route.continue();
  18 |       }
  19 |     });
  20 | 
  21 |     await page.goto('/');
  22 | 
  23 |     // Attendi che l'app sia caricata e che siamo sulla Dashboard (default)
> 24 |     await expect(page.locator('text=Ciao, Aurora')).toBeVisible();
     |                                                     ^ Error: expect(locator).toBeVisible() failed
  25 | 
  26 |     // Clicca sul tab CRM (Schede Clienti) nella Sidebar
  27 |     await page.click('text=Schede Clienti');
  28 | 
  29 |     // Assicurati di essere nel CRM cercando la barra di ricerca clienti
  30 |     await expect(page.locator('input[placeholder*="Cerca"]')).toBeVisible();
  31 | 
  32 |     // Clicca su "Nuovo Cliente" (assumendo esista un pulsante con questo testo o icona)
  33 |     // Selezioniamo in base al testo più probabile. Se fallisce, sappiamo che l'UI è cambiata.
  34 |     const newClientBtn = page.locator('button:has-text("Nuovo Cliente")');
  35 |     if (await newClientBtn.isVisible()) {
  36 |       await newClientBtn.click();
  37 |       await expect(page.locator('text=Nuova Scheda Cliente')).toBeVisible();
  38 |     }
  39 |   });
  40 | });
  41 | 
```