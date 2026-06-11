import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('Database Schema Security and Best Practices', () => {
  const schemaPath = path.resolve(__dirname, '../../supabase_schema.sql');
  const schemaContent = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf8') : '';

  it('should have user_id column in all main tables for Multi-Tenant isolation', () => {
    const tables = ['salon_settings', 'staff', 'clients', 'services', 'products', 'appointments', 'treatments_history'];
    tables.forEach(table => {
      // Look for the CREATE TABLE statement and check if user_id is present inside it
      const createTableRegex = new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}[^;]+;`, 'i');
      const match = schemaContent.match(createTableRegex);
      expect(match, `Table ${table} is missing or misconfigured`).not.toBeNull();
      
      const hasUserId = /user_id\s+uuid/i.test(match[0]);
      expect(hasUserId, `Table ${table} is missing 'user_id' column for Multi-Tenant isolation`).toBe(true);
    });
  });

  it('should explicitly ENABLE ROW LEVEL SECURITY on all tables and NOT DISABLE it', () => {
    expect(schemaContent).not.toMatch(/DISABLE ROW LEVEL SECURITY/i);
    
    const tables = ['salon_settings', 'staff', 'clients', 'services', 'products', 'appointments', 'treatments_history'];
    tables.forEach(table => {
      const enableRlsRegex = new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY;`, 'i');
      expect(schemaContent).toMatch(enableRlsRegex);
    });
  });

  it('should have RLS policies defined for all tables to prevent deny-all', () => {
    const tables = ['salon_settings', 'staff', 'clients', 'services', 'products', 'appointments', 'treatments_history'];
    tables.forEach(table => {
      const policyRegex = new RegExp(`CREATE POLICY.*ON public\\.${table}`, 'i');
      expect(schemaContent).toMatch(policyRegex);
    });
  });

  it('should have index on user_id for all tables to prevent full table scans on RLS', () => {
    const tables = ['salon_settings', 'staff', 'clients', 'services', 'products', 'appointments', 'treatments_history'];
    tables.forEach(table => {
      const indexRegex = new RegExp(`CREATE INDEX.*ON public\\.${table}.*\\(\\s*user_id\\s*\\)`, 'i');
      expect(schemaContent).toMatch(indexRegex);
    });
  });

  it('should correctly define view monthly_revenue with security_invoker = on', () => {
    const viewRegex = /CREATE OR REPLACE VIEW public\.monthly_revenue WITH \(security_invoker = on\)/i;
    expect(schemaContent).toMatch(viewRegex);
  });

  it('should NOT use dangerous type cast date::date in monthly_revenue view', () => {
    // The cast should be replaced by a safe function or use DATE type
    const viewDefinitionMatch = schemaContent.match(/CREATE OR REPLACE VIEW public\.monthly_revenue[\s\S]*?;/i);
    if (viewDefinitionMatch) {
      expect(viewDefinitionMatch[0]).not.toMatch(/date::date/i);
    }
  });

  it('should drop view monthly_revenue before dropping appointments table to preserve idempotency', () => {
    const dropViewIndex = schemaContent.indexOf('DROP VIEW IF EXISTS public.monthly_revenue;');
    const dropTableIndex = schemaContent.indexOf('DROP TABLE IF EXISTS public.appointments;');
    
    // drop view must exist and be before drop table
    expect(dropViewIndex).not.toBe(-1);
    expect(dropTableIndex).not.toBe(-1);
    expect(dropViewIndex).toBeLessThan(dropTableIndex);
  });

  it('should have a update_stock RPC function for safe atomic updates', () => {
    const rpcRegex = /CREATE OR REPLACE FUNCTION public\.update_stock/i;
    expect(schemaContent).toMatch(rpcRegex);
  });
});
