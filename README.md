# AluminumSystem

An ERP system for aluminum production management, consisting of three parts: a .NET Core backend API, a React frontend, and a SQL Server database.

## Project Structure

```
AluminumSystem/
├── Backend/
│   └── AluminumProdctionBackend/   # ASP.NET Core Web API
├── Frontend/
│   └── aluminum-erp/               # React app (Vite)
└── DataBase/
    └── AluminumSystem_DB.sql       # SQL Server database script
```

## Prerequisites

Before running this project, make sure you have the following installed:

- [.NET SDK](https://dotnet.microsoft.com/download) (matching the project's target version)
- [Node.js and npm](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/sql-server) (Express or Developer edition is fine)
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms)
- Visual Studio 2022 (recommended for the backend) or any C# capable IDE

## Setup Instructions

**Important:** This project has three parts that must all be running together. Follow the steps below in order.

### 1. Database Setup

1. Open SQL Server Management Studio (SSMS) and connect to your local SQL Server instance.
2. Open the file `DataBase/AluminumSystem_DB.sql`.
3. Execute the script. This will create the database and all required tables.
4. Note the server/instance name — you'll need it for the backend connection string.

### 2. Backend Setup (.NET Core API)

1. Open `Backend/AluminumProdctionBackend` in Visual Studio (open the `.sln` file).
2. Open `appsettings.json` and update the connection string to point to your local SQL Server instance and the database created in step 1.
3. Restore NuGet packages (Visual Studio usually does this automatically on open/build).
4. Run the project (press `F5` in Visual Studio, or run `dotnet run` from a terminal inside the project folder).
5. Confirm the API is running (check the console output or Swagger page, if enabled) and note the port/URL it's running on.

### 3. Frontend Setup (React)

1. Open a terminal (CMD/PowerShell).
2. Navigate to the frontend folder:
   ```
   cd Frontend/aluminum-erp
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open the URL shown in the terminal (typically `http://localhost:5173`).

## Running Order

For everything to work correctly, start the parts in this order:

1. SQL Server (usually running as a Windows service already)
2. Backend API (must be running before the frontend, since the frontend calls it)
3. Frontend (`npm run dev`)

## Notes

- If the frontend can't reach the backend, check that the backend URL/port in the frontend's API config matches where the backend is actually running.
- Do not commit real database credentials or passwords to `appsettings.json` — use `appsettings.Development.json` (excluded via `.gitignore`) or environment variables for sensitive values.
- If you get a database connection error, double-check the connection string and make sure the SQL Server service is running.
