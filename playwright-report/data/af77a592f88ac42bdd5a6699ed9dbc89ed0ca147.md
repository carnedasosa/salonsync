# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding.spec.js >> Onboarding Flow >> should display onboarding when no salon exists and submit form
- Location: e2e\onboarding.spec.js:5:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected substring: "Benvenuta su salonSync"
Received string:    "Account in attesa di approvazione"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1')
    13 × locator resolved to <h1 class="paywall-title">Account in attesa di approvazione</h1>
       - unexpected value "Account in attesa di approvazione"

```

```yaml
- heading "Account in attesa di approvazione" [level=1]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { loginE2E } from './loginHelper.js';
  3  | 
  4  | test.describe('Onboarding Flow', () => {
  5  |   test('should display onboarding when no salon exists and submit form', async ({ page }) => {
  6  |     // Intercetta la richiesta a Supabase per simulare che non esista alcun salone
  7  |     await page.route('**/rest/v1/salon*', async route => {
  8  |       if (route.request().method() === 'GET') {
  9  |         await route.fulfill({
  10 |           status: 200,
  11 |           contentType: 'application/json',
  12 |           body: JSON.stringify([])
  13 |         });
  14 |       } else if (route.request().method() === 'POST' || route.request().method() === 'PATCH') {
  15 |         // Simula il salvataggio con successo
  16 |         await route.fulfill({
  17 |           status: 201,
  18 |           contentType: 'application/json',
  19 |           body: JSON.stringify([{ id: 1, name: 'Centro Estetico Aurora' }])
  20 |         });
  21 |       } else {
  22 |         await route.continue();
  23 |       }
  24 |     });
  25 | 
  26 |     await loginE2E(page);
  27 | 
  28 |     // Verifica che appaia l'onboarding
> 29 |     await expect(page.locator('h1')).toContainText('Benvenuta su salonSync');
     |                                      ^ Error: expect(locator).toContainText(expected) failed
  30 | 
  31 |     // Compila il form
  32 |     await page.fill('input[placeholder="Es. Centro Estetico Aurora"]', 'Centro Estetico Aurora');
  33 |     await page.fill('input[type="email"]', 'info@aurora.it');
  34 |     await page.fill('input[type="tel"]', '3331234567');
  35 | 
  36 |     // Clicca submit
  37 |     await page.click('button[type="submit"]');
  38 | 
  39 |     // Verifica che il pulsante vada in stato di caricamento (disabled)
  40 |     await expect(page.locator('button[type="submit"]')).toBeDisabled();
  41 |   });
  42 | });
  43 | 
```