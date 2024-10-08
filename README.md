# Chat Application

## Overview
This project is a real-time chat application built with React for the client-side and .NET for the server-side using SignalR for real-time communication. It utilizes Entity Framework Core for data management and SQL Server as the database.

## Project Structure
- **client/**: Contains the React application.
- **server/**: Contains the .NET server application, including database context and services.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (for the client)
- [.NET SDK](https://dotnet.microsoft.com/download) (for the server)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (for the database)

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

### Database Setup
- This application uses SQL Server and Entity Framework Core for data management.
- Ensure SQL Server is installed and running.
- Update the connection string in `appsettings.json` within the `server` directory to point to your local SQL Server instance. 
    ```json
    "ConnectionStrings": {
        "DefaultConnection": "Server=localhost;Database=ChatAppDb;Trusted_Connection=True;"
    }
    ```

### Applying Migrations
1. **Open a Terminal**:
   - Navigate to the `server` directory.

2. **Create and Update the Database**:
   - Run the following command to create the database and apply the existing migrations:
     ```bash
     dotnet ef database update
     ```
   - This command will create the database (`ChatAppDb`) and the necessary tables based on the existing migration. If the database already exists, it will apply any pending migrations.

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