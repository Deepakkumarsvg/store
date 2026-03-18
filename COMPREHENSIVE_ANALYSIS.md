# StockForge - Comprehensive Application Analysis

## 📋 Executive Summary

**StockForge** is a modern, full-stack Manufacturing & Inventory Management ERP (Enterprise Resource Planning) system designed to streamline production workflows, inventory tracking, and sales management for manufacturing businesses. It provides a complete solution for managing products, supplies, production processes, inventory levels, and customer interactions in a user-friendly, web-based interface.

---

## 1. 🎯 Project Purpose

StockForge is a manufacturing ERP application that helps businesses:

- **Manage Production**: Track manufacturing jobs, production schedules, and resource allocation
- **Inventory Control**: Monitor raw material stock, finished goods inventory with min/max level alerts
- **Purchase Management**: Create and track purchase orders from suppliers
- **Sales Operations**: Process customer orders, track shipments, and manage invoice generation
- **Master Data Management**: Maintain centralized databases for products, suppliers, customers, and units
- **Business Intelligence**: Generate analytics, reports, and profitability insights
- **Customer Engagement**: Capture customer enquiries from landing pages with status tracking

**Target Users**: Manufacturing business owners, inventory managers, production coordinators, and sales teams.

---

## 2. 🏗️ Application Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (React + Vite)                    │
│  StockForge (Port 5173)                                     │
├─────────────────────────────────────────────────────────────┤
│                Axios API Client with JWT Auth               │
├─────────────────────────────────────────────────────────────┤
│              BACKEND (Node.js + Express)                    │
│         StockForge-backend (Port 5000)                      │
├─────────────────────────────────────────────────────────────┤
│                  MongoDB Database                           │
│     (Local or MongoDB Cloud Atlas)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 🎨 Frontend Structure

### Technology Stack
- **React 19** - UI component library
- **Vite 7.3.1** - Lightning-fast build tool
- **React Router DOM 7.13** - Client-side routing
- **Material-UI (MUI) 7.3.9** - Professional UI component library
- **Axios 1.13.6** - HTTP client with interceptors
- **XLSX 0.18.5** - Excel export functionality
- **Emotion** - CSS-in-JS styling

### Frontend Project Structure

```
StockForge/
├── public/
│   └── banners/              # Static banner images
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── MainLayout.jsx      # Root app layout with sidebar
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   └── Sidebar.jsx        # Navigation sidebar (responsive)
│   │   ├── ErrorBoundary.jsx       # Error handling component
│   │   ├── ProtectedRoute.jsx      # Route protection wrapper
│   │   ├── ConfirmDialog.jsx       # Confirmation dialogs
│   │   ├── DetailDrawer.jsx        # Slide-out details panel
│   │   ├── ProductBannerSlider.jsx # Banner carousel
│   │   └── AnimatedBanner.jsx      # Animated banner component
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx         # Public homepage
│   │   ├── Login.jsx               # Authentication page
│   │   ├── Dashboard.jsx           # Main dashboard with KPIs
│   │   ├── Master/
│   │   │   ├── Products.jsx        # Product CRUD management
│   │   │   ├── Suppliers.jsx       # Supplier CRUD management
│   │   │   ├── Customers.jsx       # Customer CRUD management
│   │   │   └── Units.jsx          # Unit definitions (kg, ltr, etc)
│   │   ├── Purchase.jsx            # Purchase orders management
│   │   ├── RawMaterialStock.jsx    # Inventory tracking (raw materials)
│   │   ├── Production.jsx          # Production job management
│   │   ├── FinishedGoods.jsx       # Finished goods inventory
│   │   ├── Sales.jsx               # Sales orders & invoicing
│   │   ├── Enquiries.jsx           # Customer enquiry dashboard
│   │   └── Reports.jsx             # Analytics & reporting
│   │
│   ├── context/
│   │   ├── AuthContext.jsx         # Global authentication state
│   │   ├── NotificationContext.jsx # Toast/notification system
│   │   └── useAuth.jsx             # Auth hook
│   │
│   ├── services/
│   │   └── api.js                  # Centralized Axios API client
│   │
│   ├── utils/
│   │   └── exportExcel.js          # Excel export utility
│   │
│   ├── css/
│   │   ├── erp.css                 # Main ERP styling
│   │   ├── forms.css               # Form styling
│   │   ├── navbar.css              # Navigation styling
│   │   ├── sidebar-mobile.css      # Mobile sidebar
│   │   ├── login.css               # Login page styling
│   │   ├── banner-slider.css       # Slider styling
│   │   ├── erp-mobile.css          # Mobile responsive styles
│   │   ├── mobile-card.css         # Mobile card styling
│   │   └── landing.css             # Landing page styling
│   │
│   ├── App.jsx                     # Main app component with routing
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles
│
├── package.json
├── vite.config.js
├── eslint.config.js
├── index.html
└── README.md
```

