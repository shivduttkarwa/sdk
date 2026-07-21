# Shivdutt Karwa — Portfolio (React + Vite + TypeScript)

A behavior-identical React port of the original hand-built static portfolio (preloader,
Lenis smooth scroll, GSAP/ScrollTrigger pins & timelines, five WebGL contexts, and a lot of
imperative canvas/DOM work).

## Parity contract — "idiomatic shell, verbatim core"

The rendered design and runtime behavior must match the original site. The **architecture** is
idiomatic React; the **animation internals** are copied byte-for-byte:

- **Idiomatic outside:** one component per section (`src/components`), one custom hook per
  imperative unit (`src/hooks`), `useState` for the nav, a Lenis context provider
  (`src/context/LenisContext.tsx`), centralized GSAP registration (`src/lib/gsapSetup.ts`),
  strict TypeScript, and full effect cleanup (the original had almost none).
- **Verbatim inside:** GLSL shaders and the imperative WebGL/GSAP/canvas cores live in
  `src/cores/*.core.ts` and are copied statement-for-statement (same shader source, easing
  constants, `start`/`end`/`scrub` strings, physics math). Each core returns a disposer that is
  behavior-inert while mounted and only acts on teardown. The global CSS
  (`public/styles.css`) is byte-identical and served verbatim via `<link>` (Vite never
  processes it). The DOM (ids/classes/data-attrs/order) mirrors the original 1:1 so CSS
  selectors, `getBoundingClientRect`, and ScrollTrigger triggers resolve identically.

`matchMedia`/`prefers-reduced-motion` gates are evaluated once at init (never re-bound on
resize), matching the original. React `StrictMode` is intentionally **off** in `src/main.tsx`
so dev mirrors the production single-init (the shipped build never double-mounts); every effect
is still cleanup-correct, so it can be flipped on if desired.

## Commands

```bash
npm install
npm run dev        # Vite dev server
npm run build      # tsc --noEmit && vite build  ->  docs/
npm run preview    # serve the production build (docs/) on :4173
npm run lint
npm run format
npm run test:visual   # Playwright smoke + screenshot specs against the preview build
```

## Structure

```
index.html              # Vite entry; head kept byte-faithful (A1 scroll-restoration script,
                        # favicon data-URI, Google Fonts + Fontshare links, verbatim CSS <link>)
public/
  styles.css            # verbatim global stylesheet (unprocessed)
  shiv-big.png          # tech-pin portrait (root-relative path, matches src="shiv-big.png")
  assets/…              # only the referenced media + fonts (dead assets dropped)
src/
  main.tsx  App.tsx
  lib/gsapSetup.ts  lib/scrollOrchestrator.ts
  context/LenisContext.tsx
  cores/*.core.ts       # verbatim imperative cores (WebGL/GSAP/canvas) + disposers
  hooks/use*.ts         # thin React wrappers (effect -> mount core -> return disposer)
  components/*.tsx      # one per section, DOM mirrored 1:1
tests/                  # Playwright smoke + screenshots
```

## Verification

- `npm run test:visual` runs `tests/smoke.spec.ts` (boots with zero console/page errors,
  preloader hides, all sections render, nav state contract, `window.lenis` singleton, and a
  full-page scroll pass with no runtime errors) and `tests/screenshots.spec.ts` (captures key
  scroll states to `test-results/shots/`).
- **Full NEW-vs-ORIGINAL visual regression:** the exact pre-port static site is preserved,
  self-contained, in `original-static/` — serve it alongside the preview build and
  screenshot-compare per breakpoint/scroll depth. Canvas regions are GPU/time/random
  nondeterministic (e.g. the tech-pin card rotation uses `gsap.utils.random`), so mask them or
  run both under software GL for a deterministic compare.
  ```bash
  npx serve original-static        # e.g. :5000  (ORIGINAL / golden — needs network for CDN GSAP/Lenis + fonts)
  npm run build && npm run preview # :4173       (NEW)
  ```

## Deploy

`npm run build` outputs to `docs/` (`vite.config.ts` `outDir: 'docs'`, `assetsDir: 'bundle'`,
`base: './'`). Point GitHub Pages at `/docs` on `main` to keep the existing `deploy.bat`
(git add/commit/push) working with zero CI.

## Dormant units (intentionally not ported — they never run)

The original ships several fully-implemented behaviors whose target selectors do not exist in
the current markup, so they execute their guards and return early (zero runtime effect). They
are intentionally omitted here, exactly matching that no-op behavior:

- `.magnetic` buttons and `.tilt-card` tilt (no such elements)
- `#navRevealCanvas` WebGL blob (element absent; its `assets/1111.png` is therefore never fetched)
- `#tsBento` tech-bento fade and `.sdk-stack__card` / `.sdk-stack__tag` spotlight + physics
- the `#hire` section's `#tubes-canvas` TubesCursor (the whole section is commented out in the
  original), so `three` / `threejs-components` are not dependencies

## Notes

- The complete pre-port static site lives in `original-static/` (`index.html`, `styles.css`,
  `script.js`, `tech-stack-pinned.js`, `shiv-big.png`, `assets/`) — self-contained and runnable
  (`npx serve original-static`). It is the source the port was verified against and is excluded
  from lint/format/build. `public/` holds the canonical referenced assets for the React app.
