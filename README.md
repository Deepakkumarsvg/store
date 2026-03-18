# 📊 StockForge - Manufacturing ERP System

A full-stack **Manufacturing ERP (Enterprise Resource Planning)** application for managing production, inventory, purchases, sales, and business intelligence. Built with React, Node.js, and MongoDB.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-active-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Setup & Configuration](#setup--configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Features
- ✅ **Role-Based Access Control** - Admin, Manager, and User roles with granular permissions
- ✅ **Master Data Management** - Products, Suppliers, Customers, Units
- ✅ **Purchase Management** - Create, track, and manage purchase orders
- ✅ **Sales Management** - Manage customer sales orders and quotations
- ✅ **Inventory Tracking** - Real-time raw materials and finished goods stock management
- ✅ **Manufacturing Tracking** - Monitor production jobs from start to completion
- ✅ **Customer Enquiries** - Manage customer inquiries and follow-ups
- ✅ **Business Analytics** - Dashboard with KPIs, reports, and data insights
- ✅ **Excel Export** - Export data to Excel for reporting and analysis
- ✅ **Responsive Design** - Works on Desktop, Tablet, and Mobile devices

### Technical Features
- ✅ JWT-based authentication with token refresh
- ✅ API rate limiting and request validation
- ✅ Secure password hashing with bcryptjs
- ✅ MongoDB aggregation pipelines for complex queries
- ✅ Comprehensive error handling and logging
- ✅ Unit and integration test coverage

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.x - UI framework
- **Vite** 7.3.1 - Build tool and dev server
- **Material-UI** 7.3.9 - Component library
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express** 5.2.1 - Web framework
- **MongoDB** 9.3.0 - NoSQL database
- **Mongoose** - MongoDB ODM (Object Document Mapper)
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Jest & Supertest** - Testing frameworks

### DevOps & Tools
- **Environment Variables** (.env) - Configuration management
- **MongoDB Compass** - Database GUI (optional)
- **Postman** - API testing (optional)

---

## 📁 Project Structure

```
StockForge/
├── src/
│   ├── components/          # React components
│   │   ├── Layout/         # Main layout components
│   │   ├── ProtectedRoute.jsx
│   │   ├── ConfirmDialog.jsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Master/         # Master data pages
│   │   └── ...
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── context/            # React Context
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── css/                # Stylesheets
│   ├── App.jsx
│   └── main.jsx
├── .env                    # Environment variables
├── vite.config.js
└── package.json

StockForge-backend/
├── routes/                 # API route handlers
│   ├── auth.js
│   ├── products.js
│   ├── purchases.js
│   ├── sales.js
│   ├── customers.js
│   ├── suppliers.js
│   ├── dashboard.js
│   └── ...
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Purchase.js
│   ├── Sale.js
│   ├── Customer.js
│   ├── Supplier.js
│   └── ...
├── middleware/             # Express middleware
│   ├── auth.js            # JWT verification
│   ├── response.js        # Response formatting
│   └── validation.js      # Request validation
├── config/                 # Configuration files
│   └── db.js              # MongoDB connection
├── utils/                  # Utility functions
│   ├── responses.js
│   ├── pagination.js
│   └── sequence.js
├── tests/                  # Test files
│   ├── auth.validation.test.js
│   └── health.test.js
├── server.js              # Express server entry point
├── seedUser.js            # Seed initial user
├── .env                   # Environment variables
└── package.json
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** 16+ and **npm** 8+
- **MongoDB** 5.0+ (local or cloud)
- **Git**

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd StockForge
```

### Step 2: Backend Setup
```bash
cd StockForge-backend
npm install
```

### Step 3: Frontend Setup
```bash
cd ../StockForge
npm install
```

---

## ⚙️ Setup & Configuration

### Backend Configuration (.env)
Create a `.env` file in `StockForge-backend/`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/stockforge

# JWT
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
JWT_EXPIRE=30d

# Admin Credentials (for seeding)
ADMIN_EMAIL=deepak@gmail.com
ADMIN_NAME=Deepak
ADMIN_PASSWORD=Deepak@021242
```

### Frontend Configuration (.env)
Create a `.env` file in `StockForge/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### MongoDB Setup
#### Option 1: Local MongoDB
```bash
# Start MongoDB service
mongod

# Create database and collections (handled by Mongoose)
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockforge
```

---

## ▶️ Running the Application

### Start Backend Server
```bash
cd StockForge-backend

# Development with auto-reload
npm run dev

# Production
npm start
```

Backend runs on: **http://localhost:5000**

### Start Frontend Development Server
```bash
cd StockForge

# Development with hot reload
npm run dev

# Build for production
npm run build
```

Frontend runs on: **http://localhost:5173**

### Seed Initial Admin User
```bash
cd StockForge-backend
node seedUser.js
```

**Login Credentials:**
- Email: `deepak@gmail.com`
- Password: `Deepak@021242`

---

## 🔐 Authentication

### How It Works
1. User logs in with email and password
2. Backend verifies credentials and returns JWT token
3. Frontend stores token in localStorage
4. Subsequent API calls include token in Authorization header
5. Backend middleware verifies token before processing request

### Password Requirements
- Minimum 12 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*, etc.)

Example: `Deepak@021242` ✅

