import { describe, it, expect } from 'vitest';
import { shouldAutoRecordTreatment, createTreatmentRecord } from './crmUtils';

describe('crmUtils', () => {
  describe('shouldAutoRecordTreatment', () => {
    const clients = [
      {
        id: 'c1',
        treatmentHistory: [
          { id: 'th_auto_a1' },
          { id: 'th_manual_1' }
        ]
      },
      {
        id: 'c2',
        treatmentHistory: []
      }
    ];

    it('dovrebbe ritornare false se il cliente non esiste', () => {
      expect(shouldAutoRecordTreatment('a2', 'c99', clients)).toBe(false);
    });

    it('dovrebbe ritornare false se il record per quell\'appuntamento esiste già', () => {
      // 'th_auto_a1' esiste già in c1
      expect(shouldAutoRecordTreatment('a1', 'c1', clients)).toBe(false);
    });

    it('dovrebbe ritornare true se il cliente esiste e il record non c\'è', () => {
      expect(shouldAutoRecordTreatment('a2', 'c1', clients)).toBe(true);
      expect(shouldAutoRecordTreatment('a1', 'c2', clients)).toBe(true);
    });
  });

  describe('createTreatmentRecord', () => {
    it('dovrebbe formattare correttamente il record dal dato dell\'appuntamento', () => {
      const app = {
        id: 'a123',
        date: '2026-06-05',
        serviceName: 'Manicure',
        operatorName: 'Aurora',
        price: 35,
        clientId: 'c1',
        status: 'completed'
      };

      const record = createTreatmentRecord(app);

      expect(record.id).toBe('th_auto_a123');
      expect(record.date).toBe('2026-06-05');
      expect(record.serviceName).toBe('Manicure');
      expect(record.operatorName).toBe('Aurora');
      expect(record.price).toBe(35);
      expect(record.notes).toBeDefined();
      expect(record.beforePhoto).toBe('');
      expect(record.afterPhoto).toBe('');
    });
  });
});
