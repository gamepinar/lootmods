import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LootProvider } from './context/LootContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import './index.css'

console.log(
  "%c¡ALTO!",
  "color: #ff2a2a; font-size: 45px; font-weight: 900; text-shadow: 0 0 15px rgba(255, 42, 42, 0.6); font-family: sans-serif;"
);
console.log(
  "%cEsta función del navegador está diseñada únicamente para desarrolladores. Si alguien te indicó que copiaras y pegaras código aquí para obtener características ocultas o 'hackear' el sitio, es una estafa y les dará acceso total a tu cuenta o sesión.",
  "font-size: 16px; color: #f8fafc; font-family: sans-serif; line-height: 1.5; padding: 5px;"
);

console.log(
  "%cSTOP!",
  "color: #ff2a2a; font-size: 45px; font-weight: 900; text-shadow: 0 0 15px rgba(255, 42, 42, 0.6); font-family: sans-serif;"
);
console.log(
  "%cThis browser feature is intended for developers only. If someone told you to copy and paste code here to get hidden features or 'hack' the site, it is a scam and will give them full access to your account or session.",
  "font-size: 16px; color: #f8fafc; font-family: sans-serif; line-height: 1.5; padding: 5px;"
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LootProvider>
          <App />
        </LootProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
