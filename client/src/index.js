import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Ensure your CSS file path is correct
import App from './App'; // Correctly import your App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