### Key Frontend Features

1. **Authentication**
   - JWT token-based login
   - Protected routes requiring authentication
   - Auto-logout on token expiration
   - User role management (admin, manager, user)

2. **State Management**
   - React Context API for global auth state
   - Notification toast context
   - Local component state with hooks

3. **Responsive Design**
   - Mobile-first CSS approach
   - Adaptive sidebar (drawer on mobile)
   - Material-UI responsive grid system
   - Touch-friendly interface

4. **API Integration**
   - Axios instance with JWT auto-injection
   - Request/response interceptors for error handling
   - Centralized API endpoints in services/api.js
   - Network error detection and user feedback

---

## 4. 🔧 Backend Structure

### Technology Stack
- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Web framework
- **MongoDB 9.3.0** - NoSQL database
- **Mongoose** - MongoDB ORM
- **JWT (jsonwebtoken 9.0.3)** - Token-based authentication
- **bcryptjs 3.0.3** - Password hashing
- **Helmet 8.1.0** - Security headers
- **CORS 2.8.6** - Cross-origin request handling
- **Rate Limiting** - Express-rate-limit for DDoS protection
- **Jest & Supertest** - Testing framework

### Backend Project Structure

```
StockForge-backend/
├── config/
│   └── db.js                   # MongoDB connection configuration
│
├── middleware/
│   ├── auth.js                 # JWT verification & role authorization
│   ├── response.js             # Standardized response formatter
│   └── validation.js           # Input validation middleware
│
├── models/
│   ├── User.js                 # User schema (auth, roles, status)
│   ├── Product.js              # Product schema (raw & finished goods)
│   ├── Supplier.js             # Supplier contact information
│   ├── Customer.js             # Customer contact information
│   ├── Unit.js                 # Measurement units
│   ├── Purchase.js             # Purchase orders from suppliers
│   ├── Sale.js                 # Sales orders to customers
│   ├── Production.js           # Manufacturing job tracking
│   ├── RawMaterialStock.js     # Raw materials inventory levels
│   ├── FinishedGood.js         # Finished goods inventory levels
│   ├── Enquiry.js              # Customer enquiries form submissions
│   ├── Counter.js              # Auto-incrementing counter for IDs
│   └── (Models use MongoDB timestamps: createdAt, updatedAt)
│
├── routes/
│   ├── auth.js                 # Authentication endpoints
│   ├── products.js             # Product CRUD operations
│   ├── suppliers.js            # Supplier CRUD operations
│   ├── customers.js            # Customer CRUD operations
│   ├── units.js                # Unit CRUD operations
│   ├── purchases.js            # Purchase order management
│   ├── sales.js                # Sales order management
│   ├── production.js           # Production job management
│   ├── rawMaterials.js         # Raw material stock management
│   ├── finishedGoods.js        # Finished goods management
│   ├── enquiries.js            # Enquiry management
│   ├── reports.js              # Analytics & reporting
│   └── dashboard.js            # Dashboard statistics
│
├── utils/
│   ├── pagination.js           # Pagination helper
│   ├── responses.js            # Response formatting utilities
│   └── sequence.js             # Auto-increment ID generator
│
├── tests/
│   ├── auth.validation.test.js # Authentication tests
│   ├── health.test.js          # Health check tests
│   └── (Jest test suite)
│
├── server.js                   # Main Express app & startup
├── checkUsers.js               # CLI utility - list users
├── cleanAndSeed.js             # CLI utility - reset & seed database
├── seedUser.js                 # CLI utility - create default users
├── testPassword.js             # CLI utility - test password hashing
├── package.json
├── jest.config.cjs
├── eslint.config.js
└── README.md
```

