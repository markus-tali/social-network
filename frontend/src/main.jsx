import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Register } from "./pages/register.jsx";
import { Footer } from "./pages/footer.jsx"
import { Login } from "./pages/login.jsx";
import './index.css'

const rootElement = document.getElementById('root'); // Ensure this element exists in your HTML

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <>
      <Login />
      <Register /> 
      <Footer/>
    </>
  </StrictMode>
);


