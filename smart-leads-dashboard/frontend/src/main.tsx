import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ── Dark Mode Initialization ──────────────────────────────────────────────────
// Apply stored theme preference BEFORE React mounts to prevent flash of
// wrong theme (FOUC). This runs synchronously before any React rendering.
const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
  document.documentElement.classList.add('dark');
}

// ── React App Mount ───────────────────────────────────────────────────────────
const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element #root not found in index.html');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
