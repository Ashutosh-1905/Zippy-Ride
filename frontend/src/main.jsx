import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserContextProvider } from './context/UserContext.jsx';
import { CaptainContextProvider } from './context/CaptainContext.jsx';
import { SocketContextProvider } from './context/SocketContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <SocketContextProvider>
                <UserContextProvider>
                    <CaptainContextProvider>
                        <App />
                    </CaptainContextProvider>
                </UserContextProvider>
            </SocketContextProvider>
        </BrowserRouter>
    </React.StrictMode>,
);