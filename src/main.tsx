import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PerformanceErrorBoundary } from './components/performance/ErrorBoundary'

createRoot(document.getElementById("root")!).render(
  <PerformanceErrorBoundary>
    <App />
  </PerformanceErrorBoundary>
);
