import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'animal-island-ui/dist/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
