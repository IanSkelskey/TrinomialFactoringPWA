
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
                "\\(x=\\frac{-b\\sqrt{b^{2}+4ac}}{2a} \\)"
              }
            </div>
          </MathJax>
        </MathJaxContext>
      </div>
    </div>
  );
}

function Field() {
  const [coefficient, setCoefficient] = useState("a");

  return (
    <div>
      <form className='form'>
        <label>
          {"a: "}
        </label>
        <textarea value={coefficient} />
        <input type="submit" value="Factor!" />s
      </form>
    </div>

  );
}

export default App;
