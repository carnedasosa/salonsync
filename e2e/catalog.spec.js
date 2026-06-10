import { test, expect } from '@playwright/test';

test.describe('Catalog E2E', () => {
  test('eliminazione di un servizio dal listino', async ({ page }) => {
    // Navigare sull'app e andare su Listino & Scorte
    await page.goto('http://localhost:5173');
    await page.click('text=Listino & Scorte');

    // Verificare che la pagina Listino sia caricata
    await expect(page.locator('text=Nuovo Trattamento')).toBeVisible();

    // Simulare l'inserimento di un "Servizio Test"
    await page.click('text=Nuovo Trattamento');
    await expect(page.locator('text=Aggiungi Nuovo Trattamento a Listino')).toBeVisible();

    // Compilare i campi
    await page.fill('input[placeholder="es. Laminazione Ciglia Superiori"]', 'Servizio Test');
    await page.fill('input[placeholder="es. 45"]', '50');
    await page.fill('input[placeholder="es. 60"]', '60');
    await page.fill('input[placeholder="Tempo per pulire la postazione"]', '10');
    await page.selectOption('select.form-select', 'Viso');

    // Confermare l'aggiunta
    await page.click('button:has-text("Aggiungi a Listino")');

    // Verificare che il modal sia chiuso e il servizio appaia in tabella
    await expect(page.locator('text=Servizio Test')).toBeVisible();

    // Trovare la riga che contiene "Servizio Test" e cliccare l'icona di eliminazione
    const row = page.locator('tr').filter({ hasText: 'Servizio Test' });
    await row.locator('.delete-btn').click();

    // Confermare l'eliminazione nella modale
    await expect(page.locator('text=Sei sicuro di voler eliminare questo servizio?')).toBeVisible();
    await page.click('button:has-text("Elimina")'); // confirmText is 'Elimina'

    // Verificare che il "Servizio Test" non sia più presente nella tabella
    await expect(page.locator('text=Servizio Test')).not.toBeVisible();
  });
});
