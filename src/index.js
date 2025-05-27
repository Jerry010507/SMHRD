import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // ✅ 이 줄이 반드시 있어야 함

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
