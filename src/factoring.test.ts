import { factor } from './factoring';

describe('factor', () => {
  it('factors the worked example from the original app', () => {
    const result = factor({ a: 1, b: 10, c: 25 });
    expect(result.kind).toBe('factored');
    if (result.kind !== 'factored') return;
    expect(result.answer).toBe('(x + 5)^{2}');
  });

  it('factors a simple monic trinomial', () => {
    const result = factor({ a: 1, b: 5, c: 6 });
    if (result.kind !== 'factored') throw new Error('expected factored');
    expect(result.answer).toBe('(x + 3)(x + 2)');
  });

  it('factors with a leading coefficient', () => {
    const result = factor({ a: 2, b: 7, c: 3 });
    if (result.kind !== 'factored') throw new Error('expected factored');
    expect(result.answer).toBe('(x + 3)(2x + 1)');
  });

  it('handles negative coefficients', () => {
    const result = factor({ a: 2, b: -7, c: 3 });
    if (result.kind !== 'factored') throw new Error('expected factored');
    expect(result.answer).toBe('(2x - 1)(x - 3)');
  });

  it('factors a difference of squares', () => {
    const result = factor({ a: 1, b: 0, c: -4 });
    if (result.kind !== 'factored') throw new Error('expected factored');
    expect(result.answer).toBe('(x + 2)(x - 2)');
  });

  it('pulls out a common factor first', () => {
    const result = factor({ a: 2, b: 10, c: 12 });
    if (result.kind !== 'factored') throw new Error('expected factored');
    expect(result.answer).toBe('2(x + 3)(x + 2)');
    expect(result.steps[0]?.title).toBe('Factor out the common factor');
  });

  it('normalises a negative leading coefficient', () => {
    const result = factor({ a: -1, b: -5, c: -6 });
    if (result.kind !== 'factored') throw new Error('expected factored');
    expect(result.factors.common).toBe(-1);
  });

  it('handles a missing constant term', () => {
    const result = factor({ a: 2, b: 4, c: 0 });
    if (result.kind !== 'factored') throw new Error('expected factored');
    expect(result.answer).toBe('2x(x + 2)');
  });

  it('reports trinomials that do not factor over the integers', () => {
    const result = factor({ a: 1, b: 1, c: 1 });
    expect(result.kind).toBe('irreducible');
  });

  it('rejects a zero leading coefficient', () => {
    const result = factor({ a: 0, b: 2, c: 1 });
    expect(result.kind).toBe('invalid');
  });

  it('rejects non-integer coefficients', () => {
    const result = factor({ a: 1, b: 2.5, c: 1 });
    expect(result.kind).toBe('invalid');
  });

  it('produces steps that end on the answer', () => {
    const result = factor({ a: 6, b: 11, c: -35 });
    if (result.kind !== 'factored') throw new Error('expected factored');
    expect(result.steps.at(-1)?.math).toBe(result.answer);
  });
});

describe('factor — expansion property', () => {
  /* Whenever factor() claims success, multiplying the factors back out
     must reproduce the original coefficients exactly. */
  /* -1 * 0 is -0 in JavaScript, which toBe() distinguishes from 0. */
  const unsign = (value: number) => (value === 0 ? 0 : value);

  it('reproduces the input for every trinomial in a wide sweep', () => {
    let factored = 0;

    for (let a = -6; a <= 6; a++) {
      if (a === 0) continue;
      for (let b = -12; b <= 12; b++) {
        for (let c = -12; c <= 12; c++) {
          const result = factor({ a, b, c });
          if (result.kind !== 'factored') continue;

          const { common, p, q, r, s } = result.factors;
          expect(unsign(common * p * r)).toBe(a);
          expect(unsign(common * (p * s + q * r))).toBe(b);
          expect(unsign(common * q * s)).toBe(c);
          factored += 1;
        }
      }
    }

    expect(factored).toBeGreaterThan(500);
  });

  it('never claims irreducible when the discriminant is a perfect square', () => {
    for (let a = 1; a <= 5; a++) {
      for (let b = -10; b <= 10; b++) {
        for (let c = -10; c <= 10; c++) {
          const discriminant = b * b - 4 * a * c;
          const root = Math.round(Math.sqrt(Math.max(discriminant, 0)));
          const isSquare = discriminant >= 0 && root * root === discriminant;
          const splitsEvenly = (b + root) % 2 === 0;

          if (isSquare && splitsEvenly) {
            expect(factor({ a, b, c }).kind).toBe('factored');
          }
        }
      }
    }
  });
});
