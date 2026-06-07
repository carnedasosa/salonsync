/**
 * ErrorBoundary.jsx
 * Cattura errori JavaScript nei componenti figli e mostra
 * un'interfaccia di fallback invece di uno schermo bianco.
 *
 * Nota: le Error Boundaries in React devono essere class component.
 * Questo è l'unico caso in cui usiamo una classe nel progetto.
 */
import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[salonSync] Errore catturato da ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback">
          <div className="error-boundary-card">
            <div className="error-icon">⚠️</div>
            <h2>Qualcosa è andato storto</h2>
            <p className="error-message">
              {this.state.error?.message || 'Errore sconosciuto'}
            </p>
            <p className="error-hint">
              Prova a ricaricare la sezione. Se il problema persiste, ricarica la pagina.
            </p>
            <button className="btn btn-primary" onClick={this.handleReset}>
              Riprova
            </button>
          </div>

          <style>{`
            .error-boundary-fallback {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 400px;
              padding: 2rem;
              animation: fadeIn 0.3s ease;
            }

            .error-boundary-card {
              background: rgba(255, 255, 255, 0.85);
              backdrop-filter: blur(16px);
              border: 1px solid rgba(239, 68, 68, 0.2);
              border-radius: 16px;
              padding: 2.5rem;
              text-align: center;
              max-width: 420px;
              box-shadow: 0 8px 32px rgba(239, 68, 68, 0.08);
            }

            .error-icon {
              font-size: 3rem;
              margin-bottom: 1rem;
            }

            .error-boundary-card h2 {
              font-family: var(--font-display, 'Inter', sans-serif);
              font-size: 1.4rem;
              color: var(--text-main, #1a1a2e);
              margin-bottom: 0.75rem;
            }

            .error-message {
              font-size: 0.85rem;
              color: var(--danger, #ef4444);
              background: rgba(239, 68, 68, 0.08);
              padding: 0.5rem 1rem;
              border-radius: 8px;
              margin-bottom: 0.75rem;
              font-family: monospace;
              word-break: break-word;
            }

            .error-hint {
              font-size: 0.9rem;
              color: var(--text-sub, #64748b);
              margin-bottom: 1.5rem;
            }

            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
