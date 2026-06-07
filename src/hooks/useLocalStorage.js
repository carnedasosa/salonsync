/**
 * useLocalStorage.js
 * Hook personalizzato che si comporta come useState, ma
 * sincronizza automaticamente il valore con localStorage.
 *
 * - Al primo render, carica il valore salvato (se esiste).
 * - Ad ogni aggiornamento, scrive in localStorage.
 * - Se il dato in localStorage è corrotto, usa il fallback.
 */
import { useState, useEffect } from 'react';

const STORAGE_PREFIX = 'salonSync_';

export default function useLocalStorage(key, initialValue) {
  const prefixedKey = STORAGE_PREFIX + key;

  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(prefixedKey);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      // Dato corrotto — riparti dal fallback
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(prefixedKey, JSON.stringify(value));
    } catch {
      // Storage pieno o non disponibile — ignora silenziosamente
    }
  }, [prefixedKey, value]);

  return [value, setValue];
}
