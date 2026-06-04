import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { TeamProvider } from './context/TeamContext'
import App from './App'
import './styles/globals.css'
import './styles/animations.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <TeamProvider>
          <App />
        </TeamProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
