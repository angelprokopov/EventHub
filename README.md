
# EventHub – Full‑Stack Event Management Platform

EventHub is a full‑stack web application built with **ASP.NET Core Web API**, **React + Vite**, **SQL Server / Azure SQL**, and **JWT authentication**.  
It allows users to discover, create, like, and comment on events, enhanced with features such as interactive maps and real‑time weather data.

---

## 🚀 Features

### **Backend (ASP.NET Core 7/8 Web API)**
- JWT authentication & authorization  
- Entity Framework Core 7/8 with SQL Server  
- Email confirmation via SMTP  
- Event CRUD operations  
- Comment system  
- Like functionality  
- Azure SQL compatible  
- Swagger documentation  

### **Frontend (React + Vite)**
- Authentication system (login/register)  
- Event listing, search, and details  
- Map component using OpenStreetMap / Leaflet  
- Weather widget using OpenWeather API  
- Protected routes with Context API  
- Polished UI with custom styling  

### **Deployment**
- Backend deployed to **Azure App Service**  
- Frontend deployed to **Azure Static Web Apps**  
- Connected to **Azure SQL Database**

---

## 📦 Technologies Used

| Layer | Technology |
|------|------------|
| API | ASP.NET Core 7/8, EF Core, SQL Server, JWT |
| Frontend | React 18, Vite, React Router, Context API |
| Database | SQL Server / Azure SQL |
| Deployment | Azure App Service, Azure Static Web Apps |
| Add‑ons | OpenWeather API, Leaflet Maps |

---

## 🛠 Installation & Setup

### 1️⃣ **Clone the repository**
```bash
git clone https://github.com/YOUR_NAME/EventHub.git
cd EventHub
```

---

## 🗄 Backend Setup (API)

### 2️⃣ Install dependencies
```bash
cd EventHub.Api
dotnet restore
```

### 3️⃣ Configure appsettings.json
Create **appsettings.Development.json**:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_LOCAL_OR_AZURE_CONNECTION_STRING"
  },
  "Jwt": {
    "Key": "YOUR_SECRET_KEY"
  },
  "SMTP": {
    "Host": "smtp.gmail.com",
    "Port": 587,
    "User": "your@gmail.com",
    "Pass": "your-app-password"
  }
}
```

---

### 4️⃣ Apply database migrations
```bash
dotnet ef database update
```

---

### 5️⃣ Run the API
```bash
dotnet run
```
API will run at:  
**https://localhost:7132** (or the port shown in console)

---

## 🎨 Frontend Setup (React)

### 6️⃣ Install frontend dependencies
```bash
cd web
npm install
```

### 7️⃣ Configure environment variables  
Create a **.env** file:
```
VITE_API_URL=https://localhost:7132
VITE_WEATHER_KEY=YOUR_OPENWEATHER_KEY
```

### 8️⃣ Start the frontend
```bash
npm run dev
```

Frontend runs at:  
**http://localhost:5173**

---

## ☁️ Azure Deployment

### 🔹 Deploy API to Azure App Service
1. Create an Azure App Service  
2. Set runtime to **.NET 8 (LTS)**  
3. Upload Publish Profile (from Visual Studio or Azure portal)  
4. Update **ConnectionStrings** & **JWT Key** in Azure → *Configuration*  
5. Redeploy

### 🔹 Deploy Frontend to Azure Static Web Apps
1. Create a new Static Web App  
2. Select GitHub → Your Repository  
3. Use these settings:

| Setting | Value |
|--------|-------|
| App location | `web/` |
| API location | *(empty)* |
| Output folder | `dist` |

---

## 🔄 CORS Configuration

In **Program.cs**:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("react", policy =>
        policy.WithOrigins(
            "http://localhost:5173",
            "https://YOUR_STATIC_APP.azurestaticapps.net"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
    );
});
```

In Azure App Service → **CORS settings**, leave empty if using code-based CORS (recommended).

---

## 📄 License
MIT License – free to use & modify.

---

## 🙌 Author
Built by **Angel** as part of a full‑stack development project.

