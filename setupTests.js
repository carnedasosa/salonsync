import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Pulisce il DOM di jsdom dopo ogni test
afterEach(() => {
  cleanup();
});
