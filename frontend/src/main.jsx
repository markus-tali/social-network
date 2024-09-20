import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from "./pages/App.jsx";
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
