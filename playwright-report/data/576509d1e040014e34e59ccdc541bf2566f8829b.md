# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: treatment-history.spec.js >> Storico Trattamenti E2E >> dovrebbe completare un appuntamento e aggiornare lo storico
- Location: e2e\treatment-history.spec.js:5:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Calendario Salone')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Calendario Salone')

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
  4  | test.describe('Storico Trattamenti E2E', () => {
  5  |   test('dovrebbe completare un appuntamento e aggiornare lo storico', async ({ page }) => {
  6  |     await loginE2E(page);
  7  |     // Come sopra, saltiamo l'onboarding
  8  |     await page.route('**/rest/v1/salon*', async route => {
  9  |       if (route.request().method() === 'GET') {
  10 |         await route.fulfill({
  11 |           status: 200,
  12 |           contentType: 'application/json',
  13 |           body: JSON.stringify([{ id: '1', name: 'Centro Estetico Aurora', isOpen: true }])
  14 |         });
  15 |       } else {
  16 |         await route.continue();
  17 |       }
  18 |     });
  19 | 
  20 |     await page.goto('/calendar');
  21 | 
  22 |     // Aspettiamo che il calendario sia visibile
> 23 |     await expect(page.locator('text=Calendario Salone')).toBeVisible();
     |                                                          ^ Error: expect(locator).toBeVisible() failed
  24 | 
  25 |     // In un vero test E2E qui cliccheremmo "Completa" su un appuntamento mockato
  26 |     // Poiché React Query potrebbe fetchare appuntamenti vuoti, simuliamo solo il render
  27 |     // per non rompere il test con dati dinamici
  28 |     const completeBtn = page.locator('button:has-text("✓ Completa")').first();
  29 |     if (await completeBtn.isVisible()) {
  30 |       await completeBtn.click();
  31 |       // Navighiamo al CRM per verificare
  32 |       await page.click('text=Schede Clienti');
  33 |       await expect(page.locator('text=Clienti')).toBeVisible();
  34 |     }
  35 |   });
  36 | });
  37 | 
```