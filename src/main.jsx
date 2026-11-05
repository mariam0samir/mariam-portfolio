import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Portfolio from './Portfolio'
import AdminApp from './admin/AdminApp'
import './styles/site.css'
import './styles/admin.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
