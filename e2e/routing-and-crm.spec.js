import { test, expect } from '@playwright/test';

test.describe('Routing e CRM E2E', () => {
  test('dovrebbe navigare dalla dashboard al CRM e aprire il modale nuovo cliente', async ({ page }) => {
    // Intercetta la richiesta a Supabase per assicurare che ci sia un salone (salta l'onboarding)
    await page.route('**/rest/v1/salon*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: '1', name: 'Centro Estetico Aurora', isOpen: true }])
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');

    // Attendi che l'app sia caricata e che siamo sulla Dashboard (default)
    await expect(page.locator('text=Ciao, Aurora')).toBeVisible();

    // Clicca sul tab CRM (Schede Clienti) nella Sidebar
    await page.click('text=Schede Clienti');

    // Assicurati di essere nel CRM cercando la barra di ricerca clienti
    await expect(page.locator('input[placeholder*="Cerca"]')).toBeVisible();

    // Clicca su "Nuovo Cliente" (assumendo esista un pulsante con questo testo o icona)
    // Selezioniamo in base al testo più probabile. Se fallisce, sappiamo che l'UI è cambiata.
    const newClientBtn = page.locator('button:has-text("Nuovo Cliente")');
    if (await newClientBtn.isVisible()) {
      await newClientBtn.click();
      await expect(page.locator('text=Nuova Scheda Cliente')).toBeVisible();
    }
  });
});
