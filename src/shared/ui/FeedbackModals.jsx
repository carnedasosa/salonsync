import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useModal } from '../../core/context/ModalContext';

/**
 * ConfirmActionModal
 * Modale di avviso distruttivo con Glassmorphism
 */
export function ConfirmActionModal({ title, message, onConfirm, confirmText = "Sì, continua", cancelText = "Annulla" }) {
  const { closeModal } = useModal();

  return (
    <div className="modal-overlay animate-fade-in" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="modal-content animate-slide-up" style={{ 
        maxWidth: '400px', 
        textAlign: 'center', 
        padding: '2.5rem 2rem',
        background: 'rgba(30, 41, 59, 0.85)', // var(--bg-card) slightly transparent
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            background: 'rgba(249, 115, 22, 0.1)', 
            color: '#F97316', 
            padding: '1rem', 
            borderRadius: '50%' 
          }}>
            <AlertTriangle size={36} />
          </div>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          {title}
        </h3>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn btn-secondary" 
            onClick={closeModal}
            style={{ flex: 1 }}
          >
            {cancelText}
          </button>
          
          <button 
            className="btn" 
            onClick={() => {
              onConfirm();
            }}
            style={{ 
              flex: 1, 
              background: 'var(--danger)', 
              color: 'white', 
              border: 'none' 
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * SuccessFeedbackModal
 * Modale di feedback di successo con icona Check, si chiude in automatico dopo X ms
 */
export function SuccessFeedbackModal({ title, message, autoCloseMs = 2000 }) {
  const { closeModal } = useModal();

  useEffect(() => {
    if (autoCloseMs > 0) {
      const timer = setTimeout(() => {
        closeModal();
      }, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [autoCloseMs, closeModal]);

  return (
    <div className="modal-overlay animate-fade-in" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="modal-content animate-slide-up" style={{ 
        maxWidth: '350px', 
        textAlign: 'center', 
        padding: '3rem 2rem',
        background: 'rgba(30, 41, 59, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            color: '#059669', // Emerald 600
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}>
            <CheckCircle size={64} strokeWidth={1.5} />
          </div>
        </div>

        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: message ? '0.5rem' : '0' }}>
          {title}
        </h3>
        
        {message && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
