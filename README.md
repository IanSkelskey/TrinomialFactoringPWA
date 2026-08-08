# Trinomial Factoring PWA

A web app that factors quadratic trinomials by the AC method and shows every step.

**Live:** https://ianskelskey.github.io/TrinomialFactoringPWA

## Running locally

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | Typechecks, then builds to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm test` | Vitest in watch mode (`npm test -- --run` for one pass) |
| `npm run typecheck` | `tsc --noEmit` |

## How it works

`src/factoring.ts` holds the algebra and imports nothing from React, so it is
tested independently of the UI. For `ax² + bx + c` it finds `m` and `n` with
`m + n = b` and `mn = ac` — the roots of `t² − bt + ac` — then splits the middle
term and factors by grouping. The trinomial factors over the integers exactly
when `b² − 4ac` is a perfect square and `b ± √(b² − 4ac)` is even.

`src/App.tsx` renders the returned steps. Equations are typeset by MathJax 4
through `better-react-mathjax`.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which typechecks, runs the tests, builds, and publishes `dist/` to GitHub Pages.
A type error or a failing test stops the deploy.

The repository's **Settings → Pages → Source** must be set to **GitHub Actions**
(not "Deploy from a branch"). There is no `gh-pages` branch and no manual
`npm run deploy` step.

`base` in `vite.config.ts` is set to `/TrinomialFactoringPWA/` because this is a
project site rather than a user site. It must match the repository name.
