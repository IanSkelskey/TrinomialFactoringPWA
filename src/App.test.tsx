import { render, screen } from '@testing-library/react';
import { act } from 'react';
import App from './App';

/* MathJax typesets from a CDN and does nothing under jsdom, so these
   assert on the surrounding prose rather than on rendered equations. */

function type(label: string, value: string) {
  const input = screen.getByLabelText(label) as HTMLInputElement;
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;
    setter?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

test('renders the app title', () => {
  render(<App />);
  expect(screen.getByText(/factor a trinomial/i)).toBeInTheDocument();
});

test('prompts for coefficients before anything is entered', () => {
  render(<App />);
  expect(screen.getByText(/press Factor to see/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Factor' })).toBeDisabled();
});

test('shows the AC method working once coefficients are factored', () => {
  render(<App />);

  type('a', '1');
  type('b', '10');
  type('c', '25');

  const button = screen.getByRole('button', { name: 'Factor' });
  expect(button).toBeEnabled();
  act(() => button.click());

  expect(screen.getByText('Multiply a and c')).toBeInTheDocument();
  expect(screen.getByText('Split the middle term')).toBeInTheDocument();
  expect(screen.getByText('Group the terms in pairs')).toBeInTheDocument();
  expect(screen.getByText(/perfect square/i)).toBeInTheDocument();
  expect(screen.getByText('Factored')).toBeInTheDocument();
});

test('reports a trinomial that does not factor', () => {
  render(<App />);

  type('a', '1');
  type('b', '1');
  type('c', '1');
  act(() => screen.getByRole('button', { name: 'Factor' }).click());

  expect(screen.getByText(/no real roots/i)).toBeInTheDocument();
});

test('clears stale working when a coefficient changes', () => {
  render(<App />);

  type('a', '1');
  type('b', '5');
  type('c', '6');
  act(() => screen.getByRole('button', { name: 'Factor' }).click());
  expect(screen.getByText('Split the middle term')).toBeInTheDocument();

  type('c', '7');
  expect(screen.queryByText('Split the middle term')).not.toBeInTheDocument();
});
