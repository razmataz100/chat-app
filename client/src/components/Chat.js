import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import './Chat.css'; 

const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log("Chat component mounted"); 

        const connect = async () => {
            const newConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5207/chathub')
                .build();

            newConnection.on('ReceiveMessage', (user, message) => {
                console.log("Message received:", user, message); 
                const newMessage = { user, message };
                setMessages((prev) => [...prev, newMessage]);
            });

            await newConnection.start();
            console.log("Connected to SignalR server");
            setConnection(newConnection);
        };

        if (!connection) { // Only connect if there's no existing connection
            connect();
        }

        return () => {
            console.log("Chat component unmounted"); 
            if (connection) {
                connection.off('ReceiveMessage'); // Properly remove the listener
                connection.stop();
            }
        };
    }, [connection]); // Dependency on connection

    const sendMessage = async () => {
        console.log("Sending message:", message); 

        if (!username) {
            setError('Please enter a username.');
            return; 
        }

        if (connection && message) {
            await connection.invoke('SendMessage', username, message);
            setMessage(''); 
            setError(''); 
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault(); 
        sendMessage();
    };

    return (
        <div>
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
            />
            <button onClick={handleButtonClick}>Send</button>

            {error && <div className="error-message">{error}</div>} 

            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.user}:</strong> {msg.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chat;
