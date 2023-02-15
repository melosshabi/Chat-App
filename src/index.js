import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

const forceSlashAfterHash = () => {

    let _hash = window.location.hash;
    
    if (_hash[1] && _hash[1] !== '/') {

        window.location.href = window.location.origin + window.location.pathname + window.location.search + "#/" + _hash.slice(1);

    }

}

forceSlashAfterHash();

window.addEventListener('hashchange', forceSlashAfterHash);

