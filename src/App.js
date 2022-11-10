
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import React, { useState } from 'react';
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

function Field() {
  const [coefficients, setCoefficients] = useState(["a", "b", "c"]);

  const setA = event => {
    setCoefficients([event.target.value, coefficients[1], coefficients[2]]);
  }
  const setB = event => {
    setCoefficients([coefficients[0], event.target.value, coefficients[2]]);
  }
  const setC = event => {
    setCoefficients([coefficients[0], coefficients[1], event.target.value]);
  }

  let equation = "\\(" + coefficients[0] + "x^{2}+" + coefficients[1] + "x+" + coefficients[2] + "\\)"

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
              <textarea value={coefficients[0]} onChange={setA} />
            </label>
            <label>
              {"b: "}
              <textarea value={coefficients[1]} onChange={setB} />
            </label>
            <label>
              {"c: "}
              <textarea value={coefficients[2]} onChange={setC} />
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
