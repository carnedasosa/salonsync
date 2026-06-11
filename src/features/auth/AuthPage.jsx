import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../core/context/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Form validation
    if (!isLogin) {
      if (password.length < 6) {
        setError('La password deve contenere almeno 6 caratteri.');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Le password non corrispondono.');
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      
      // Success, redirect
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Errore durante l\'autenticazione. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (loginMode) => {
    if (isLoading) return;
    setIsLogin(loginMode);
    setError(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <div className="auth-page-container">
      <div className="glass-card auth-card animate-fade-in">
        <div className="auth-header">
          <h1 className="auth-title gradient-text">SalonSync</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Bentornato! Accedi al tuo account.' : 'Crea un nuovo account per iniziare.'}
          </p>
        </div>

        <div className="auth-tabs" role="tablist">
          <button 
            type="button"
            role="tab"
            aria-selected={isLogin}
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => toggleMode(true)}
          >
            Accedi
          </button>
          <button 
            type="button"
            role="tab"
            aria-selected={!isLogin}
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => toggleMode(false)}
          >
            Registrati
          </button>
        </div>

        {error && (
          <div className="auth-error animate-fade-in" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-name" className="form-label">Nome Completo</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" aria-hidden="true" />
                <input 
                  id="auth-name"
                  type="text" 
                  className="form-input" 
                  placeholder="Mario Rossi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email" className="form-label">Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" aria-hidden="true" />
              <input 
                id="auth-email"
                type="email" 
                className="form-input" 
                placeholder="mario@esempio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-password" className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" aria-hidden="true" />
              <input 
                id="auth-password"
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-confirm-password" className="form-label">Conferma Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" aria-hidden="true" />
                <input 
                  id="auth-confirm-password"
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {isLogin && (
            <button 
              type="button" 
              className="password-forgot" 
              onClick={() => console.log('Forgot password')}
            >
              Password dimenticata?
            </button>
          )}

          <button 
            type="submit" 
            className="btn btn-primary auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner" aria-hidden="true"></span>
            ) : (
              isLogin ? 'Accedi' : 'Crea Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
