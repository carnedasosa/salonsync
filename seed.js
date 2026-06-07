import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envLocalPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) envVars[match[1].trim()] = match[2].trim();
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('🌱 Inizio il seeding...');

    // 1. Inserisci 5 Clienti
    const { data: clients, error: clientsError } = await supabase.from('clients').insert([
        { name: 'Giulia Rossi', email: 'giulia.rossi@email.com', phone: '3331234567', "skinType": 'Mista' },
        { name: 'Marco Bianchi', email: 'marco.bianchi@email.com', phone: '3337654321', "skinType": 'Secca' },
        { name: 'Anna Verdi', email: 'anna.verdi@email.com', phone: '3339876543', "skinType": 'Grassa' },
        { name: 'Luca Neri', email: 'luca.neri@email.com', phone: '3334567890', "skinType": 'Sensibile' },
        { name: 'Sofia Gialli', email: 'sofia.gialli@email.com', phone: '3336549870', "skinType": 'Normale' }
    ]).select();

    if (clientsError) throw new Error(clientsError.message);
    console.log('✅ Inseriti 5 clienti');

    // 2. Inserisci 2 Operatrici
    const { data: staff, error: staffError } = await supabase.from('staff').insert([
        { name: 'Elena', role: 'Estetista', color: '#ffb3ba' },
        { name: 'Martina', role: 'Massaggiatrice', color: '#baffc9' }
    ]).select();

    if (staffError) throw new Error(staffError.message);
    console.log('✅ Inserite 2 operatrici');

    // 3. Inserisci 4 Tipi di Servizi
    const { data: services, error: servicesError } = await supabase.from('services').insert([
        { name: 'Pulizia Viso', category: 'Viso', price: 50, duration: 60, buffer: 15, color: '#bae1ff' },
        { name: 'Massaggio Rilassante', category: 'Corpo', price: 70, duration: 60, buffer: 15, color: '#ffffba' },
        { name: 'Manicure', category: 'Mani e Piedi', price: 25, duration: 30, buffer: 10, color: '#ffdfba' },
        { name: 'Pedicure', category: 'Mani e Piedi', price: 35, duration: 45, buffer: 10, color: '#e6e6fa' }
    ]).select();

    if (servicesError) throw new Error(servicesError.message);
    console.log('✅ Inseriti 4 servizi');

    // 4. Inserisci 4 Appuntamenti
    const today = new Date().toISOString().split('T')[0];

    const { data: appointments, error: apptError } = await supabase.from('appointments').insert([
        {
            "clientId": clients[0].id, "clientName": clients[0].name,
            "serviceId": services[0].id, "serviceName": services[0].name,
            "operatorId": staff[0].id, "operatorName": staff[0].name,
            date: today, time: '10:00', duration: services[0].duration, buffer: services[0].buffer,
            price: services[0].price, status: 'confirmed'
        },
        {
            "clientId": clients[1].id, "clientName": clients[1].name,
            "serviceId": services[1].id, "serviceName": services[1].name,
            "operatorId": staff[1].id, "operatorName": staff[1].name,
            date: today, time: '11:30', duration: services[1].duration, buffer: services[1].buffer,
            price: services[1].price, status: 'pending'
        },
        {
            "clientId": clients[2].id, "clientName": clients[2].name,
            "serviceId": services[2].id, "serviceName": services[2].name,
            "operatorId": staff[0].id, "operatorName": staff[0].name,
            date: today, time: '14:00', duration: services[2].duration, buffer: services[2].buffer,
            price: services[2].price, status: 'confirmed'
        },
        {
            "clientId": clients[3].id, "clientName": clients[3].name,
            "serviceId": services[3].id, "serviceName": services[3].name,
            "operatorId": staff[1].id, "operatorName": staff[1].name,
            date: today, time: '15:30', duration: services[3].duration, buffer: services[3].buffer,
            price: services[3].price, status: 'pending'
        }
    ]).select();

    if (apptError) throw new Error(apptError.message);
    console.log('✅ Inseriti 4 appuntamenti');

    console.log('🎉 Seeding completato con successo!');
    process.exit(0);
}

seed().catch(err => {
    console.error('Errore durante il seeding:', err);
    process.exit(1);
});