### Token Refresh
- Token expires in 30 days (configurable via `JWT_EXPIRE`)
- On token expiration, user is redirected to login page
- Token cleared from localStorage on logout

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user (protected) |
| POST | `/api/auth/logout` | User logout |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Purchases
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/purchases` | List all purchases |
| POST | `/api/purchases` | Create purchase order |
| PUT | `/api/purchases/:id` | Update purchase order |

### Sales
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales` | List all sales |
| POST | `/api/sales` | Create sales order |
| PUT | `/api/sales/:id` | Update sales order |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List all customers |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/:id` | Update customer |

### Suppliers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/suppliers` | List all suppliers |
| POST | `/api/suppliers` | Create supplier |
| PUT | `/api/suppliers/:id` | Update supplier |

### Dashboard & Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard KPIs |
| GET | `/api/reports` | Generate reports |

**Full API Documentation**: See API responses include standard format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message"
}
```

---

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/manager/user),
  status: String (Active/Inactive),
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  productCode: String (unique),
  productName: String,
  description: String,
  category: String,
  unit: Reference to Unit,
  quantity: Number,
  minLevel: Number,
  maxLevel: Number,
  costPrice: Number,
  sellingPrice: Number
}
```

### Purchase
```javascript
{
  poNumber: String (unique),
  supplier: Reference to Supplier,
  items: Array of {productId, quantity, price},
  totalAmount: Number,
  status: String (Pending/Confirmed/Delivered),
  deliveryDate: Date
}
```

### Sale
```javascript
{
  soNumber: String (unique),
  customer: Reference to Customer,
  items: Array of {productId, quantity, price},
  totalAmount: Number,
  status: String (Pending/Confirmed/Delivered),
  deliveryDate: Date
}
```

### Manufacturing
```javascript
{
  jobCode: String (unique),
  productId: Reference to Product,
  quantity: Number,
  status: String (Planning/In Progress/Completed),
  startDate: Date,
  endDate: Date
}
```

**Additional Models**: Customer, Supplier, Unit, RawMaterialStock, FinishedGood, Enquiry, Counter

---

## 🧪 Testing

### Run Tests
```bash
cd StockForge-backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Files
- `tests/auth.validation.test.js` - Authentication tests
- `tests/health.test.js` - Health check tests

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error: "EADDRINUSE: address already in use :::5000"**
```bash
# Kill process on port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

**Error: "MongoDB connection failed"**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify database credentials
- Test connection: `mongo "mongodb://localhost:27017/stockforge"`

### Authentication Issues

**Error: "Invalid credentials"**
- Verify email and password are correct
- Check password meets complexity requirements
- Delete and reseed user: `node cleanAndSeed.js`

**Error: "401 Unauthorized"**
- Token may have expired - login again
- Clear browser localStorage: `localStorage.clear()`
- Check token in browser DevTools > Application > Storage

### Frontend Connection Issues

**Error: "Network error: backend API is unreachable"**
- Backend server must be running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify network connectivity: `curl http://localhost:5000/api/health`
- Clear browser cache and reload

### NPM Installation Issues

**Error: "npm ERR! code ENOENT"**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

---

## 📝 Scripts

### Backend Scripts
```bash
npm start              # Start production server
npm run dev            # Start development with auto-reload
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
```

### Frontend Scripts
```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build locally
npm run lint           # Run ESLint
```

---

## 📚 Development Notes

### Code Structure
- **Components**: Functional components with hooks
- **State Management**: Context API for global state
- **Styling**: CSS modules + utility CSS
- **API Calls**: Centralized in `services/api.js`
- **Error Handling**: Global error boundary + try-catch
- **Validation**: Server-side request validation + client-side form validation

### Best Practices
- Always verify JWT token is valid before making protected API calls
- Use loading states during async operations
- Implement proper error boundaries for React components
- Follow mongoose schema validation rules
- Use environment variables for sensitive data

---

## 🔒 Security

- **Passwords** are hashed using bcryptjs (10 salt rounds)
- **JWT tokens** are signed with a secret key
- **API requests** are validated before processing
- **CORS** enabled for frontend communication
- **Helmet** middleware for HTTP header security
- **Rate limiting** to prevent abuse
- **Password requirements** enforce strong passwords

---

## 📞 Support & Contribution

- **Issues**: Report bugs in GitHub Issues
- **Questions**: Create Discussion thread
- **Contributing**: Fork and submit Pull Requests
- **Contact**: deepak@gmail.com

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics and BI dashboards
- [ ] Multi-tenant support
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Barcode generation
- [ ] API rate limiting per user
- [ ] Audit logging
- [ ] Backup and restore functionality

---

## 🏃 Quick Start Checklist

- [ ] Clone repository
- [ ] Install Node.js 16+
- [ ] Install MongoDB locally or use Atlas
- [ ] Configure `.env` files
- [ ] `npm install` in both directories
- [ ] `node seedUser.js` to create admin user
- [ ] Start backend: `npm run dev` (StockForge-backend)
- [ ] Start frontend: `npm run dev` (StockForge)
- [ ] Open http://localhost:5173 in browser
- [ ] Login with deepak@gmail.com / Deepak@021242

---

**Last Updated**: March 19, 2026  
**Maintained by**: Development Team  
**Version**: 1.0.0
#   s t o r e  
 #   s t o r e  
 #   s t o r e  
 