### Key Backend Features

1. **Security**
   - Password hashing with bcryptjs
   - JWT token-based authentication (15-min tokens by default)
   - Role-based access control (RBAC)
   - Helmet for secure headers
   - CORS configuration with origin whitelist
   - Rate limiting on API endpoints and auth

2. **Database**
   - MongoDB with Mongoose ODM
   - Structured schemas with validation
   - Relationships via ObjectId references
   - Auto-timestamps (createdAt, updatedAt)
   - Unique indexes for SKU, email, invoice/PO numbers

3. **API Standards**
   - RESTful endpoint design
   - Consistent response format with status, message, data
   - Error handling with appropriate HTTP status codes
   - Server-side pagination support

4. **Testing**
   - Jest testing framework configured
   - Supertest for HTTP testing
   - Health check endpoint for monitoring

---

## 5. 🔐 Authentication System

### Frontend Authentication Flow
```
1. User visits /login page
2. Form submission → api.post('/auth/login', {email, password})
3. Backend validates & returns JWT token
4. Token stored in localStorage
5. AuthContext updates global state
6. Redirect to /app/dashboard
7. Subsequent requests auto-include token via Axios interceptor
8. Protected routes verified by ProtectedRoute component
9. Expired token triggers auto-redirect to /login
```

### Backend Authentication Implementation
- **User Model**: Stores name, email, hashed password, role (admin/manager/user), status
- **Login Route**: `POST /api/auth/login` - validates credentials, returns JWT token
- **Auth Middleware**: `protect` middleware verifies JWT and attaches user to request
- **Role Authorization**: `authorize` middleware restricts access by user role
- **Password Requirements**: 
  - Minimum 12 characters
  - Must include uppercase, lowercase, number, and special character
  - Hashed with bcryptjs before storage

### Environment Variables Required
```
# Backend .env
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=15m
MONGODB_URI=mongodb://localhost:27017/stockforge
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
RATE_LIMIT_MAX=300
AUTH_RATE_LIMIT_MAX=5

# Frontend .env
VITE_API_URL=http://localhost:5000/api
```

---

## 6. 📡 API Endpoints

### Authentication Routes
```
POST   /api/auth/login           # Login with email & password
GET    /api/auth/me              # Get current user (protected)
POST   /api/auth/logout          # Logout (protected)
```

### Master Data Management
```
GET    /api/products             # List all products
POST   /api/products             # Create new product
PUT    /api/products/:id         # Update product
DELETE /api/products/:id         # Delete product

GET    /api/suppliers            # List all suppliers
POST   /api/suppliers            # Create supplier
PUT    /api/suppliers/:id        # Update supplier
DELETE /api/suppliers/:id        # Delete supplier

GET    /api/customers            # List all customers
POST   /api/customers            # Create customer
PUT    /api/customers/:id        # Update customer
DELETE /api/customers/:id        # Delete customer

GET    /api/units                # List measurement units
POST   /api/units                # Create unit
PUT    /api/units/:id            # Update unit
DELETE /api/units/:id            # Delete unit
```

