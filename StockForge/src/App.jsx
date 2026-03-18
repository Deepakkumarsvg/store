import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Master/Products';
import Suppliers from './pages/Master/Suppliers';
import Customers from './pages/Master/Customers';
import Units from './pages/Master/Units';
import Purchase from './pages/Purchase';
import RawMaterialStock from './pages/RawMaterialStock';
import Production from './pages/Production';
import FinishedGoods from './pages/FinishedGoods';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import LandingPage from './pages/LandingPage';
import Enquiries from './pages/Enquiries';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <CssBaseline />
        <NotificationProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="master/products" element={<Products />} />
                <Route path="master/suppliers" element={<Suppliers />} />
                <Route path="master/customers" element={<Customers />} />
                <Route path="master/units" element={<Units />} />
                <Route path="purchase" element={<Purchase />} />
                <Route path="raw-material-stock" element={<RawMaterialStock />} />
                <Route path="production" element={<Production />} />
                <Route path="finished-goods" element={<FinishedGoods />} />
                <Route path="sales" element={<Sales />} />
                <Route path="reports" element={<Reports />} />
                <Route path="enquiries" element={<Enquiries />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </NotificationProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
