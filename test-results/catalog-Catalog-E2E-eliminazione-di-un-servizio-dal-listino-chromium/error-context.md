# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: catalog.spec.js >> Catalog E2E >> eliminazione di un servizio dal listino
- Location: e2e\catalog.spec.js:5:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Listino & Scorte')

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
  4  | test.describe('Catalog E2E', () => {
  5  |   test('eliminazione di un servizio dal listino', async ({ page }) => {
  6  |     await loginE2E(page);
> 7  |     await page.click('text=Catalogo');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  8  | 
  9  |     // Verificare che la pagina Listino sia caricata
  10 |     await expect(page.locator('text=Nuovo Servizio')).toBeVisible();
  11 | 
  12 |     // Simulare l'inserimento di un "Servizio Test"
  13 |     await page.click('text=Nuovo Servizio');
  14 |     await expect(page.locator('text=Nuovo Servizio')).toBeVisible();
  15 | 
  16 |     // Compilare i campi
  17 |     await page.fill('input[placeholder="es. Laminazione Ciglia Superiori"]', 'Servizio Test');
  18 |     await page.fill('input[placeholder="es. 45"]', '50');
  19 |     await page.fill('input[placeholder="es. 60"]', '60');
  20 |     await page.fill('input[placeholder="Tempo per pulire la postazione"]', '10');
  21 |     await page.selectOption('select.form-select', 'Viso');
  22 | 
  23 |     // Confermare l'aggiunta
  24 |     await page.click('button:has-text("Salva")');
  25 | 
  26 |     // Verificare che il modal sia chiuso e il servizio appaia in tabella
  27 |     await expect(page.locator('text=Servizio Test')).toBeVisible();
  28 | 
  29 |     // Trovare la riga che contiene "Servizio Test" e cliccare l'icona di eliminazione
  30 |     const row = page.locator('tr').filter({ hasText: 'Servizio Test' });
  31 |     await row.locator('.delete-btn').click();
  32 | 
  33 |     // Confermare l'eliminazione nella modale
  34 |     await expect(page.locator('text=Sei sicuro di voler eliminare questo servizio?')).toBeVisible();
  35 |     await page.click('button:has-text("Elimina")'); // confirmText is 'Elimina'
  36 | 
  37 |     // Verificare che il "Servizio Test" non sia più presente nella tabella
  38 |     await expect(page.locator('text=Servizio Test')).not.toBeVisible();
  39 |   });
  40 | });
  41 | 
```