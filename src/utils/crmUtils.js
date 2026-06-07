/**
 * crmUtils.js
 * Funzioni pure per la logica del CRM e dello storico trattamenti.
 */

/**
 * Controlla se è necessario creare automaticamente un record nel CRM.
 * Ritorna true se il cliente esiste e il record non è già presente.
 * 
 * @param {string} appId - ID dell'appuntamento
 * @param {string} clientId - ID del cliente
 * @param {Array} clients - Lista completa dei clienti
 * @returns {boolean}
 */
export function shouldAutoRecordTreatment(appId, clientId, clients) {
  const client = clients.find((c) => c.id === clientId);
  if (!client) return false;

  const alreadyRecorded = client.treatmentHistory.some(
    (r) => r.id === `th_auto_${appId}`
  );

  return !alreadyRecorded;
}

/**
 * Crea l'oggetto record per lo storico trattamenti a partire da un appuntamento.
 * 
 * @param {Object} app - Oggetto appuntamento completo
 * @returns {Object} Il record del trattamento formattato
 */
export function createTreatmentRecord(app) {
  return {
    id: `th_auto_${app.id}`,
    date: app.date,
    serviceName: app.serviceName,
    operatorName: app.operatorName,
    price: app.price,
    notes: 'Trattamento completato. Scrivi qui la formula tecnica o altre note.',
    beforePhoto: '',
    afterPhoto: '',
  };
}
