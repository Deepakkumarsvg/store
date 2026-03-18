# 🚀 StockForge - Complete Setup Guide

Step-by-step guide to run the complete StockForge ERP application (Frontend + Backend).

## Prerequisites

Before starting, ensure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or cloud) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - For version control

## 📋 Setup Instructions

### Step 1: Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Cloud (Atlas)**
- Create free cluster at [mongodb.com](https://www.mongodb.com/cloud/atlas)
- Get connection string
- Update backend `.env` with your connection string

---

### Step 2: Setup Backend

1. **Navigate to backend directory:**
```bash
cd StockForge-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
Backend `.env` file should contain:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockforge
NODE_ENV=development
```

4. **Start backend server:**
```bash
npm run dev
```

✅ Backend should be running at: `http://localhost:5000`

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
```

---

### Step 3: Setup Frontend

Open a **new terminal** and:

1. **Navigate to frontend directory:**
```bash
cd StockForge
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
Frontend `.env` file should contain:
```
VITE_API_URL=http://localhost:5000/api
```

4. **Start development server:**
```bash
npm run dev
```

✅ Frontend should be running at: `http://localhost:5173`

---

## 🎯 Access the Application

Open your browser and go to:
```
http://localhost:5173
```

You should see the StockForge dashboard with the sidebar navigation.

---

## 🧪 Testing the Connection

### 1. Check Backend Health
Open browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "StockForge API is running"
}
```

### 2. Test Dashboard API
```bash
curl http://localhost:5000/api/dashboard/stats
```

### 3. Test Frontend-Backend Connection
1. Go to Dashboard page
2. Open browser DevTools (F12)
3. Check Console for API calls
4. Should see successful API responses

---

## 📝 Common Issues & Solutions

### Backend Issues

**Problem:** MongoDB connection error
```
❌ Error: connect ECONNREFUSED ::1:27017
```
**Solution:** 
- Ensure MongoDB is running: `mongod`
- Check MongoDB URI in `.env`

**Problem:** Port 5000 already in use
**Solution:**
- Change PORT in `.env` to 5001
- Update frontend `.env` VITE_API_URL accordingly

### Frontend Issues

**Problem:** Cannot connect to backend
**Solution:**
- Ensure backend is running
- Check `.env` has correct API URL
- Check browser console for CORS errors

**Problem:** CORS errors
**Solution:**
- Backend has CORS enabled by default
- Ensure `cors` package is installed in backend

---

## 🗂️ Project Structure

```
myapp/
├── StockForge/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── css/
│   ├── .env                 # Frontend config
│   └── package.json
│
└── StockForge-backend/      # Backend (Node.js + Express)
    ├── models/              # MongoDB schemas
    ├── routes/              # API endpoints
    ├── config/              # Database config
    ├── .env                 # Backend config
    └── server.js
```

---

## 🎨 Features Now Working

✅ **Dashboard** - Shows real-time stats from database  
✅ **Products** - Create, view, delete products  
✅ **Suppliers** - Manage supplier information  
✅ **Customers** - Manage customer database  
✅ **Units** - Define measurement units  
✅ **Purchases** - Create purchase orders (partial)  

---

## 🔄 Development Workflow

### Both servers running concurrently:

**Terminal 1 (Backend):**
```bash
cd StockForge-backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd StockForge
npm run dev
```

Both will auto-reload on file changes!

---

## 🛠️ Next Steps

1. **Add sample data** - Create some products, suppliers, customers
2. **Test CRUD operations** - Try creating, editing, deleting records
3. **Explore all pages** - Navigate through sidebar menu
4. **Check dashboard stats** - Should update as you add data

---

## 📚 API Documentation

Backend API endpoints:
- **Health Check:** `GET /api/health`
- **Dashboard:** `GET /api/dashboard/stats`
- **Products:** `GET|POST|PUT|DELETE /api/products`
- **Suppliers:** `GET|POST|PUT|DELETE /api/suppliers`
- **Customers:** `GET|POST|PUT|DELETE /api/customers`
- **Units:** `GET|POST|PUT|DELETE /api/units`
- **Purchases:** `GET|POST|PUT|DELETE /api/purchases`
- And more...

---

## 💡 Tips

- Use **Chrome DevTools** Network tab to debug API calls
- Check **MongoDB Compass** to view database records
- Backend logs show all incoming requests
- Frontend console logs show loading/error states

---

## 🆘 Need Help?

1. Check terminal output for error messages
2. Verify both servers are running
3. Check `.env` files are configured correctly
4. Ensure MongoDB is running and accessible

Happy coding! 🚀
