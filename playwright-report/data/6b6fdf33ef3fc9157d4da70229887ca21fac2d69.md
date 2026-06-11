# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global.spec.js >> Global Booking Flow >> Complete flow: Auth -> CRM -> Catalog -> Calendar
- Location: e2e\global.spec.js:5:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Clienti' })

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
  4  | test.describe('Global Booking Flow', () => {
  5  |   test('Complete flow: Auth -> CRM -> Catalog -> Calendar', async ({ page }) => {
  6  |     await loginE2E(page);
  7  | 
  8  |     // 2. Navigazione al CRM per creare cliente
> 9  |     await page.getByRole('link', { name: 'Clienti' }).click();
     |                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  10 |     await expect(page).toHaveURL(/.*\/crm/);
  11 |     
  12 |     // Clicchiamo "Nuovo Cliente" (se esiste un pulsante)
  13 |     const newClientBtn = page.getByRole('button', { name: /Nuovo Cliente/i });
  14 |     if (await newClientBtn.isVisible()) {
  15 |       await newClientBtn.click();
  16 |       await page.getByLabel('Nome').fill('Cliente E2E');
  17 |       await page.getByLabel('Telefono').fill('1234567890');
  18 |       await page.getByRole('button', { name: /Salva/i }).click();
  19 |     }
  20 | 
  21 |     // 3. Navigazione al Catalog per verificare il servizio
  22 |     await page.getByRole('link', { name: 'Catalogo' }).click();
  23 |     await expect(page).toHaveURL(/.*\/catalog/);
  24 |     // Supponiamo esista un servizio base chiamato "Taglio"
  25 | 
  26 |     // 4. Navigazione al Calendario per la prenotazione
  27 |     await page.getByRole('link', { name: 'Calendario' }).click();
  28 |     await expect(page).toHaveURL(/.*\/calendar/);
  29 | 
  30 |     // Clicchiamo su un orario libero (simulato) o su "Nuovo Appuntamento"
  31 |     const newAptBtn = page.getByRole('button', { name: /Nuovo Appuntamento/i });
  32 |     if (await newAptBtn.isVisible()) {
  33 |       await newAptBtn.click();
  34 |       // Cerchiamo e selezioniamo Cliente E2E
  35 |       await page.getByLabel(/Cerca cliente/i).fill('Cliente E2E');
  36 |       await page.getByText('Cliente E2E').first().click();
  37 |       
  38 |       // Salvataggio Appuntamento
  39 |       await page.getByRole('button', { name: /Conferma/i }).click();
  40 |       
  41 |       // Assicuriamoci che non ci siano errori a schermo
  42 |       await expect(page.getByRole('alert')).not.toBeVisible();
  43 |     }
  44 |   });
  45 | });
  46 | 
```