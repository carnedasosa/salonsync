/**
 * mockSalon.js
 * Unica fonte di verità per la configurazione del salone.
 * In produzione, questi dati verrebbero caricati da un'API
 * in base all'account autenticato.
 */

export const mockSalon = {
  id: 'salon_1',
  name: "Aurora's Beauty Lab",
  ownerName: 'Aurora Ferretti',
  phone: '02 1234 5678',
  address: 'Via Bellezza 12, Milano',
  openHour: 9,   // usato dal calendario
  closeHour: 20, // usato dal calendario
  currency: '€',
  isOpen: true,
  brand: {
    primaryColor: '#ec4899',
  },
};

/**
 * Staff del salone — fa parte della configurazione del salone,
 * non dei dati operativi (clienti/appuntamenti).
 * Spostato da mockData.js.
 */
export const mockStaff = [
  { id: 'st1', name: 'Aurora', role: 'Estetista', color: '#c77dff' },
];
