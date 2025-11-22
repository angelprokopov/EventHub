# EventHub

![.NET](https://img.shields.io/badge/.NET-7.0-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Bundler-646cff?style=for-the-badge&logo=vite&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-Database-red?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)
![License](https://img.shields.io/badge/License-Educational-green?style=for-the-badge)

---

## 📌 Overview

**EventHub** is a full-stack web application where users can **discover, create, and manage community events**.  
It features a modern **React + Vite frontend**, a secure **ASP.NET Core 7 Web API backend**, **JWT authentication**, and **SQL Server storage**.  

Designed with clean architecture principles, modular folders, and a polished UI.

---

## 📚 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#️-installation)
- [Backend Setup](#-backend-setup-aspnet-core-api)
- [Frontend Setup](#-frontend-setup-react--vite)
- [Running the Full Application](#-running-the-full-application)
- [Database Migrations](#-database-migrations-ef-core)
- [Authentication](#-authentication)
- [Features](#-features-overview)
- [Author](#-author)

---

## 🚀 Tech Stack

### **Backend**
- ASP.NET Core 7 Web API  
- Entity Framework Core 7  
- SQL Server  
- JWT Authentication  

### **Frontend**
- React 18  
- Vite  
- React Router  
- Context API  
- TypeScript  
- Custom CSS Styling  

---

## 📁 Project Structure

```
EventHub/
│
├── EventHub.Api/              # ASP.NET Core 7 Web API backend
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── Migrations/
│   └── appsettings.json
│
└── web/                       # React + Vite frontend
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── contexts/
    │   ├── hooks/
    │   ├── pages/
    │   └── styles/
    └── index.html
```

---

## 🛠️ Installation

### **Prerequisites**
- Node.js 18+
- .NET SDK 7+
- SQL Server or LocalDB
- npm package manager

---

## 🔧 Backend Setup (ASP.NET Core API)

### 1️⃣ Navigate to API folder

```bash
cd EventHub.Api
```

### 2️⃣ Add your connection string in `appsettings.json`

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=EventHubDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

### 3️⃣ Run EF Core migrations

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 4️⃣ Start the API

```bash
dotnet run
```

Default API URL:

```
https://localhost:7043
```

---

## 🎨 Frontend Setup (React + Vite)

### 1️⃣ Navigate to the frontend folder

```bash
cd web
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start the Vite dev server

```bash
npm run dev
```

Frontend URL:

```
http://localhost:5173
```

---

## 🔗 Running the Full Application

You must start **both**:

### ✔️ API (backend)
```
cd EventHub.Api
dotnet run
```

### ✔️ React App (frontend)
```
cd web
npm run dev
```

---

## 🗄️ Database Migrations (EF Core)

### Add new migration
```bash
dotnet ef migrations add MigrationName
```

### Update database
```bash
dotnet ef database update
```

### Remove last migration
```bash
dotnet ef migrations remove
```

---

## 🔒 Authentication

EventHub uses **JWT Bearer Tokens** to secure:

- User registration  
- User login  
- Protected API routes  
- Event ownership (edit/delete)  
- User-specific actions (likes, comments)

Tokens are stored client-side and automatically attached to requests.

---

## ⭐ Features Overview

- Beautiful polished UI (Home, Catalog, Details)
- User registration & login (JWT)
- Create/Edit/Delete events
- Event search
- Event likes
- Comments system
- Private routes (protected pages)
- Public-only pages (login/register hidden when logged in)
- React Context for authentication
- Clean reusable components
- Responsive layout and modern styling

---

## 👤 Author

Developed by **Angel** as part of a full-stack development project.

---
