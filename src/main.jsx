import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CareAgent from "./CareAgent_Combined";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <CareAgent />
  </StrictMode>,
)
