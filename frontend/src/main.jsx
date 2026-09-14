import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './app/App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

import AuthInitializer from './features/auth/components/AuthInitializer.jsx'
import CareerProfileInitializer from './features/career-profile/components/CareerProfileInitializer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <AuthInitializer>

        <CareerProfileInitializer>

          <App />

        </CareerProfileInitializer>

      </AuthInitializer>
    </GoogleOAuthProvider >
  </StrictMode>,
)
