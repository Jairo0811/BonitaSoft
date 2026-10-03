import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../../theme/tokens.css';
import '../../theme/bonitasoft-components.css';
import './styles.css';
import './functional.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
