import { describe, expect, it } from 'vitest';
import { resolveTieWithPolicy, type TieCandidate } from '../verify-tie-fairness-policy';

describe('Configurable Tie Fairness Policy (#1035)', () => {
  const candidates: TieCandidate[] = [
    { address: 'LP_FIRST', score: 90, joinedAtSequence: 100 },
    { address: 'LP_SECOND', score: 90, joinedAtSequence: 105 },
    { address: 'LP_THIRD', score: 90, joinedAtSequence: 110 },
  ];

  it('resolves earliest joined candidate when policy is EarliestJoined', () => {
    const winner = resolveTieWithPolicy(candidates, 'EarliestJoined');
    expect(winner).toBe('LP_FIRST');
  });

  it('resolves uniform random candidate when policy is UniformRandom', () => {
    const win0 = resolveTieWithPolicy(candidates, 'UniformRandom', 0);
    expect(win0).toBe('LP_FIRST');

    const win1 = resolveTieWithPolicy(candidates, 'UniformRandom', 1);
    expect(win1).toBe('LP_SECOND');

    const win2 = resolveTieWithPolicy(candidates, 'UniformRandom', 2);
    expect(win2).toBe('LP_THIRD');
  });
});
