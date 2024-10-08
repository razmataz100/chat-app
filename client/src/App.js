// src/App.js
import React, { useState } from 'react';
import './App.css';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);

     // Updates login state and stores token and user info upon successful login
    const handleLoginSuccess = (token, user) => {
        setIsLoggedIn(true);
        setToken(token);
        setLoggedInUser(user);
    };
    
    // Resets login state and clears stored token and user info on logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        setToken('');
        setLoggedInUser(null);
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/chat" element={isLoggedIn ? <Chat loggedInUser={loggedInUser} onLogout={handleLogout} /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
