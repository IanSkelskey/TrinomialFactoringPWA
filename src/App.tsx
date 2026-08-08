import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useState, type ChangeEvent } from 'react';
import './App.css';

function App() {

  return (
    <div>
      <header className="App-header">
        <h1 className='title'>Factor a Trinomial!</h1>
        <h2>Coming soon!</h2>
      </header>
      <div className='App-content'>
        <Field></Field>
        <MathJaxContext >
          <MathJax>
            <h4>Standard Form for a Quadratic Trinomial</h4>
            <div className='math'>
              {
                "\\(ax^{2}+bx+c\\)"
              }
            </div>
          </MathJax>
          <MathJax>
            <h4>Quadratic Formula</h4>
            <div className='math'>
              {
                "\\(x=\\frac{-b\\pm{\\sqrt{b^{2}+4ac}}}{2a} \\)"
              }
            </div>
          </MathJax>
        </MathJaxContext>
      </div>
    </div>
  );
}

type Coefficients = {
  a: string;
  b: string;
  c: string;
};

function Field() {
  const [coefficients, setCoefficients] = useState<Coefficients>({ a: "a", b: "b", c: "c" });

  const setCoefficient = (key: keyof Coefficients) => (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setCoefficients(previous => ({ ...previous, [key]: value }));
  }

  let equation = "\\(" + coefficients.a + "x^{2}+" + coefficients.b + "x+" + coefficients.c + "\\)"

  return (
    <div>
      <MathJaxContext>
        <MathJax>

          <div className='math'>
            {
              equation
            }
          </div>
        </MathJax>
        <form className='form'>
          <h4>Enter the coeffecients!</h4>
          <div className='row'>
            <label>
              {"a: "}
              <textarea value={coefficients.a} onChange={setCoefficient("a")} />
            </label>
            <label>
              {"b: "}
              <textarea value={coefficients.b} onChange={setCoefficient("b")} />
            </label>
            <label>
              {"c: "}
              <textarea value={coefficients.c} onChange={setCoefficient("c")} />
            </label>
          </div>

          <input type="submit" value="Factor!" />
        </form>
        <h4>Steps</h4>
        <ol>
          <li>
            <MathJax>
              {"\\(x^{2} + 5x + 5x + 25\\)"}
            </MathJax>
          </li>
          <li>
            <MathJax>
              {"\\(x(x+5)+ 5(x + 5)\\)"}
            </MathJax>
          </li>
          <li>
            <MathJax>
              {"\\((x+5)(x+5)\\)"}
            </MathJax>
          </li>
        </ol>
      </MathJaxContext>

    </div>

  );
}

export default App;
