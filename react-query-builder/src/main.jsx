import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

window.QueryBuilderApp = { default: App };
window.ReactDOM = ReactDOM;
window.React = React; // ✅ <-- ADD THIS LINE

console.log("window.QueryBuilderApp explicitly set:", window.QueryBuilderApp);
console.log("window.ReactDOM explicitly set:", window.ReactDOM);
console.log("window.React explicitly set:", window.React);

if (document.getElementById('root')) {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}
