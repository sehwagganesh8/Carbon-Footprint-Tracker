import { expect, describe, it } from 'vitest';
import { calculateFootprint, CalculationInputs } from '../utils/carbonUtils';

describe('carbonUtils: calculateFootprint', () => {
  const baseInputs: CalculationInputs = {
    transportType: 'petrol',
    distance: 600,
    dietType: 'moderate_meat',
    electricity: 200,
    heatingType: 'gas',
  };

  it('calculates expected emissions with normal inputs', () => {
    const result = calculateFootprint(baseInputs);
    // Transport: 600 * 0.192 = 115.2 (round 115)
    // Diet: 190
    // Energy: (200 * 0.35) + 140 = 70 + 140 = 210
    // Total: 115 + 190 + 210 = 515
    expect(result.transport).toBe(115);
    expect(result.diet).toBe(190);
    expect(result.energy).toBe(210);
    expect(result.total).toBe(515);
  });

  describe('Edge cases and boundary values', () => {
    it('handles zero distance and zero electricity correctly', () => {
      const result = calculateFootprint({
        ...baseInputs,
        distance: 0,
        electricity: 0,
      });
      expect(result.transport).toBe(0);
      expect(result.energy).toBe(140); // Base heating (gas) remains
    });

    it('handles negative distance and electricity by capping at 0', () => {
      const result = calculateFootprint({
        ...baseInputs,
        distance: -100,
        electricity: -50,
        heatingType: 'none',
      });
      expect(result.transport).toBe(0);
      expect(result.answers.distance).toBe(0); // Should record capped answer
      expect(result.energy).toBe(0);
      expect(result.answers.electricity).toBe(0);
    });

    it('calculates correctly for maximum/extreme inputs', () => {
      const result = calculateFootprint({
        ...baseInputs,
        distance: 10000,
        electricity: 5000,
        dietType: 'heavy_meat', // 280
      });
      // Transport: 10000 * 0.192 = 1920
      // Diet: 280
      // Energy: 5000 * 0.35 = 1750 + 140 (gas) = 1890
      // Total: 1920 + 280 + 1890 = 4090
      expect(result.transport).toBe(1920);
      expect(result.energy).toBe(1890);
      expect(result.total).toBe(4090);
    });

    it('falls back nicely on unexpected enum/string types', () => {
      const result = calculateFootprint({
        transportType: 'invalid_type',
        distance: 100,
        dietType: 'unknown_diet',
        electricity: 100,
        heatingType: 'magic_heating',
      } as any);

      // Default petrol factor fallback: 0.192 * 100 = 19
      expect(result.transport).toBe(19);
      // Default diet factor fallback: 190
      expect(result.diet).toBe(190);
      // Default heating factor fallback: 140. Electricity 100 * 0.35 = 35. Total 175.
      expect(result.energy).toBe(175);
    });
  });
});
