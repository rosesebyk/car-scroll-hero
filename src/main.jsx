import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

console.log(
  '%c Built by Rose Seby %c scroll → speed ',
  'background:#ff4d2e;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:700',
  'background:#111;color:#ff4d2e;padding:4px 8px;border-radius:0 4px 4px 0'
)

createRoot(document.getElementById('root')).render(<App />)
