# StockForge - Manufacturing ERP Frontend

Modern, responsive frontend for StockForge Manufacturing & Inventory Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Backend API running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

Application runs at: `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   └── Layout/
│       ├── MainLayout.jsx    # Root layout with sidebar
│       └── Sidebar.jsx        # Navigation sidebar
├── pages/
│   ├── Dashboard.jsx          # Stats overview
│   ├── Master/
│   │   ├── Products.jsx       # Product management
│   │   ├── Suppliers.jsx      # Supplier management
│   │   ├── Customers.jsx      # Customer management
│   │   └── Units.jsx          # Unit definitions
│   ├── Purchase.jsx           # Purchase orders
│   ├── RawMaterialStock.jsx   # Raw material inventory
│   ├── Production.jsx         # Manufacturing jobs
│   ├── FinishedGoods.jsx      # Finished goods inventory
│   ├── Sales.jsx              # Sales orders
│   └── Reports.jsx            # Analytics & reports
├── services/
│   └── api.js                 # Axios API service
└── App.jsx                    # Router configuration
```

## 🎨 Features

- **Dashboard** - Real-time statistics and metrics
- **Master Data Management** - Products, suppliers, customers, units
- **Purchase Management** - Create and track purchase orders
- **Inventory Tracking** - Raw materials and finished goods
- **Production Management** - Manufacturing job tracking
- **Sales & Dispatch** - Order fulfillment
- **Reports** - Profit analysis and reports

## 🔧 Technology Stack

- **React 19** - UI framework
- **React Router** - Navigation
- **Material-UI** - Icons and components
- **Axios** - HTTP client
- **Vite** - Build tool

## 📱 Mobile Support

Fully responsive with mobile-optimized sidebar drawer, responsive tables, and touch-friendly interface.
