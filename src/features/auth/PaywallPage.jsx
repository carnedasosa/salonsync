import React from 'react';
import { Lock, Mail, CreditCard, ArrowRight } from 'lucide-react';
import './PaywallPage.css';

export default function PaywallPage() {
  return (
    <div className="paywall-container">
      <div className="glass-card paywall-card animate-fade-in">
        <div className="paywall-icon-wrapper">
          <Lock size={40} />
        </div>
        
        <h1 className="paywall-title">Account in attesa di approvazione</h1>
        
        <p className="paywall-description">
          Il tuo account è stato creato con successo, ma al momento si trova in stato di <strong>sospensione</strong>. 
          Per sbloccare l'accesso a tutte le funzionalità di salonSync, scegli una delle seguenti opzioni.
        </p>

        <div className="paywall-actions">
          <a 
            href="#abbonamento" 
            className="btn btn-primary paywall-btn-subscribe"
          >
            <CreditCard size={18} />
            Sottoscrivi un Abbonamento
            <ArrowRight size={18} />
          </a>
          
          <a 
            href="mailto:support@salonsync.it" 
            className="btn btn-secondary paywall-btn-support"
          >
            <Mail size={18} />
            Contatta l'Assistenza
          </a>
        </div>
      </div>
    </div>
  );
}