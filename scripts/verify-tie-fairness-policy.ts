/**
 * Configurable Tie Fairness Policy Engine (#1035)
 *
 * Simulates policy-driven tie resolution:
 * - UniformRandom: 1/K equal probability distribution via PRNG
 * - EarliestJoined: deterministic FCFS strictly restricted to equal top scores
 */

export type TieFairnessPolicyType = 'UniformRandom' | 'EarliestJoined';

export interface TieCandidate {
  address: string;
  score: number;
  joinedAtSequence: number;
}

export function resolveTieWithPolicy(
  tiedCandidates: TieCandidate[],
  policy: TieFairnessPolicyType,
  mockPrngIndex: number = 0,
): string {
  if (tiedCandidates.length === 0) return '';
  if (tiedCandidates.length === 1) return tiedCandidates[0].address;

  if (policy === 'EarliestJoined') {
    // Sort strictly by joinedAtSequence ascending
    const sorted = [...tiedCandidates].sort(
      (a, b) => a.joinedAtSequence - b.joinedAtSequence
    );
    return sorted[0].address;
  }

  // UniformRandom
  const chosenIndex = mockPrngIndex % tiedCandidates.length;
  return tiedCandidates[chosenIndex].address;
}
