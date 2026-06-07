/**
 * CatalogContext.jsx
 * Gestisce il listino servizi, i prodotti e le scorte di magazzino.
 */
import React, { createContext, useContext } from 'react';
import { mockServices, mockProducts } from '../data/mockData';
import useLocalStorage from '../hooks/useLocalStorage';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [services, setServices] = useLocalStorage('services', mockServices);
  const [products, setProducts] = useLocalStorage('products', mockProducts);

  /** Aggiunge un nuovo servizio al listino. */
  const addService = (newService) =>
    setServices((prev) => [...prev, newService]);

  /** Aggiunge un nuovo prodotto al magazzino. */
  const addProduct = (newProduct) =>
    setProducts((prev) => [...prev, newProduct]);

  /**
   * Aggiorna le scorte di un prodotto.
   * @param {string} prodId - ID del prodotto
   * @param {number} amount - Delta positivo (ricarico) o negativo (vendita)
   */
  const updateStock = (prodId, amount) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === prodId
          ? { ...p, stock: Math.max(0, p.stock + amount) }
          : p
      )
    );
  };

  return (
    <CatalogContext.Provider value={{ services, products, addService, addProduct, updateStock }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog deve essere usato dentro <CatalogProvider>');
  return ctx;
}
