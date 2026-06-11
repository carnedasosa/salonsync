import { test, expect } from '@playwright/test';
import { loginE2E } from './loginHelper.js';

test.describe('Appuntamenti E2E', () => {
  test('dovrebbe poter aprire il modale per un nuovo appuntamento', async ({ page }) => {
    await loginE2E(page);

    // Clicca sul tab Calendario nella Sidebar
    await page.click('text=Calendario');

    // Assicurati che l'app sia caricata vedendo il titolo del calendario
    await expect(page.locator('text=Calendario Salone')).toBeVisible();

    // Clicca sul pulsante "Nuova Prenotazione"
    await page.click('text=Nuova Prenotazione');

    // Verifica che il modale sia aperto
    await expect(page.locator('text=Nuova Prenotazione Appuntamento')).toBeVisible();
    
    // Chiudi il modale
    await page.click('.modal-close');
    
    // Verifica che il modale sia chiuso
    await expect(page.locator('text=Nuova Prenotazione Appuntamento')).not.toBeVisible();
  });
});