### Inventory Management
```
GET    /api/purchases            # List purchase orders
POST   /api/purchases            # Create purchase order
PUT    /api/purchases/:id        # Update purchase order
DELETE /api/purchases/:id        # Cancel purchase order

GET    /api/raw-materials        # List raw material stock
POST   /api/raw-materials        # Create raw material entry
PUT    /api/raw-materials/:id    # Update stock levels
DELETE /api/raw-materials/:id    # Delete raw material

GET    /api/finished-goods       # List finished goods inventory
POST   /api/finished-goods       # Create finished good entry
PUT    /api/finished-goods/:id   # Update inventory
DELETE /api/finished-goods/:id   # Delete finished good
```

### Sales & Production
```
GET    /api/sales                # List sales orders
POST   /api/sales                # Create sales order
PUT    /api/sales/:id            # Update sales order
DELETE /api/sales/:id            # Cancel sales order

GET    /api/production           # List production jobs
POST   /api/production           # Create production job
PUT    /api/production/:id       # Update job status
DELETE /api/production/:id       # Cancel job
```

### Enquiries & Reports
```
GET    /api/enquiries            # List customer enquiries (admin)
POST   /api/enquiries            # Submit public enquiry (public)
PUT    /api/enquiries/:id/status # Update enquiry status

GET    /api/reports              # Generate business reports
GET    /api/dashboard/stats      # Dashboard KPIs
GET    /api/health               # Health check endpoint
```

---

## 7. 💾 Database Models

### Core Data Entities

#### **User**
```javascript
{
  _id: ObjectId (auto),
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  role: Enum ['admin', 'user', 'manager'] (default: 'user'),
  status: Enum ['Active', 'Inactive'] (default: 'Active'),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Product**
```javascript
{
  _id: ObjectId (auto),
  name: String (required),
  type: Enum ['Raw Material', 'Finished Good'] (required),
  unit: String (required),
  price: Number (required, min: 0),
  sku: String (unique),
  category: String (default: 'General'),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Supplier & Customer**
```javascript
{
  _id: ObjectId (auto),
  name: String (required),
  contact: String (required),
  email: String (required, lowercase),
  address: String,
  gst: String (tax ID),
  status: Enum ['Active', 'Inactive'] (default: 'Active'),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Purchase Order**
```javascript
{
  _id: ObjectId (auto),
  poNumber: String (unique, required),
  supplier: ObjectId (ref: Supplier, required),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    rate: Number,
    amount: Number
  }],
  totalAmount: Number (required),
  date: Date,
  status: Enum ['Pending', 'Received', 'Cancelled'],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Sales Order**
