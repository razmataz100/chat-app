import React, { useEffect, useState, useRef } from 'react';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import './Chat.css';

const Chat = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const connectionRef = useRef(null);

    useEffect(() => {
        const connect = async () => {
            const newConnection = new HubConnectionBuilder()
                .withUrl('https://localhost:7193/chathub')
                .build();

            if (connectionRef.current !== newConnection) {
                connectionRef.current = newConnection;

                newConnection.on('ReceiveMessage', (user, message) => {
                    const newMessage = { user, message };
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

        return () => {
            if (connectionRef.current) {
                connectionRef.current.off('ReceiveMessage');
                connectionRef.current.stop();
                console.log('Connection stopped');
            }
        };
    }, []);

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

    const handleButtonClick = (e) => {
        e.preventDefault();
        sendMessage();
    };

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
