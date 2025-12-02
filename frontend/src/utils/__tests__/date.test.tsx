import { describe, it, expect } from 'vitest';
import { formatDate, formatTime } from '../date';

describe('formatDate и formatTime', () => {
  it('возвращает дату в формате DD.MM', () => {
    const result = formatDate('2025-03-24T22:15:00.000Z');
    expect(result).toMatch(/^\d{1,2}\.\d{1,2}$/);
  });

  it('возвращает время в формате HH:MM', () => {
    const result = formatTime('2025-03-24T22:15:00.000Z');
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});