```javascript
{
  _id: ObjectId (auto),
  invoiceNumber: String (unique, required),
  customer: ObjectId (ref: Customer, required),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    amount: Number
  }],
  totalAmount: Number (required),
  date: Date,
  status: Enum ['Pending', 'Dispatched', 'Delivered', 'Cancelled'],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Production**
```javascript
{
  _id: ObjectId (auto),
  jobNumber: String (unique, required),
  product: ObjectId (ref: Product, required),
  quantity: Number (required, min: 0),
  rawMaterialsUsed: [{
    material: ObjectId (ref: Product),
    quantity: Number
  }],
  startDate: Date (required),
  endDate: Date,
  status: Enum ['In Progress', 'Completed', 'Cancelled'],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Inventory (Raw Materials & Finished Goods)**
```javascript
{
  _id: ObjectId (auto),
  material/product: ObjectId (ref: Product, required),
  quantity: Number (min: 0, default: 0),
  minLevel: Number (reorder threshold),
  maxLevel: Number (storage capacity),
  location: String (default: 'Main Warehouse'),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Enquiry**
```javascript
{
  _id: ObjectId (auto),
  name: String (required, 2-120 chars),
  phone: String (required, 6-25 chars),
  email: String (required, lowercase),
  message: String (required, 10-2000 chars),
  source: String (default: 'landing-page'),
  status: Enum ['New', 'Contacted', 'Qualified', 'Closed'],
  createdAt: Date,
  updatedAt: Date
}
```

#### **Unit**
```javascript
{
  _id: ObjectId (auto),
  name: String (e.g., 'kg', 'liter', 'piece'),
  abbreviation: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 8. 📦 Key Dependencies

### Frontend Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.0 | UI library |
| react-router-dom | 7.13.1 | Routing |
| axios | 1.13.6 | HTTP client |
| @mui/material | 7.3.9 | UI components |
| @mui/icons-material | 7.3.9 | Icons |
| @emotion/react | 11.14.0 | CSS-in-JS |
| xlsx | 0.18.5 | Excel export |
| vite | 7.3.1 | Build tool |

### Backend Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| express | 5.2.1 | Web framework |
| mongoose | 9.3.0 | MongoDB ODM |
| jsonwebtoken | 9.0.3 | JWT auth |
| bcryptjs | 3.0.3 | Password hash |
| dotenv | 17.3.1 | Config management |
| cors | 2.8.6 | Cross-origin |
| helmet | 8.1.0 | Security headers |
| express-rate-limit | 8.3.1 | Rate limiting |
| jest | 30.1.3 | Testing |
| nodemon | 3.1.14 | Development reload |

---

## 9. 🌟 Key Features

### 1. **Dashboard & Analytics**
   - Real-time KPI statistics
   - Sales & production metrics
   - Inventory level insights
   - Profit analysis

### 2. **Master Data Management**
   - Product catalog (raw materials & finished goods)
   - Supplier database with contact details
   - Customer relationship management
   - Measurement unit definitions

### 3. **Purchase Management**
   - Create purchase orders with unique PO numbers
   - Track supplier shipments
   - Monitor purchase status (Pending, Received, Cancelled)
   - Automatic total amount calculation

### 4. **Inventory Control**
   - Raw material stock level tracking
   - Finished goods inventory management
   - Min/Max level alerts
   - Warehouse location tracking
   - Stock adjustment history

### 5. **Production Management**
   - Manufacturing job creation with unique job numbers
   - Track raw materials consumed in production
   - Production timeline (start/end dates)
   - Job status tracking (In Progress, Completed, Cancelled)

### 6. **Sales Operations**
   - Create sales orders with unique invoice numbers
   - Customer order fulfillment tracking
   - Order status workflow (Pending → Dispatched → Delivered)
   - Automatic invoice total calculation

### 7. **Customer Engagement**
   - Public enquiry form on landing page
   - Enquiry management dashboard
   - Status tracking (New, Contacted, Qualified, Closed)

### 8. **Reporting & Export**
   - Excel export functionality
   - Business performance reports
   - Profit & loss analysis
   - Inventory reports

### 9. **Security**
   - Role-based access control (RBAC)
   - JWT token authentication
   - Password strength enforcement
   - User status management (Active/Inactive)
   - Rate limiting on APIs
   - CORS protection

### 10. **Responsive Design**
   - Desktop-optimized interface
   - Tablet-friendly layouts
   - Mobile sidebar drawer navigation
   - Touch-friendly components

---

## 10. 🚀 Installation & Setup

### Prerequisites
```
Node.js: v16 or higher
npm: v7 or higher
MongoDB: v4.0 or higher (local or cloud)
Git: optional
```

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd StockForge-backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockforge
NODE_ENV=development
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=15m
ALLOWED_ORIGINS=http://localhost:5173
RATE_LIMIT_MAX=300
AUTH_RATE_LIMIT_MAX=5
EOF

# Start development server with auto-reload
npm run dev

# Or production server
npm start
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
```

### Step 2: MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod

# Connection string: mongodb://localhost:27017/stockforge
```

**Option B: MongoDB Cloud (Atlas)**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster in free tier
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/stockforge`
4. Update `MONGODB_URI` in backend `.env`

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd StockForge

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev

# Build for production
npm run build
```

**Expected Output:**
```
  VITE v7.3.1  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### Step 4: Access Application

Open browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### Step 5: Seed Database (Optional)

```bash
cd StockForge-backend

# Create test user account
node seedUser.js

# Clean and seed complete test database
node cleanAndSeed.js

# Check existing users
node checkUsers.js
```

---

## 11. 🧪 Testing

### Run Backend Tests
```bash
npm test                 # Run all tests once
npm run test:watch      # Run in watch mode
npm run test:coverage   # Generate coverage report
```

### Test Files
- `tests/auth.validation.test.js` - Authentication tests
- `tests/health.test.js` - Health endpoint tests

---

## 12. 📝 Development Workflow

### Common Commands

**Backend:**
```bash
npm run dev          # Start with auto-reload (nodemon)
npm start            # Production start
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
npm test             # Run Jest tests
```

**Frontend:**
```bash
npm run dev          # Development server with HMR
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Development Environment

1. Keep backend running: `npm run dev` (Terminal 1)
2. Keep frontend running: `npm run dev` (Terminal 2)
3. MongoDB must be running in background
4. Make changes and HMR/nodemon auto-reload

---

## 13. 🔍 Project Statistics

### Code Organization
- **Frontend Components**: 12+ functional React components
- **Backend Routes**: 13 route files covering all business areas
- **Database Models**: 11 Mongoose schemas
- **CSS Files**: 9 specialized stylesheets
- **API Endpoints**: 60+ RESTful endpoints

### Technology Coverage
- **Frontend**: React, Vite, MUI, Axios, Context API
- **Backend**: Express, MongoDB, JWT, bcrypt, Helmet
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT, RBAC, Rate Limiting, CORS, Helmet
- **Testing**: Jest, Supertest
- **Build**: Vite + Webpack via npm scripts

---

## 14. 🎯 Feature Roadmap Ideas

1. **Payment Gateway Integration**: Stripe/Razorpay for invoice payments
2. **Email Notifications**: Order confirmations, stock alerts
3. **Multi-warehouse Support**: Manage inventory across locations
4. **Mobile App**: React Native or Flutter version
5. **Advanced Reporting**: Pivot tables, custom dashboards
6. **API Documentation**: Swagger/OpenAPI integration
7. **Audit Logging**: Track all data modifications
8. **Bulk Operations**: Import/export via CSV
9. **Real-time Notifications**: WebSocket integration
10. **Role-based Views**: Customize UI per user role

---

## 15. 🐛 Troubleshooting

### Backend Issues
```
Error: Cannot find module 'mongoose'
→ Solution: npm install

Error: ERR_NETWORK backend API unreachable
→ Solution: Verify backend running on http://localhost:5000
                Check VITE_API_URL in frontend .env

Error: MongoDB connection failed
→ Solution: Check mongod process is running
           Verify MONGODB_URI in .env
           Use correct connection string format
```

### Frontend Issues
```
Error: Cannot GET /api/health
→ Solution: Backend not running, start with: npm run dev

Error: 401 Unauthorized
→ Solution: Token expired or invalid
           Login again and get new token

Error: Network timeout
→ Solution: Increase axios timeout in services/api.js
           Check backend server responsiveness
```

---

## 16. 📞 Support & Documentation

- **Backend Logs**: Check terminal output for detailed API logs
- **Frontend Console**: Browser DevTools → Console tab for client errors
- **API Health**: Visit http://localhost:5000/api/health
- **MongoDB Compass**: GUI tool for database inspection
- **Postman**: Test API endpoints directly

---

## Summary Checklist

✅ **Frontend**: React 19, Vite, MUI, responsive design
✅ **Backend**: Node.js, Express, MongoDB, JWT auth
✅ **Database**: 11 Mongoose models with relationships
✅ **Security**: RBAC, password hashing, rate limiting
✅ **Features**: Complete ERP for manufacturing
✅ **Testing**: Jest framework configured
✅ **Documentation**: README files and setup guide
✅ **Scalability**: Supports MongoDB Atlas cloud

---

**Last Updated**: March 2026
**Version**: 1.0.0
**Status**: Production-Ready
