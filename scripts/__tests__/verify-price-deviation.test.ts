import { describe, expect, it } from 'vitest';
import { filterPriceOutliers, PriceDeviationError } from '../verify-price-deviation';

describe('Reject Excessive Price Deviation (#1045)', () => {
  it('accepts reports within the 5% (500 bps) threshold', () => {
    const reports = [
      { oracle: 'ORACLE_A', price: 100 },
      { oracle: 'ORACLE_B', price: 102 },
      { oracle: 'ORACLE_C', price: 99 },
    ];

    const result = filterPriceOutliers(reports, 500);
    expect(result.survivors.length).toBe(3);
    expect(result.outliers.length).toBe(0);
    expect(result.validatedPrice).toBe(100);
  });

  it('filters out a single rogue outlier and computes median of survivors', () => {
    const reports = [
      { oracle: 'ORACLE_NORMAL_1', price: 100 },
      { oracle: 'ORACLE_NORMAL_2', price: 101 },
      { oracle: 'ORACLE_POISONED', price: 250 }, // 150% deviation
    ];

    const result = filterPriceOutliers(reports, 500);
    expect(result.survivors.length).toBe(2);
    expect(result.outliers.length).toBe(1);
    expect(result.outliers[0].oracle).toBe('ORACLE_POISONED');
  });

  it('rejects with ALL_PRICE_SOURCES_REJECTED when all sources excessively deviate', () => {
    const reports = [
      { oracle: 'ORACLE_EXTREME_LOW', price: 50 },
      { oracle: 'ORACLE_EXTREME_HIGH', price: 200 },
    ];
    // Median is 125, |50-125|/125 = 6000 bps > 500 bps; |200-125|/125 = 6000 bps > 500 bps

    expect(() => filterPriceOutliers(reports, 500)).toThrow(PriceDeviationError);
    try {
      filterPriceOutliers(reports, 500);
    } catch (e: any) {
      expect(e.code).toBe('ALL_PRICE_SOURCES_REJECTED');
    }
  });
});
