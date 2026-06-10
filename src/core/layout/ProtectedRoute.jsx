import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Caricamento autenticazione...</div>;
  }

  if (!session) {
    // Redirige all'autenticazione, salvando la location per il redirect post-login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Se l'utente è loggato ma non ha uno status 'active', lo mandiamo al Paywall
  // Blocchiamo anche chi non ha alcun profilo (es. vecchi utenti creati prima del trigger)
  if (!profile || profile.status !== 'active') {
    return <Navigate to="/paywall" replace />;
  }

  return children;
}
