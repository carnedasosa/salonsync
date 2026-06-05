// Dati finti realistici per salonSync

export const mockServices = [
  { id: 's1', name: 'Manicure Semipermanente', category: 'Unghie', price: 35, duration: 45, buffer: 10, color: '#e0aaff' },
  { id: 's2', name: 'Ricostruzione Unghie in Gel', category: 'Unghie', price: 65, duration: 90, buffer: 15, color: '#c77dff' },
  { id: 's3', name: 'Trattamento Viso Acido Glicolico', category: 'Viso', price: 60, duration: 50, buffer: 10, color: '#9d4edd' },
  { id: 's4', name: 'Pulizia del Viso Ultrasuoni', category: 'Viso', price: 45, duration: 60, buffer: 10, color: '#7b2cbf' },
  { id: 's5', name: 'Massaggio Drenante Linfatico', category: 'Corpo', price: 70, duration: 60, buffer: 15, color: '#5a189a' },
  { id: 's6', name: 'Laminazione Ciglia e Tinta', category: 'Sguardo', price: 50, duration: 60, buffer: 10, color: '#3c096c' },
  { id: 's7', name: 'Epilazione Total Body', category: 'Corpo', price: 80, duration: 75, buffer: 15, color: '#240046' }
];

export const mockStaff = [
  { id: 'st1', name: 'Aurora', role: 'Estetista', color: '#c77dff' }
];

export const mockProducts = [
  { id: 'p1', name: 'Olio Cuticole al Limone 15ml', category: 'Unghie', stock: 12, minStock: 5, price: 12.90 },
  { id: 'p2', name: 'Base Gel Extra Hold 50ml', category: 'Unghie', stock: 3, minStock: 4, price: 39.00 }, // Sotto scorta
  { id: 'p3', name: 'Siero Acido Ialuronico 3% 100ml', category: 'Viso', stock: 8, minStock: 3, price: 45.00 },
  { id: 'p4', name: 'Crema Massaggio Rassodante 500ml', category: 'Corpo', stock: 2, minStock: 2, price: 55.00 },
  { id: 'p5', name: 'Gel Detergente Delicato 250ml', category: 'Viso', stock: 15, minStock: 5, price: 18.50 },
  { id: 'p6', name: 'Tinta Ciglia Nera 15ml', category: 'Sguardo', stock: 1, minStock: 3, price: 14.90 } // Sotto scorta
];

export const mockClients = [
  {
    id: 'c1',
    name: 'Alessia Marini',
    email: 'alessia.marini@email.it',
    phone: '345 6789 012',
    birthday: '1994-05-12',
    skinType: 'Mista / Sensibile',
    allergies: 'Acrilati (sensibilità a gel acidi), Nichel',
    generalNotes: 'Preferisce tonalità nude per le mani. Molto attenta alla limatura dei lati. Tende a rilassarsi durante i trattamenti viso, predilige silenzio.',
    treatmentHistory: [
      {
        id: 'th1_1',
        date: '2026-05-20',
        serviceName: 'Manicure Semipermanente',
        operatorName: 'Aurora',
        notes: 'Applicata base Rubber per unghie fragili. Colore: Nude Opaco (codice Shellac 212 + 104 in doppio strato). Nessuna reazione allergica registrata con base acida soft. Cuticole trattate con olio al limone.',
        price: 35,
        beforePhoto: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=400&h=300&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&h=300&q=80'
      },
      {
        id: 'th1_2',
        date: '2026-04-15',
        serviceName: 'Pulizia del Viso Ultrasuoni',
        operatorName: 'Aurora',
        notes: 'Pulizia profonda con ultrasuoni. Utilizzato siero lenitivo alla calendula per evitare rossori dovuti alla pelle sensibile. Applicata maschera all\'argilla bianca solo sulla zona T.',
        price: 45,
        beforePhoto: '',
        afterPhoto: ''
      }
    ]
  },
  {
    id: 'c2',
    name: 'Chiara Rossi',
    email: 'chiara.rossi@gmail.com',
    phone: '333 9876 543',
    birthday: '1989-11-23',
    skinType: 'Secca',
    allergies: 'Profumi sintetici nelle creme',
    generalNotes: 'Adora nail art geometriche. Utilizzare solo prodotti della linea Bio-Sensitive.',
    treatmentHistory: [
      {
        id: 'th2_1',
        date: '2026-05-28',
        serviceName: 'Ricostruzione Unghie in Gel',
        operatorName: 'Aurora',
        notes: 'Allungamento con cartina forma Mandorla. Gel costruttore bifasico ipoallergenico. French manicure disegnata a mano libera. Nail art con microglitter dorati su anulari.',
        price: 65,
        beforePhoto: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=400&h=300&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&h=300&q=80'
      }
    ]
  },
  {
    id: 'c3',
    name: 'Giulia Bianchi',
    email: 'giuliabianchi92@hotmail.it',
    phone: '329 1112 233',
    birthday: '1992-08-04',
    skinType: 'Mista',
    allergies: 'Nessuna',
    generalNotes: 'Sempre puntuale. Esegue laminazione ciglia ogni 6 settimane con costanza.',
    treatmentHistory: [
      {
        id: 'th3_1',
        date: '2026-05-10',
        serviceName: 'Laminazione Ciglia e Tinta',
        operatorName: 'Aurora',
        notes: 'Curvatura L-Lift per ciglia naturalmente dritte. Tempo di posa Step 1: 10 minuti, Step 2: 8 minuti. Tinta blu-black tenuta 5 minuti per effetto mascara. Trattamento cheratina finale.',
        price: 50,
        beforePhoto: '',
        afterPhoto: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=400&h=300&q=80'
      }
    ]
  },
  {
    id: 'c4',
    name: 'Elena Esposito',
    email: 'elena.esposito@live.it',
    phone: '347 5556 789',
    birthday: '2001-03-30',
    skinType: 'Acneica / Grassa',
    allergies: 'Acido Salicilico ad alte concentrazioni',
    generalNotes: 'Pelle estremamente reattiva. Evitare strizzature manuali eccessive.',
    treatmentHistory: [
      {
        id: 'th4_1',
        date: '2026-05-15',
        serviceName: 'Trattamento Viso Acido Glicolico',
        operatorName: 'Aurora',
        notes: 'Applicato acido glicolico al 20% tampone pH 4.5. Tempo di posa ridotto a 3 minuti causa leggero pizzicore iniziale. Neutralizzato abbondantemente con lozione al bicarbonato. Lenitivo finale all\'ossido di zinco.',
        price: 60,
        beforePhoto: '',
        afterPhoto: ''
      }
    ]
  },
  {
    id: 'c5',
    name: 'Federica Moretti',
    email: 'fede.moretti@yahoo.com',
    phone: '338 4445 556',
    birthday: '1985-07-19',
    skinType: 'Matura',
    allergies: 'Lanolina',
    generalNotes: 'Predilige massaggi vigorosi ed epilazione con cera all\'ossido di zinco (pelle molto chiara).',
    treatmentHistory: []
  }
];

