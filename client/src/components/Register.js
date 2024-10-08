// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; 

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Function to handle registration logic
    const handleRegister = async () => {
        try {
            // Send a POST request to the registration API
            await axios.post('https://localhost:7193/api/auth/register', {
                username,
                password,
            });
            setSuccess(true);
            setUsername('');
            setPassword('');
            setError('');
        } catch (err) {
            console.error('Registration failed:', err);
            setError('Registration failed. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleRegister();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRegister();
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Create an Account</h2>
            
            {success ? (
                <div>
                    <h3 className="success-message">Registration successful!</h3>
                    <button onClick={() => navigate('/')}>Back to Login</button>
                </div>
            ) : (
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
                    <button type="submit">Register</button>
                    {error && <div className="error-message">{error}</div>}
                </form>
            )}
            <div className="back-link">
                <span onClick={() => navigate('/')}>Back to Login</span>
            </div>
        </div>
    );
};

export default Register;
