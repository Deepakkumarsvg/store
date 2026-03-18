# StockForge Backend API

Complete REST API for StockForge Manufacturing & Inventory Management System.

## Features

- **Master Data Management** - Products, Suppliers, Customers, Units
- **Purchase Management** - Purchase orders and raw material procurement
- **Inventory Management** - Raw materials and finished goods stock tracking
- **Production Management** - Manufacturing job tracking
- **Sales Management** - Sales orders and dispatch tracking
- **Reports & Analytics** - Financial reports and dashboard statistics

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
# Create .env file with:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockforge
NODE_ENV=development
```

3. Start MongoDB (if local):
```bash
mongod
```

4. Run development server:
```bash
npm run dev
```

Server runs at: `http://localhost:5000`

## 📡 API Endpoints

All endpoints return JSON with structure: `{ success: true/false, data: {...}, message: "..." }`

### Dashboard
- `GET /api/dashboard/stats` - Get aggregated statistics

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Suppliers, Customers, Units
- Same CRUD pattern as Products:
  - `/api/suppliers`, `/api/customers`, `/api/units`

### Purchases
- `GET /api/purchases` - List with populated supplier & products
- `POST /api/purchases` - Auto-generates PO number
- `PUT /api/purchases/:id` - Update purchase
- `DELETE /api/purchases/:id` - Delete purchase

### Production, Sales, Raw Materials, Finished Goods
- Standard CRUD operations on respective endpoints

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockforge
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get single supplier
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Units
- `GET /api/units` - Get all units
- `GET /api/units/:id` - Get single unit
- `POST /api/units` - Create unit
- `PUT /api/units/:id` - Update unit
- `DELETE /api/units/:id` - Delete unit

### Purchases
- `GET /api/purchases` - Get all purchase orders
- `GET /api/purchases/:id` - Get single purchase order
- `POST /api/purchases` - Create purchase order (auto-generates PO number)
- `PUT /api/purchases/:id` - Update purchase order
- `DELETE /api/purchases/:id` - Delete purchase order

### Raw Materials
- `GET /api/raw-materials` - Get all raw material stock
- `GET /api/raw-materials/:id` - Get single raw material stock
- `POST /api/raw-materials` - Add/Update raw material stock
- `PUT /api/raw-materials/:id` - Update raw material stock
- `DELETE /api/raw-materials/:id` - Delete raw material stock

### Production
- `GET /api/production` - Get all production jobs
- `GET /api/production/:id` - Get single production job
- `POST /api/production` - Create production job (auto-generates Job number)
- `PUT /api/production/:id` - Update production job
- `DELETE /api/production/:id` - Delete production job

### Finished Goods
- `GET /api/finished-goods` - Get all finished goods stock
- `GET /api/finished-goods/:id` - Get single finished good stock
- `POST /api/finished-goods` - Add/Update finished good stock
- `PUT /api/finished-goods/:id` - Update finished good stock
- `DELETE /api/finished-goods/:id` - Delete finished good stock

### Sales
- `GET /api/sales` - Get all sales orders
- `GET /api/sales/:id` - Get single sale order
- `POST /api/sales` - Create sale order (auto-generates Invoice number)
- `PUT /api/sales/:id` - Update sale order
- `DELETE /api/sales/:id` - Delete sale order

### Reports
- `GET /api/reports` - Get financial reports (revenue, expenses, profit, monthly data)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Health Check
- `GET /api/health` - API health check

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {}
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Auto-Generated Numbers

The API automatically generates:
- **Purchase Orders** - Format: `PO-YYYY-0001`
- **Production Jobs** - Format: `JOB-YYYY-0001`
- **Sales Invoices** - Format: `INV-YYYY-0001`

## Database Schema

### Product
- name, type (Raw Material/Finished Good), unit, price, sku, category

### Supplier/Customer
- name, contact, email, address, gst, status

### Purchase/Sale
- PO/Invoice number, supplier/customer, items[], totalAmount, date, status, notes

### Stock (Raw Material/Finished Good)
- product/material reference, quantity, minLevel, maxLevel, location

### Production
- jobNumber, product, quantity, rawMaterialsUsed[], startDate, endDate, status

## Server Port

Default: `http://localhost:5000`

## CORS

CORS is enabled for all origins in development mode.
