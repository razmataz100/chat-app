import React, { useEffect, useState, useRef } from 'react';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import DOMPurify from 'dompurify';
import './Chat.css';

const Chat = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const connectionRef = useRef(null);
    const domPurifyConf = {};

    useEffect(() => {
        // Establishes a connection to the SignalR hub and sets up message reception
        const connect = async () => {
            const newConnection = new HubConnectionBuilder()
                .withUrl('https://localhost:7193/chathub')
                .build();
    
            if (connectionRef.current !== newConnection) {
                connectionRef.current = newConnection;
                
                // Handles incoming messages and sanitizes user input
                newConnection.on('ReceiveMessage', (user, message) => {
                    const sanitizedUser = DOMPurify.sanitize(user, domPurifyConf); // Sanitize username
                    const sanitizedMessage = DOMPurify.sanitize(message, domPurifyConf); // Sanitize message
                    
                    const newMessage = { user: sanitizedUser, message: sanitizedMessage };
                    setMessages((prev) => [...prev, newMessage]);
                    console.log('Received message:', newMessage);
                });
                
            }
    
            try {
                await newConnection.start();
                console.log('Connection established');
                setIsConnected(true);
            } catch (err) {
                console.error('Connection failed:', err);
                setIsConnected(false);
            }
        };
    
        connect();
        
        // Cleanup function to stop the connection on component unmount
        return () => {
            if (connectionRef.current) {
                connectionRef.current.off('ReceiveMessage');
                connectionRef.current.stop();
                console.log('Connection stopped');
            }
        };
    }, []);

    // Sends the message to the SignalR hub
    const sendMessage = async () => {
        console.log('sendMessage called');
        if (!username) {
            setError('Please enter a username.');
            return;
        }

        if (connectionRef.current && message) {
            if (connectionRef.current.state === HubConnectionState.Connected) {
                await connectionRef.current.invoke('SendMessage', username, message);
                setMessage('');
                setError('');
                console.log('Sent message:', { user: username, message });
            } else {
                console.error('Connection is not established. Cannot send message.');
                setError('Cannot send message. Connection is not established.');
            }
        }
    };

    // Handles button click for sending the message
    const handleButtonClick = (e) => {
        e.preventDefault();
        sendMessage();
    };

    // Handles key down event to send message on Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <h1 className="chat-title">Hey, what's up?</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                }}
            />
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