export const mockAppointments = [
  {
    id: 'a1',
    clientId: 'c1',
    clientName: 'Alessia Marini',
    serviceId: 's1',
    serviceName: 'Manicure Semipermanente',
    operatorId: 'st1',
    operatorName: 'Aurora',
    date: '2026-06-05', // Oggi
    time: '09:30',
    duration: 45,
    buffer: 10,
    price: 35,
    status: 'completed'
  },
  {
    id: 'a2',
    clientId: 'c2',
    clientName: 'Chiara Rossi',
    serviceId: 's2',
    serviceName: 'Ricostruzione Unghie in Gel',
    operatorId: 'st1',
    operatorName: 'Aurora',
    date: '2026-06-05', // Oggi
    time: '11:00',
    duration: 90,
    buffer: 15,
    price: 65,
    status: 'confirmed'
  },
  {
    id: 'a3',
    clientId: 'c3',
    clientName: 'Giulia Bianchi',
    serviceId: 's6',
    serviceName: 'Laminazione Ciglia e Tinta',
    operatorId: 'st1',
    operatorName: 'Aurora',
    date: '2026-06-05', // Oggi
    time: '14:30',
    duration: 60,
    buffer: 10,
    price: 50,
    status: 'confirmed'
  },
  {
    id: 'a4',
    clientId: 'c4',
    clientName: 'Elena Esposito',
    serviceId: 's3',
    serviceName: 'Trattamento Viso Acido Glicolico',
    operatorId: 'st1',
    operatorName: 'Aurora',
    date: '2026-06-05', // Oggi
    time: '16:00',
    duration: 50,
    buffer: 10,
    price: 60,
    status: 'confirmed'
  },
  {
    id: 'a5',
    clientId: 'c5',
    clientName: 'Federica Moretti',
    serviceId: 's5',
    serviceName: 'Massaggio Drenante Linfatico',
    operatorId: 'st1',
    operatorName: 'Aurora',
    date: '2026-06-06', // Domani
    time: '10:00',
    duration: 60,
    buffer: 15,
    price: 70,
    status: 'confirmed'
  },
  {
    id: 'a6',
    clientId: 'c1',
    clientName: 'Alessia Marini',
    serviceId: 's3',
    serviceName: 'Trattamento Viso Acido Glicolico',
    operatorId: 'st1',
    operatorName: 'Aurora',
    date: '2026-06-08', // Settimana prossima
    time: '15:00',
    duration: 50,
    buffer: 10,
    price: 60,
    status: 'confirmed'
  }
];

export const mockRevenueHistory = [
  { month: 'Gen', revenue: 3200, appointments: 72 },
  { month: 'Feb', revenue: 3800, appointments: 85 },
  { month: 'Mar', revenue: 4100, appointments: 90 },
  { month: 'Apr', revenue: 4500, appointments: 102 },
  { month: 'Mag', revenue: 5600, appointments: 124 },
  { month: 'Giu', revenue: 2150, appointments: 48 } // Mese corrente in corso
];
