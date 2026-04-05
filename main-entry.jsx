import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './main.jsx'
import BaseCientifica from './base-cientifica.jsx'
import EstudoPage from './estudo-page.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/base-cientifica" element={<BaseCientifica />} />
        <Route path="/estudo/:slug" element={<EstudoPage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
