import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Unregister any existing rogue service workers to fix blank screen caching issues
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister().then(
        () => console.log("Service Worker unregistered successfully."),
        (err) => console.log("Error unregistering Service Worker:", err)
      );
    }
  });
}

