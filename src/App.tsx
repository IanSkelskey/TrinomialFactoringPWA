import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useState, type ChangeEvent } from 'react';
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

/* Render "- 3" rather than "+ -3" so the standard form stays readable
   once a student types a negative coefficient. */
function signedTerm(value: string, fallback: string): string {
  const term = value.trim() === '' ? fallback : value.trim();
  return term.startsWith('-') ? `- ${term.slice(1)}` : `+ ${term}`;
}

function buildEquation({ a, b, c }: Coefficients): string {
  const leading = a.trim() === '' ? 'a' : a.trim();
  return `\\(${leading}x^{2} ${signedTerm(b, 'b')}x ${signedTerm(c, 'c')}\\)`;
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
            Enter the coefficients of a quadratic and follow the factoring step by step.
          </p>
          <p className="badge">Solver in progress — the steps below are a worked example</p>
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

  const setCoefficient = (key: keyof Coefficients) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCoefficients(previous => ({ ...previous, [key]: value }));
  };

  const isEmpty =
    coefficients.a === '' && coefficients.b === '' && coefficients.c === '';

  return (
    <>
      <section className="card" aria-labelledby="solver-heading">
        <h2 className="card__heading" id="solver-heading">
          Your trinomial
        </h2>

        <MathJax dynamic>
          <div className="equation equation--lead">{buildEquation(coefficients)}</div>
        </MathJax>

        <form className="coefficients" onSubmit={event => event.preventDefault()}>
          {(['a', 'b', 'c'] as const).map(key => (
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
          <button className="button" type="button">
            Factor
          </button>
          <button
            className="button button--ghost"
            type="button"
            onClick={() => setCoefficients(EMPTY_COEFFICIENTS)}
            disabled={isEmpty}
          >
            Reset
          </button>
        </div>
      </section>

      <section className="card" aria-labelledby="steps-heading">
        <h2 className="card__heading" id="steps-heading">
          Steps
        </h2>
        <ol className="steps">
          <li className="steps__item">
            <MathJax>{'\\(x^{2} + 5x + 5x + 25\\)'}</MathJax>
          </li>
          <li className="steps__item">
            <MathJax>{'\\(x(x+5) + 5(x + 5)\\)'}</MathJax>
          </li>
          <li className="steps__item">
            <MathJax>{'\\((x+5)(x+5)\\)'}</MathJax>
          </li>
        </ol>
      </section>
    </>
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
