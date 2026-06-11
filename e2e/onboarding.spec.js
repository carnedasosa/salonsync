import { test, expect } from '@playwright/test';
import { loginE2E } from './loginHelper.js';

test.describe('Onboarding Flow', () => {
  test('should display onboarding when no salon exists and submit form', async ({ page }) => {
    // Intercetta la richiesta a Supabase per simulare che non esista alcun salone
    await page.route('**/rest/v1/salon*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else if (route.request().method() === 'POST' || route.request().method() === 'PATCH') {
        // Simula il salvataggio con successo
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 1, name: 'Centro Estetico Aurora' }])
        });
      } else {
        await route.continue();
      }
    });

    await loginE2E(page);

    // Verifica che appaia l'onboarding
    await expect(page.locator('h1')).toContainText('Benvenuta su salonSync');

    // Compila il form
    await page.fill('input[placeholder="Es. Centro Estetico Aurora"]', 'Centro Estetico Aurora');
    await page.fill('input[type="email"]', 'info@aurora.it');
    await page.fill('input[type="tel"]', '3331234567');

    // Clicca submit
    await page.click('button[type="submit"]');

    // Verifica che il pulsante vada in stato di caricamento (disabled)
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});
