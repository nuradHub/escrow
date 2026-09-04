import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import ContextProvider from './context/ContextProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'aos/dist/aos.css';

axios.defaults.withCredentials = true

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter >
      <ContextProvider>
        <App />
      </ContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
