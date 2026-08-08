/**
 * Factoring a quadratic trinomial by the AC method.
 *
 * For ax^2 + bx + c we need m and n with m + n = b and mn = ac, which
 * makes them the roots of t^2 - bt + ac. So m, n = (b +- sqrt(b^2 - 4ac)) / 2
 * and the trinomial factors over the integers exactly when that
 * discriminant is a perfect square and b +- sqrt(D) is even.
 *
 * Splitting bx into mx + nx then lets the four terms group in pairs:
 *
 *   ax^2 + mx + nx + c  ->  g1*x(px + q) + g2(px + q)  ->  (px + q)(g1*x + g2)
 *
 * with g1 = gcd(a, m), p = a/g1, q = m/g1 and g2 = n/p. That last division
 * is exact: qn = pc and gcd(p, q) = 1, so p divides n.
 */

export type Coefficients = {
  a: number;
  b: number;
  c: number;
};

export type Step = {
  title: string;
  detail?: string;
  math: string;
};

/** The result as numbers: common * (p*x + q)(r*x + s). */
export type Factors = {
  common: number;
  p: number;
  q: number;
  r: number;
  s: number;
};

export type FactorResult =
  | { kind: 'factored'; steps: Step[]; answer: string; factors: Factors }
  | { kind: 'irreducible'; steps: Step[]; message: string }
  | { kind: 'invalid'; message: string };

/* -------------------------------------------------------------------
   LaTeX helpers
   ------------------------------------------------------------------- */

/** "5x", "x", "3" — magnitude only, with 1 suppressed in front of a variable. */
function magnitude(value: number, variable: string): string {
  if (variable === '') return String(value);
  return value === 1 ? variable : `${value}${variable}`;
}

/** Opening term of an expression: "2x^{2}", "-x". */
function leading(coefficient: number, variable: string): string {
  const sign = coefficient < 0 ? '-' : '';
  return sign + magnitude(Math.abs(coefficient), variable);
}

/** Continuing term, with its operator: " + 5x", " - 3". */
function continuing(coefficient: number, variable: string): string {
  const operator = coefficient < 0 ? '-' : '+';
  return ` ${operator} ${magnitude(Math.abs(coefficient), variable)}`;
}

/** "2x^{2} + 7x + 3", omitting any zero term. */
export function trinomial({ a, b, c }: Coefficients): string {
  let out = leading(a, 'x^{2}');
  if (b !== 0) out += continuing(b, 'x');
  if (c !== 0) out += continuing(c, '');
  return out;
}

/** "2x + 1", "x - 3". */
function binomial(p: number, q: number): string {
  return leading(p, 'x') + continuing(q, '');
}

/** "2x(x + 3)", "-3(2x - 1)", "1(x + 3)". */
function grouped(multiplier: number, variable: string, inner: string): string {
  const sign = multiplier < 0 ? '-' : '';
  return `${sign}${magnitude(Math.abs(multiplier), variable)}(${inner})`;
}

/** Multiplier written in front of brackets: "2", "-", "" for 1. */
function prefix(multiplier: number): string {
  if (multiplier === 1) return '';
  if (multiplier === -1) return '-';
  return String(multiplier);
}

/* -------------------------------------------------------------------
   Arithmetic helpers
   ------------------------------------------------------------------- */

function gcd(x: number, y: number): number {
  let [left, right] = [Math.abs(x), Math.abs(y)];
  while (right !== 0) {
    [left, right] = [right, left % right];
  }
  return left;
}

function perfectSquareRoot(value: number): number | null {
  if (value < 0) return null;
  const root = Math.round(Math.sqrt(value));
  return root * root === value ? root : null;
}

/* -------------------------------------------------------------------
   The method
   ------------------------------------------------------------------- */

