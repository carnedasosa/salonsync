/**
 * CatalogContext.jsx
 * Gestisce il listino servizi, i prodotti e le scorte di magazzino.
 * Modificato per utilizzare Supabase e React Query.
 */
import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { mockServices, mockProducts } from '../data/mockData';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const queryClient = useQueryClient();

  // Fetch Services
  const { data: services, isLoading: servicesLoading, error: servicesError } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch Products
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addServiceMutation = useMutation({
    mutationFn: async (newService) => {
      const { id, ...serviceData } = newService;
      const { error } = await supabase.from('services').insert([serviceData]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] })
  });

  const addProductMutation = useMutation({
    mutationFn: async (newProduct) => {
      const { id, ...productData } = newProduct;
      const { error } = await supabase.from('products').insert([productData]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ prodId, amount }) => {
      const currentProducts = queryClient.getQueryData(['products']);
      const product = currentProducts?.find(p => p.id === prodId);
      if (!product) throw new Error("Product not found");
      
      const newStock = Math.max(0, product.stock + amount);
      const { error } = await supabase.from('products').update({ stock: newStock }).eq('id', prodId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  });

  const addService = (newService) => addServiceMutation.mutateAsync(newService);
  const addProduct = (newProduct) => addProductMutation.mutateAsync(newProduct);
  const updateStock = (prodId, amount) => updateStockMutation.mutateAsync({ prodId, amount });

  return (
    <CatalogContext.Provider value={{ 
      services: services || [], 
      products: products || [], 
      addService, 
      addProduct, 
      updateStock,
      isLoading: servicesLoading || productsLoading
    }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog deve essere usato dentro <CatalogProvider>');
  return ctx;
}
