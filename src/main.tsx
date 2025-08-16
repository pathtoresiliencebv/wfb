import React from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
import MinimalApp from './App.minimal.tsx'
import './index.css'

console.log('🚀 Loading Wietforum België application...');

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

const root = createRoot(container);
root.render(<MinimalApp />);
