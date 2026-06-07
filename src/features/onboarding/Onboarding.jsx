import React, { useState } from 'react';
import { useSalon } from '../../core/context/SalonContext';
import { Building, Mail, Phone, ArrowRight } from 'lucide-react';
import './Onboarding.css';

export default function Onboarding() {
  const { updateSalon } = useSalon();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessHours: { "Lunedì": "Chiuso", "Martedì-Venerdì": "09:00 - 19:00", "Sabato": "09:00 - 18:00" },
    themeColors: { primary: "#000000" }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateSalon(formData);
    } catch (err) {
      console.error(err);
      alert('Errore durante il salvataggio');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1>Benvenuta su salonSync ✨</h1>
        <p>Configura il tuo salone per iniziare.</p>
        
        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group">
            <label><Building size={16} /> Nome del Salone</label>
            <input 
              required
              type="text" 
              placeholder="Es. Centro Estetico Aurora"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label><Mail size={16} /> Email</label>
            <input 
              required
              type="email" 
              placeholder="info@tuosalone.it"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label><Phone size={16} /> Telefono</label>
            <input 
              required
              type="tel" 
              placeholder="333 1234567"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Salvataggio...' : 'Inizia a usare salonSync'} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
