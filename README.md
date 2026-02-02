# ShipThis - Carbon-Efficient Route Optimization

A full-stack application for calculating and comparing carbon emissions across different transportation routes.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Project Status](#project-status)
- [Known Limitations](#known-limitations)

## ✨ Features

### ✅ Implemented

1. **Carbon Emissions Calculator** - Calculates carbon emissions for transporting cargo between two locations
2. **Shortest Route** - Determines the distance-based shortest route
3. **Most Efficient Route** - Determines the route with lowest CO₂ emissions
4. **Map Visualization** - Visualizes both routes on an interactive map-based UI
5. **User Authentication** - Complete JWT-based authentication system with login, register, and token refresh
6. **Search History** - Stores and retrieves previous route searches for authenticated users

### ⚠️ Known Limitations

- **Land Routes Only**: Since Mapbox is optimized for land-based routing, only land-based routes are calculated and displayed. Air and sea routes are not currently supported.
- **Route Coincidence**: The shortest route typically produces the least carbon emissions (less fuel consumption), so both the "shortest" and "most efficient" routes coincide on the map.

## 🛠 Tech Stack

### Backend

- **Framework**: FastAPI (Python)
- **Database**: MongoDB (with Beanie ODM)
- **Cache**: Redis
- **Authentication**: JWT with refresh token rotation
- **Routing API**: Mapbox Directions API
- **Package Manager**: uv

### Frontend

- **Framework**: React + TypeScript
- **Routing**: TanStack Router
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Package Manager**: npm/pnpm/bun

## 🚀 Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB instance (local or cloud)
- Redis instance (local or cloud)
- Mapbox API token

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create `.env.development` file**

   ```bash
   touch .env.development
   ```

3. **Add environment variables** (paste values sent in the mail)

   ```env
 # please paste from the values sent in the mail
   ```

4. **Install dependencies** (uv will handle this automatically when running)

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Create `.env.development` file**

   ```bash
   touch .env.development
   ```

3. **Add environment variables** (paste values sent in the mail)

   ```env
 # please paste from the values sent in the mail

   ```

4. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
uv run uvicorn src.app.main:app --reload --host 0.0.0.0 --port 5000
```

The backend API will be available at `http://localhost:5000`

- API Documentation: `http://localhost:5000/docs`
- Alternative Docs: `http://localhost:5000/redoc`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
# or
pnpm dev
# or
bun dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in terminal)

## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   └── app/
│   │       ├── config/          # Application settings
│   │       ├── connections/     # Database & Redis connections
│   │       ├── features/        # Feature modules
│   │       │   ├── auth/        # Authentication
│   │       │   ├── routes/      # Route calculation
│   │       │   └── search/      # Search history
│   │       ├── middleware/      # Custom middleware
│   │       ├── utils/           # Utilities
│   │       └── main.py          # Application entry point
│   └── .env.development         # Backend environment variables
│
└── frontend/
    ├── src/
    │   ├── components/          # Reusable UI components
    │   ├── features/            # Feature modules
    │   │   ├── auth/            # Authentication
    │   │   ├── route/           # Route calculation & visualization
    │   │   └── search/          # Search history
    │   ├── lib/                 # Libraries & utilities
    │   └── routes/              # Page routes
    └── .env.development         # Frontend environment variables
```


## 🤝 Architecture Highlights

- **Dependency Injection**: Services and repositories use constructor-based DI
- **Repository Pattern**: Data access layer abstraction
- **Service Layer**: Business logic separation
- **Type Safety**: Full TypeScript on frontend, type hints on backend
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Logging**: Structured logging with rotation and compression

---

