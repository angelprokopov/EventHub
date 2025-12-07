# 🎉 EventHub

EventHub is a full-stack event management platform built with **ASP.NET Core Web API**, **React**, and **SQL Server**, featuring authentication, event CRUD operations, likes, comments, weather/map integrations, and full cloud deployment on **Azure**.

---

## 🚀 Tech Stack

### **Backend**
![.NET 8](https://img.shields.io/badge/.NET-8.0-purple?logo=dotnet)
![Entity Framework Core](https://img.shields.io/badge/EF%20Core-8.0-blue?logo=database)
![SQL Server](https://img.shields.io/badge/SQL%20Server-A4A4A4?logo=microsoftsqlserver&logoColor=white)
![JWT Auth](https://img.shields.io/badge/JWT-Authentication-green?logo=jsonwebtokens)

### **Frontend**
![React](https://img.shields.io/badge/React-Vite-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![React Router](https://img.shields.io/badge/React%20Router-6-red?logo=reactrouter)
![Context API](https://img.shields.io/badge/Context%20API-State%20Management-yellow)

### **Cloud**
![Azure App Service](https://img.shields.io/badge/Azure-App%20Service-0089D6?logo=microsoftazure)
![Azure SQL](https://img.shields.io/badge/Azure-SQL%20Database-0078D4?logo=microsoftazure)
![Azure Static Web Apps](https://img.shields.io/badge/Azure-Static%20Web%20Apps-3468C0?logo=microsoftazure)

---

## 📦 Features

- 🔐 **JWT Authentication & Email Confirmation**
- 👤 **User Registration & Login**
- 📝 **Create / Edit / Delete Events**
- 👍 **Event Likes**
- 💬 **Comment System**
- 🗺️ **Map Integration (Leaflet / OpenStreetMap)**
- 🌦️ **Weather Integration (OpenWeather API)**
- 📱 **Responsive Frontend**
- ☁️ **Full Deployment on Azure (API + Frontend + SQL Database)**

---

## 📁 Project Structure

```
/EventHub.Api       → ASP.NET Core 8 Web API  
/web                → React + Vite frontend  
```

---

## 🛠️ Installation

### **1️⃣ Clone the repository**
```sh
git clone https://github.com/<your-username>/EventHub.git
cd EventHub
```

---

## 🗄️ Backend Setup (API)

### **2️⃣ Install dependencies**
```sh
cd EventHub.Api
dotnet restore
```

### **3️⃣ Configure appsettings.json**
Update connection string and JWT key:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=EventHub;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "your-secret-key"
  }
}
```

---

### **4️⃣ Apply Migrations**
```sh
dotnet ef database update
```

---

### **5️⃣ Run the API**
```sh
dotnet run
```

Swagger will be available at:

👉 https://localhost:7132/swagger

Also, you can access the API from this address:
👉 https://eventhubapi-hehvaravgzcpbdf5.canadacentral-01.azurewebsites.net/swagger
---

## 🌐 Frontend Setup (React)

### **6️⃣ Install dependencies**
```sh
cd web
npm install
```

### **7️⃣ Configure `.env`**
```
VITE_API_URL=https://localhost:7132
VITE_OPENWEATHER_KEY=your-weather-api-key
```

### **8️⃣ Start the frontend**
```sh
npm run dev
```

Runs at:

👉 http://localhost:5173

Also, you can access the web app from this address

👉 https://delightful-wave-04ffdbf03.3.azurestaticapps.net/ 
---

## ☁️ Deployment Instructions

### **🔵 Deploy API to Azure App Service**
1. Publish from Visual Studio  
2. Use runtime: **.NET 8 (LTS)**  
3. Add environment variables:  
   - `ConnectionStrings__DefaultConnection`  
   - `Jwt__Key`  
4. Redeploy & restart app

---

### **🟦 Deploy Frontend to Azure Static Web Apps**
GitHub Actions config:

```yml
app_location: "web"
api_location: ""
output_location: "dist"
```

---

## 🔧 CORS Configuration

Place in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("react", policy =>
        policy.WithOrigins(
            "http://localhost:5173",
            "https://<your-static-app>.azurestaticapps.net"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
    );
});
```

---

## 📄 License
MIT License

---

## 🙌 Author
Built by **Angel** as a full-stack development project.
