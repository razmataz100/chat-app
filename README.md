# Chat Application

## Overview
This project is a real-time chat application built with React for the client-side and .NET for the server-side using SignalR for real-time communication.

## Project Structure
- **client/**: Contains the React application.
- **server/**: Contains the .NET server application.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (for the client)
- [.NET SDK](https://dotnet.microsoft.com/download) (for the server)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/razmataz100/chat-app
    cd chat-app
    ```

2. **Setup the Client**:
    ```bash
    cd client
    npm install
    ```

3. **Setup the Server**:
    ```bash
    cd ../server
    dotnet restore
    ```

### Running the Application

#### Running the Server
1. Open a terminal and navigate to the `server` directory.
2. Run the following command:
    ```bash
    dotnet run
    ```
3. The server will start and listen on `https://localhost:7193/chathub`.

#### Running the Client
1. Open a new terminal and navigate to the `client` directory.
2. Run the following command:
    ```bash
    npm start
    ```
3. The client will open in your browser at `http://localhost:3000`.

### Usage
- Enter a username and a message in the input fields.
- Click the "Send" button or press Enter to send the message.

### Features
- Real-time messaging using SignalR
- Input sanitization to prevent XSS attacks