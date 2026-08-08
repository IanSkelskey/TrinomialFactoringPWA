import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useEffect, useState, type ChangeEvent } from 'react';
import { factor, trinomial, type FactorResult } from './factoring';
import './App.css';

/* A single MathJax instance for the whole tree. Mounting more than one
   MathJaxContext races the async typesetter and can leave raw LaTeX on
   screen, which is what the two separate contexts used to do. */
const mathJaxConfig = {
  tex: {
    inlineMath: [['\\(', '\\)']],
  },
  /* Century Schoolbook was cut for textbooks: sturdier strokes and a
     taller x-height than MathJax's default Computer Modern, which goes
     thin and shimmery on phone screens. */
  output: {
    font: 'mathjax-schola',
  },
  options: {
    enableMenu: false,
  },
};

type Coefficients = {
  a: string;
  b: string;
  c: string;
};

const EMPTY_COEFFICIENTS: Coefficients = { a: '', b: '', c: '' };
const KEYS = ['a', 'b', 'c'] as const;

/* Render "- 3" rather than "+ -3" so the standard form stays readable
   once a student types a negative coefficient. */
function signedTerm(value: string, fallback: string): string {
  const term = value.trim() === '' ? fallback : value.trim();
  return term.startsWith('-') ? `- ${term.slice(1)}` : `+ ${term}`;
}

function toNumber(value: string): number {
  return value.trim() === '' ? Number.NaN : Number(value);
}

function toNumbers({ a, b, c }: Coefficients) {
  return { a: toNumber(a), b: toNumber(b), c: toNumber(c) };
}

/* Once all three are real numbers the shared formatter takes over, so
   the preview matches the working below it — "x^2" rather than "1x^2".
   Until then each blank falls back to its letter. */
function buildEquation(coefficients: Coefficients): string {
  const numbers = toNumbers(coefficients);
  const isComplete = Object.values(numbers).every(Number.isInteger);

  if (isComplete) {
    return `\\(${trinomial(numbers)}\\)`;
  }

  const { a, b, c } = coefficients;
  const leading = a.trim() === '' ? 'a' : a.trim();
  return `\\(${leading}x^{2} ${signedTerm(b, 'b')}x ${signedTerm(c, 'c')}\\)`;
}

/* MathJax typesets asynchronously and drops the result if another pass
   starts before the last one lands, which leaves raw LaTeX on screen.
   Typing "25" fires two updates back to back and reproduces it every
   time, so the preview waits for a pause in typing instead. */
function useSettled<T>(value: T, delay: number): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return settled;
}

/* Inline rather than an <img> of favicon.svg: the icon file carries a
   #0f1729 plate that is invisible against the dark theme's background.
   Inline, the strokes inherit the theme tokens and work on both. */
function Mark() {
  return (
    <svg className="mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <line className="mark__axis" x1="6" y1="26" x2="58" y2="26" />
      <path className="mark__curve" d="M10 8 Q32 80 54 8" />
      <circle className="mark__root" cx="16.44" cy="26" r="4.5" />
      <circle className="mark__root" cx="47.56" cy="26" r="4.5" />
    </svg>
  );
}

function App() {
  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="app">
        <header className="app__header">
          <Mark />
          <h1 className="app__title">Factor a Trinomial</h1>
          <p className="app__tagline">
            Enter the coefficients of a quadratic and follow the AC method step by step.
          </p>
        </header>

        <main className="app__main">
          <Solver />
          <Reference />
        </main>

        <footer className="app__footer">Built for students learning to factor.</footer>
      </div>
    </MathJaxContext>
  );
}

function Solver() {
  const [coefficients, setCoefficients] = useState<Coefficients>(EMPTY_COEFFICIENTS);
  const [result, setResult] = useState<FactorResult | null>(null);
  const settled = useSettled(coefficients, 250);

  /* Any edit invalidates the working already on screen. */
  const setCoefficient = (key: keyof Coefficients) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCoefficients(previous => ({ ...previous, [key]: value }));
    setResult(null);
  };

  const reset = () => {
    setCoefficients(EMPTY_COEFFICIENTS);
    setResult(null);
  };

  const isComplete = KEYS.every(key => coefficients[key].trim() !== '');
  const isEmpty = KEYS.every(key => coefficients[key] === '');

  const runFactor = () => {
    setResult(factor(toNumbers(coefficients)));
  };

  return (
    <>
      <section className="card" aria-labelledby="solver-heading">
        <h2 className="card__heading" id="solver-heading">
          Your trinomial
        </h2>

        <MathJax dynamic>
          <div className="equation equation--lead">{buildEquation(settled)}</div>
        </MathJax>

        <form
          className="coefficients"
          onSubmit={event => {
            event.preventDefault();
            if (isComplete) runFactor();
          }}
        >
          {KEYS.map(key => (
            <div className="coefficient" key={key}>
              <label className="coefficient__label" htmlFor={`coefficient-${key}`}>
                {key}
              </label>
              <input
                className="coefficient__input"
                id={`coefficient-${key}`}
                type="number"
                inputMode="numeric"
                placeholder={key}
                value={coefficients[key]}
                onChange={setCoefficient(key)}
              />
            </div>
          ))}
        </form>

        <div className="actions">
          <button className="button" type="button" onClick={runFactor} disabled={!isComplete}>
            Factor
          </button>
          <button className="button button--ghost" type="button" onClick={reset} disabled={isEmpty}>
            Reset
          </button>
        </div>
      </section>

      <Working result={result} />
    </>
  );
}

function Working({ result }: { result: FactorResult | null }) {
  return (
    <section className="card" aria-labelledby="steps-heading" aria-live="polite">
      <h2 className="card__heading" id="steps-heading">
        Working
      </h2>

      {result === null && (
        <p className="working__empty">
          Enter a value for <em>a</em>, <em>b</em> and <em>c</em>, then press Factor to see
          every step.
        </p>
      )}

      {result?.kind === 'invalid' && <p className="working__notice">{result.message}</p>}

      {(result?.kind === 'factored' || result?.kind === 'irreducible') && (
        <ol className="steps">
          {result.steps.map((step, index) => (
            <li className="steps__item" key={`${index}-${step.math}`}>
              <div className="steps__body">
                <p className="steps__title">{step.title}</p>
                {step.detail && <p className="steps__detail">{step.detail}</p>}
                <MathJax dynamic>
                  <div className="steps__math">{`\\(${step.math}\\)`}</div>
                </MathJax>
              </div>
            </li>
          ))}
        </ol>
      )}

      {result?.kind === 'factored' && (
        <div className="answer">
          <p className="answer__label">Factored</p>
          <MathJax dynamic>
            <div className="answer__math">{`\\(${result.answer}\\)`}</div>
          </MathJax>
        </div>
      )}

      {result?.kind === 'irreducible' && <p className="working__notice">{result.message}</p>}
    </section>
  );
}

function Reference() {
  return (
    <section className="card reference" aria-label="Reference formulas">
      <div>
        <h3 className="reference__title">Standard form</h3>
        <MathJax>
          <div className="equation">{'\\(ax^{2}+bx+c\\)'}</div>
        </MathJax>
      </div>
      <div>
        <h3 className="reference__title">Quadratic formula</h3>
        <MathJax>
          <div className="equation">
            {'\\(x=\\frac{-b\\pm{\\sqrt{b^{2}-4ac}}}{2a}\\)'}
          </div>
        </MathJax>
      </div>
    </section>
  );
}

export default App;
