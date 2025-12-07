import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-all duration-300">
      <App />
    </div>
  </StrictMode>,
)
