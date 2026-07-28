import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as amplitude from '@amplitude/unified'
import './nocturne.css'
import './index.css'
import App from './App.tsx'

amplitude.initAll(import.meta.env.VITE_AMPLITUDE_API_KEY)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
