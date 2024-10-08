import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLoginSuccess }) => {

    // State variables for username, password, and error messages
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook to programmatically navigate

    // Function to handle login logic
    const handleLogin = async () => {
        try {
            // POST request to the login API
            const response = await axios.post('https://localhost:7193/api/auth/login', {
                username,
                password,
            });

            const token = response.data.token; // Retrieve the token from response

            if (token) {
                // Store the token in local storage and update logged in user state
                localStorage.setItem('authToken', token);        
                const user = { username };
                onLoginSuccess(token, user); // Callback to update login state

                 // Reset input fields and navigate to the chat page
                setUsername('');
                setPassword('');
                navigate('/chat');
            } else {
                setError('Login failed. Invalid credentials.');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError('Login failed. Please check your credentials.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login or register an account</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    required
                />
                <button type="submit">Login</button>
                {error && <div className="error-message">{error}</div>}
            </form>
            <Link to="/register" style={{ color: 'white', marginTop: '10px' }}>Register new account</Link>
        </div>
    );
};

export default Login;
