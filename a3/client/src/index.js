import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <h1>
    <BrowserRouter>
      <Login />
    </BrowserRouter>
    </h1>
  </React.StrictMode>
);

