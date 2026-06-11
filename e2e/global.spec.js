import { test, expect } from '@playwright/test';
import { loginE2E } from './loginHelper.js';

test.describe('Global Booking Flow', () => {
  test('Complete flow: Auth -> CRM -> Catalog -> Calendar', async ({ page }) => {
    await loginE2E(page);

    // 2. Navigazione al CRM per creare cliente
    await page.getByRole('link', { name: 'Clienti' }).click();
    await expect(page).toHaveURL(/.*\/crm/);
    
    // Clicchiamo "Nuovo Cliente" (se esiste un pulsante)
    const newClientBtn = page.getByRole('button', { name: /Nuovo Cliente/i });
    if (await newClientBtn.isVisible()) {
      await newClientBtn.click();
      await page.getByLabel('Nome').fill('Cliente E2E');
      await page.getByLabel('Telefono').fill('1234567890');
      await page.getByRole('button', { name: /Salva/i }).click();
    }

    // 3. Navigazione al Catalog per verificare il servizio
    await page.getByRole('link', { name: 'Catalogo' }).click();
    await expect(page).toHaveURL(/.*\/catalog/);
    // Supponiamo esista un servizio base chiamato "Taglio"

    // 4. Navigazione al Calendario per la prenotazione
    await page.getByRole('link', { name: 'Calendario' }).click();
    await expect(page).toHaveURL(/.*\/calendar/);

    // Clicchiamo su un orario libero (simulato) o su "Nuovo Appuntamento"
    const newAptBtn = page.getByRole('button', { name: /Nuovo Appuntamento/i });
    if (await newAptBtn.isVisible()) {
      await newAptBtn.click();
      // Cerchiamo e selezioniamo Cliente E2E
      await page.getByLabel(/Cerca cliente/i).fill('Cliente E2E');
      await page.getByText('Cliente E2E').first().click();
      
      // Salvataggio Appuntamento
      await page.getByRole('button', { name: /Conferma/i }).click();
      
      // Assicuriamoci che non ci siano errori a schermo
      await expect(page.getByRole('alert')).not.toBeVisible();
    }
  });
});
