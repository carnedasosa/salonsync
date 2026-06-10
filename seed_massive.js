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

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const firstNames = ["Laura", "Chiara", "Francesca", "Valentina", "Giulia", "Martina", "Silvia", "Sara", "Elena", "Alessia", "Federica", "Marta", "Giorgia", "Ilaria", "Elisa", "Anna", "Paola", "Serena", "Michela", "Daniela", "Roberta", "Claudia", "Monica", "Silvia", "Erika"];
const lastNames = ["Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno", "Gallo", "Conti", "De Luca", "Mancini", "Costa", "Giordano", "Rizzo", "Lombardi", "Moretti"];
const skinTypes = ["Secca", "Grassa", "Mista", "Normale", "Sensibile"];
const allergiesList = ["Nessuna", "Nichel", "Profumi", "Nessuna", "Nessuna", "Lattice", "Polline", "Nessuna"];

async function seedMassive() {
    console.log('🚀 Inizio la generazione dei dati...');

    // 1. Genera 30 Clienti
    const clientsToInsert = [];
    for (let i = 0; i < 30; i++) {
        const name = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
        clientsToInsert.push({
            name: name,
            email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
            phone: `333${getRandomInt(1000000, 9999999)}`,
            skinType: getRandomElement(skinTypes),
            allergies: getRandomElement(allergiesList)
        });
    }

    const { data: clients, error: clientsError } = await supabase.from('clients').insert(clientsToInsert).select();
    if (clientsError) throw new Error(clientsError.message);
    console.log(`✅ Inseriti ${clients.length} clienti`);

    // 2. Genera 5 Servizi
    const servicesToInsert = [
        { name: 'Ceretta Completa', category: 'Epilazione', price: 40, duration: 45, buffer: 10, color: '#fbcfe8' },
        { name: 'Trattamento Viso Anti-age', category: 'Viso', price: 85, duration: 60, buffer: 15, color: '#bae1ff' },
        { name: 'Massaggio Drenante', category: 'Corpo', price: 70, duration: 60, buffer: 15, color: '#ffffba' },
        { name: 'Radiofrequenza', category: 'Viso', price: 120, duration: 45, buffer: 10, color: '#ffdfba' },
        { name: 'Laminazione Ciglia', category: 'Occhi', price: 60, duration: 60, buffer: 0, color: '#e6e6fa' }
    ];

    const { data: services, error: servicesError } = await supabase.from('services').insert(servicesToInsert).select();
    if (servicesError) throw new Error(servicesError.message);
    console.log(`✅ Inseriti ${services.length} servizi`);

    // 3. Genera 10 Prodotti
    const productsToInsert = [
        { name: 'Crema Viso Idratante 24h', category: 'Viso', stock: 15, minStock: 5, price: 35 },
        { name: 'Siero Acido Ialuronico Puro', category: 'Viso', stock: 8, minStock: 3, price: 55 },
        { name: 'Scrub Corpo Zucchero e Miele', category: 'Corpo', stock: 12, minStock: 4, price: 28 },
        { name: 'Olio Massaggio Rilassante', category: 'Corpo', stock: 5, minStock: 5, price: 22 },
        { name: 'Lozione Tonica Rinfrescante', category: 'Viso', stock: 20, minStock: 5, price: 18 },
        { name: 'Latte Detergente Delicato', category: 'Viso', stock: 18, minStock: 5, price: 20 },
        { name: 'Maschera Argilla Purificante', category: 'Viso', stock: 10, minStock: 3, price: 25 },
        { name: 'Crema Antirughe Notte', category: 'Viso', stock: 7, minStock: 3, price: 65 },
        { name: 'Gel Contorno Occhi', category: 'Viso', stock: 14, minStock: 4, price: 40 },
        { name: 'Protezione Solare SPF 50', category: 'Corpo', stock: 2, minStock: 10, price: 30 } // Basso stock di proposito per gli alert
    ];

    const { data: products, error: productsError } = await supabase.from('products').insert(productsToInsert).select();
    if (productsError) throw new Error(productsError.message);
    console.log(`✅ Inseriti ${products.length} prodotti in magazzino`);

    // Fetch existing staff to assign appointments
    let { data: staff, error: staffError } = await supabase.from('staff').select('*');
    if (staffError) throw new Error("Errore recupero staff");
    
    if (staff.length === 0) {
        console.log('⚠️ Nessun operatore trovato. Creo 2 operatrici...');
        const { data: newStaff, error: insertStaffError } = await supabase.from('staff').insert([
            { name: 'Elena', role: 'Estetista', color: '#ffb3ba' },
            { name: 'Martina', role: 'Massaggiatrice', color: '#baffc9' }
        ]).select();
        if (insertStaffError) throw new Error(insertStaffError.message);
        staff = newStaff;
        console.log('✅ Inserite 2 operatrici di default');
    }
    const appointmentsToInsert = [];
    const statuses = ['completed', 'completed', 'confirmed', 'pending', 'no-show', 'cancelled'];
    
    // Anno corrente 2026, dal mese 1 al 12
    for (let i = 0; i < 20; i++) {
        const client = getRandomElement(clients);
        const service = getRandomElement(services);
        const operator = getRandomElement(staff);
        
        // Genera data casuale
        const month = getRandomInt(1, 12);
        const day = getRandomInt(1, 28);
        const dateStr = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Ora casuale
        const hour = getRandomInt(9, 18);
        const timeStr = `${String(hour).padStart(2, '0')}:${getRandomElement(['00', '30'])}`;
        
        // Se il mese è <= 5 (passato), probabile sia completato
        let status = 'pending';
        if (month < 6) {
            status = getRandomElement(['completed', 'completed', 'no-show', 'cancelled']);
        } else if (month === 6) {
            status = getRandomElement(['completed', 'confirmed', 'pending', 'cancelled']);
        } else {
            status = getRandomElement(['confirmed', 'pending']);
        }

        appointmentsToInsert.push({
            clientId: client.id,
            clientName: client.name,
            serviceId: service.id,
            serviceName: service.name,
            operatorId: operator.id,
            operatorName: operator.name,
            date: dateStr,
            time: timeStr,
            duration: service.duration,
            buffer: service.buffer,
            price: service.price,
            status: status
        });
    }

    const { data: apps, error: appsError } = await supabase.from('appointments').insert(appointmentsToInsert).select();
    if (appsError) throw new Error(appsError.message);
    console.log(`✅ Inseriti ${apps.length} appuntamenti sparsi per il 2026`);

    console.log('🎉 Operazione completata!');
    process.exit(0);
}

seedMassive().catch(err => {
    console.error('❌ Errore:', err);
    process.exit(1);
});
