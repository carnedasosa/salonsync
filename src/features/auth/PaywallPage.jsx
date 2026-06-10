import React, { useState, useEffect } from 'react';
import { Lock, Mail, CreditCard, ArrowRight, Loader } from 'lucide-react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../core/supabaseClient';
import { useAuth } from '../../core/context/AuthContext';
import './PaywallPage.css';

export default function PaywallPage() {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { session, profile, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true' && profile?.status !== 'active') {
      setVerifying(true);
      // Poll to check if webhook updated the status
      const interval = setInterval(async () => {
        if (refreshProfile) {
          await refreshProfile();
        }
      }, 2000);
      
      // timeout after 15 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setVerifying(false);
      }, 15000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [searchParams.get('success')]);

  useEffect(() => {
    if (profile?.status === 'active') {
      navigate('/');
    }
  }, [profile, navigate]);

  const handleSubscribe = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL di checkout non ricevuto');
      }
    } catch (err) {
      console.error('Errore checkout:', err);
      alert("Si è verificato un errore durante l'inizializzazione del pagamento.");
      setLoading(false);
    }
  };

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="paywall-container">
      <div className="glass-card paywall-card animate-fade-in">
        <div className="paywall-icon-wrapper">
          <Lock size={40} aria-hidden="true" />
        </div>
        
        <h1 className="paywall-title">
          {verifying ? 'Verifica pagamento...' : 'Account in attesa di approvazione'}
        </h1>
        
        <p className="paywall-description">
          {verifying 
            ? 'Stiamo attendendo la conferma del pagamento da Stripe. Potrebbe volerci qualche secondo...'
            : <>Il tuo account è stato creato con successo, ma al momento si trova in stato di <strong>sospensione</strong>. Per sbloccare l'accesso a tutte le funzionalità di salonSync, scegli una delle seguenti opzioni.</>}
        </p>

        <div className="paywall-actions">
          <button 
            type="button"
            className="btn btn-primary paywall-btn-subscribe"
            onClick={handleSubscribe}
            disabled={loading || verifying}
          >
            {(loading || verifying) ? (
              <Loader size={18} className="spinner" aria-hidden="true" />
            ) : (
              <CreditCard size={18} aria-hidden="true" />
            )}
            {loading ? 'Reindirizzamento...' : verifying ? 'In attesa...' : 'Sottoscrivi un Abbonamento'}
            {!(loading || verifying) && <ArrowRight size={18} aria-hidden="true" />}
          </button>
          
          <a 
            href="mailto:support@salonsync.it" 
            className="btn btn-secondary paywall-btn-support"
          >
            <Mail size={18} aria-hidden="true" />
            Contatta l'Assistenza
          </a>
        </div>
      </div>
    </div>
  );
}
