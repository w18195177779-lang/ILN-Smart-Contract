/**
 * Price Deviation Rejection Engine (#1045)
 *
 * Implements cross-oracle price validation and outlier rejection:
 * - Computes median across all reported prices
 * - Evaluates deviation in basis points: |P - M| * 10000 / M
 * - Rejects reports with deviation > maxDeviationBps
 * - If no reports survive, throws AllPriceSourcesRejected
 */

export class PriceDeviationError extends Error {
  readonly code: string;
  constructor(message: string, code: string) {
    super(`[${code}] ${message}`);
    this.name = 'PriceDeviationError';
    this.code = code;
  }
}

export interface OracleReport {
  oracle: string;
  price: number;
}

export function filterPriceOutliers(
  reports: OracleReport[],
  maxDeviationBps: number = 500, // 5% default
): { validatedPrice: number; survivors: OracleReport[]; outliers: OracleReport[] } {
  if (reports.length === 0) {
    throw new PriceDeviationError('No price sources available', 'NO_PRICE_SOURCE');
  }

  if (reports.length === 1) {
    return {
      validatedPrice: reports[0].price,
      survivors: reports,
      outliers: [],
    };
  }

  // Calculate median
  const sortedPrices = reports.map((r) => r.price).sort((a, b) => a - b);
  const mid = Math.floor(sortedPrices.length / 2);
  const medianPrice =
    sortedPrices.length % 2 !== 0
      ? sortedPrices[mid]
      : (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;

  const survivors: OracleReport[] = [];
  const outliers: OracleReport[] = [];

  for (const report of reports) {
    const devBps = Math.round((Math.abs(report.price - medianPrice) / medianPrice) * 10000);
    if (devBps > maxDeviationBps) {
      outliers.push(report);
    } else {
      survivors.push(report);
    }
  }

  if (survivors.length === 0) {
    throw new PriceDeviationError(
      'All price sources exceeded max deviation threshold',
      'ALL_PRICE_SOURCES_REJECTED'
    );
  }

  const survivorPrices = survivors.map((s) => s.price).sort((a, b) => a - b);
  const survivorMid = Math.floor(survivorPrices.length / 2);
  const finalPrice =
    survivorPrices.length % 2 !== 0
      ? survivorPrices[survivorMid]
      : (survivorPrices[survivorMid - 1] + survivorPrices[survivorMid]) / 2;

  return {
    validatedPrice: finalPrice,
    survivors,
    outliers,
  };
}
