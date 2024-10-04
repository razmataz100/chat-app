// src/App.js
import React, { useState } from 'react';
import './App.css';
import Chat from './components/Chat';
import Login from './components/Login'; // Import the Login component

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null); // Changed to store user object

    const handleLoginSuccess = (token, user) => {
        setIsLoggedIn(true);
        setToken(token);
        setLoggedInUser(user); // Set the logged in user
    };

    return (
        <div className="app">
            {!isLoggedIn ? (
                <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
                <Chat loggedInUser={loggedInUser} token={token} />
            )}
        </div>
    );
};

export default App;
