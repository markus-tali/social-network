import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Register } from "./pages/register.jsx";
import './index.css'

const rootElement = document.getElementById('root'); // Ensure this element exists in your HTML

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <header>
      <h1>Hey</h1>
    </header>
    <Register />  {/* Render the Register component */}
  </StrictMode>
);


console.log('made it to main.js')
