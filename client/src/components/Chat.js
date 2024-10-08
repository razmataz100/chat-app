import React, { useEffect, useState, useRef } from 'react';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import DOMPurify from 'dompurify';
import './Chat.css';

const Chat = ({ loggedInUser, onLogout }) => { 
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const connectionRef = useRef(null);
    const domPurifyConf = {};

    const username = loggedInUser?.username;

    //connection to the SignalR Hub and message receiving
    useEffect(() => {
        const connect = async () => {
            try {
                const newConnection = new HubConnectionBuilder()
                    .withUrl('https://localhost:7193/chathub', {
                        accessTokenFactory: () => localStorage.getItem('token'),
                    })
                    .build();

                // Listen for incoming messages
                newConnection.on('ReceiveMessage', (user, message) => {
                    const sanitizedUser = DOMPurify.sanitize(user, domPurifyConf);
                    const sanitizedMessage = DOMPurify.sanitize(message, domPurifyConf);
                    const newMessage = { user: sanitizedUser, message: sanitizedMessage };
                    setMessages((prev) => [...prev, newMessage]);
                });

                await newConnection.start();
                setIsConnected(true);
                connectionRef.current = newConnection;

            } catch (err) {
                console.error('Connection failed:', err);
                setError('Failed to connect to the chat. Please check your connection.');
                setIsConnected(false);
            }
        };

        connect();

        // Cleanup connection when component unmounts
        return () => {
            if (connectionRef.current) {
                connectionRef.current.off('ReceiveMessage');
                connectionRef.current.stop().catch(err => console.error('Error stopping connection:', err));
            }
        };
    }, []);

    // Sends a message to the chat if the connection is established
    const sendMessage = async () => {
        if (connectionRef.current && message) {
            if (connectionRef.current.state === HubConnectionState.Connected) {
                try {
                    await connectionRef.current.invoke('SendMessage', username, message);
                    setMessage('');
                    setError('');
                } catch (sendError) {
                    console.error('Message sending failed:', sendError);
                    setError('Failed to send message. Please try again.');
                }
            } else {
                console.error('Connection is not established. Cannot send message.');
                setError('Cannot send message. Connection is not established.');
            }
        }
    };

    // Handles button click for sending a message
    const handleButtonClick = (e) => {
        e.preventDefault();
        sendMessage();
    };

    // Handles key down events to send messages when Enter is pressed
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    // Handles user logout
    const handleLogout = () => {
        onLogout();
    };

    return (
        <div className="chat-container">
            <h1 className="chat-title">Hey, what's up {username}?</h1>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <input
                type="text"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button className="button" onClick={handleButtonClick} disabled={!isConnected}>Send</button>

            {error && <div className="error-message">{error}</div>}

            <div className="message-container">
                {messages.slice().reverse().map((msg, index) => (
                    <div className={`message ${msg.user === username ? 'sent' : 'received'}`} key={index}>
                        {msg.user === username ? (
                            <strong className="sent-username">{msg.user}</strong>
                        ) : (
                            <strong className="received-username">{msg.user}</strong>
                        )}
                        <div>{msg.message}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chat;
