export async function loginE2E(page) {
  await page.goto('http://localhost:5173/auth');
  await page.getByRole('tab', { name: 'Accedi' }).click();
  await page.getByLabel('Email').fill('e2e@salonsync.test');
  await page.fill('#auth-password', 'password123'); // specific ID to avoid ambiguity
  await page.getByRole('button', { name: 'Accedi' }).click();
  // Wait for redirect to dashboard or onboarding
  await page.waitForURL(/.*\/(dashboard|onboarding)/, { timeout: 10000 });
}