export function factor(input: Coefficients): FactorResult {
  const { a, b, c } = input;

  if (![a, b, c].every(Number.isFinite)) {
    return { kind: 'invalid', message: 'Enter a number for a, b and c.' };
  }
  if (![a, b, c].every(Number.isInteger)) {
    return { kind: 'invalid', message: 'The AC method needs whole-number coefficients.' };
  }
  if (a === 0) {
    return { kind: 'invalid', message: 'a cannot be zero — that is not a quadratic.' };
  }

  const steps: Step[] = [];

  /* Pull out the common factor first, folding a negative leading
     coefficient into it so the rest of the method works on a > 0. */
  let common = gcd(gcd(a, b), c);
  if (a < 0) common = -common;

  const A = a / common;
  const B = b / common;
  const C = c / common;

  if (common !== 1) {
    steps.push({
      title: 'Factor out the common factor',
      detail:
        common === -1
          ? 'Factor out -1 so the leading coefficient is positive.'
          : `Every term is divisible by ${common}.`,
      math: `${trinomial(input)} = ${grouped(common, '', trinomial({ a: A, b: B, c: C }))}`,
    });
  }

  /* c = 0 has no constant to pair with, so grouping degenerates.
     ax^2 + bx is just x(ax + b). */
  if (C === 0) {
    const inner = B === 0 ? magnitude(A, 'x') : binomial(A, B);
    const answer = `${prefix(common)}x(${inner})`;

    steps.push({
      title: 'Take out the common x',
      detail: 'With no constant term, every term already contains x.',
      math: `${trinomial({ a: A, b: B, c: 0 })} = x(${inner})`,
    });

    return {
      kind: 'factored',
      steps,
      answer,
      factors: { common, p: 1, q: 0, r: A, s: B },
    };
  }

  const ac = A * C;

  steps.push({
    title: 'Multiply a and c',
    detail: 'The AC method looks for a pair of numbers with this product.',
    math: `a \\cdot c = ${A} \\cdot ${C} = ${ac}`,
  });

  const discriminant = B * B - 4 * A * C;
  const root = perfectSquareRoot(discriminant);

  if (root === null || (B + root) % 2 !== 0) {
    steps.push({
      title: 'Look for the pair',
      detail: `No two whole numbers multiply to ${ac} and add to ${B}.`,
      math: `b^{2} - 4ac = ${B}^{2} - 4(${A})(${C}) = ${discriminant}`,
    });
    return {
      kind: 'irreducible',
      steps,
      message:
        discriminant < 0
          ? 'This trinomial has no real roots, so it cannot be factored.'
          : 'This trinomial does not factor over the integers.',
    };
  }

  const m = (B + root) / 2;
  const n = (B - root) / 2;

  steps.push({
    title: 'Split the middle term',
    detail: `${m} and ${n} multiply to ${ac} and add to ${B}.`,
    math: `${leading(A, 'x^{2}')}${continuing(m, 'x')}${continuing(n, 'x')}${continuing(C, '')}`,
  });

  const g1 = gcd(A, m);
  const p = A / g1;
  const q = m / g1;
  const g2 = n / p;

  const pair = binomial(p, q);

  steps.push({
    title: 'Group the terms in pairs',
    math: `(${leading(A, 'x^{2}')}${continuing(m, 'x')}) + (${leading(n, 'x')}${continuing(C, '')})`,
  });

  steps.push({
    title: 'Factor each pair',
    detail: 'Both pairs leave the same bracket behind.',
    math: `${grouped(g1, 'x', pair)}${g2 < 0 ? ' - ' : ' + '}${grouped(Math.abs(g2), '', pair)}`,
  });

  const other = binomial(g1, g2);
  const isPerfectSquare = p === g1 && q === g2;
  const core = isPerfectSquare ? `(${pair})^{2}` : `(${pair})(${other})`;
  const answer = `${prefix(common)}${core}`;

  steps.push({
    title: 'Factor out the common bracket',
    detail: isPerfectSquare ? 'Both factors match — this is a perfect square.' : undefined,
    math: answer,
  });

  return {
    kind: 'factored',
    steps,
    answer,
    factors: { common, p, q, r: g1, s: g2 },
  };
}
