import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('Supabase Edge Functions Security', () => {
  
  it('stripe-webhook should prevent "Key length is zero" error by explicitly checking STRIPE_WEBHOOK_SECRET', () => {
    const webhookPath = path.resolve(__dirname, '../../supabase/functions/stripe-webhook/index.ts');
    expect(fs.existsSync(webhookPath)).toBe(true);
    
    const code = fs.readFileSync(webhookPath, 'utf8');
    
    // Check that it verifies the secret is not empty BEFORE calling constructEventAsync
    expect(code).toMatch(/if\s*\(!\s*[\w_]+\s*\)/);
    expect(code).toMatch(/Deno\.env\.get\('STRIPE_WEBHOOK_SECRET'\)/);
    
    // Ensure the old vulnerable pattern is NOT present
    const vulnerablePattern = /constructEventAsync\([\s\S]*?Deno\.env\.get\('STRIPE_WEBHOOK_SECRET'\)\s*\|\|\s*''/i;
    expect(code).not.toMatch(vulnerablePattern);
  });

  it('create-checkout should strictly require Authorization header', () => {
    const checkoutPath = path.resolve(__dirname, '../../supabase/functions/create-checkout/index.ts');
    expect(fs.existsSync(checkoutPath)).toBe(true);
    
    const code = fs.readFileSync(checkoutPath, 'utf8');
    
    // Check that it explicitly checks for authHeader
    expect(code).toMatch(/req\.headers\.get\('Authorization'\)/i);
    expect(code).toMatch(/if\s*\(!authHeader\)/i);
  });
});
