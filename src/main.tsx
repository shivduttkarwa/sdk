import { createRoot } from 'react-dom/client';
import App from './App';

// StrictMode is intentionally OFF so dev mirrors the production single-init behavior:
// the app owns ~5 WebGL contexts, several rAF loops, and global singletons
// (window.lenis, window.__sdkTechPinInitialized). StrictMode's dev-only double-invoke
// would transiently double-instantiate those and complicate parity debugging — it can
// never affect the shipped production build. Every effect is still fully cleanup-correct,
// so flipping this on (wrap <App /> in <StrictMode>) is safe if desired.
//
// Global stylesheet is loaded verbatim via <link href="styles.css"> in index.html (Option B),
// so there is deliberately no CSS import here.

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(<App />);
