import { useState, useEffect } from 'react';
import '../css/erp.css';
import '../css/erp-mobile.css';
import {
  ShoppingCart,
  Inventory,
  Factory,
  Warehouse,
  PointOfSale,
  TrendingUp,
  FileDownload,
} from '@mui/icons-material';
import { dashboardAPI } from '../services/api';
import { exportToExcel } from '../utils/exportExcel';

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      title: 'Raw Materials',
      value: '0',
      icon: <Inventory sx={{ fontSize: 40 }} />,
      colorClass: 'blue',
    },
    {
      title: 'In Production',
      value: '0',
      icon: <Factory sx={{ fontSize: 40 }} />,
      colorClass: 'warning',
    },
    {
      title: 'Finished Goods',
      value: '0',
      icon: <Warehouse sx={{ fontSize: 40 }} />,
      colorClass: 'success',
    },
    {
      title: 'Total Sales',
      value: '₹0',
      icon: <PointOfSale sx={{ fontSize: 40 }} />,
      colorClass: 'purple',
    },
    {
      title: 'Purchases',
      value: '0',
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      colorClass: 'pink',
    },
    {
      title: 'Profit',
      value: '₹0',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      colorClass: 'success',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      
      if (response.success) {
        const data = response.data;
        setStats([
          {
            title: 'Raw Materials',
            value: data.rawMaterials || '0',
            icon: <Inventory sx={{ fontSize: 40 }} />,
            colorClass: 'blue',
          },
          {
            title: 'In Production',
            value: data.inProduction || '0',
            icon: <Factory sx={{ fontSize: 40 }} />,
            colorClass: 'warning',
          },
          {
            title: 'Finished Goods',
            value: data.finishedGoods || '0',
            icon: <Warehouse sx={{ fontSize: 40 }} />,
            colorClass: 'success',
          },
          {
            title: 'Total Sales',
            value: data.totalSales || '₹0',
            icon: <PointOfSale sx={{ fontSize: 40 }} />,
            colorClass: 'purple',
          },
          {
            title: 'Purchases',
            value: data.purchases || '0',
            icon: <ShoppingCart sx={{ fontSize: 40 }} />,
            colorClass: 'pink',
          },
          {
            title: 'Profit',
            value: data.profit || '₹0',
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            colorClass: 'success',
          },
        ]);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const row = stats.reduce((accumulator, stat) => {
      accumulator[stat.title] = stat.value;
      return accumulator;
    }, {});

    exportToExcel({ rows: [row], fileName: 'dashboard-summary', sheetName: 'Dashboard' });
  };

  return (
    <div className="erp-page">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Dashboard</h1>
          <p className="erp-page-subtitle">Overview of your manufacturing operations</p>
        </div>
        <button className="erp-btn erp-btn-secondary" onClick={handleExport} disabled={loading}>
          <FileDownload /> Export Excel
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '12px 16px', 
          background: '#fee', 
          color: '#c00', 
          borderRadius: '8px', 
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '48px', 
          color: '#94a3b8',
          fontSize: '14px'
        }}>
          Loading dashboard data...
        </div>
      ) : (
        <div className="erp-stat-grid">
          {stats.map((stat) => (
            <div key={stat.title} className={`erp-stat-card ${stat.colorClass}`}>
              <div className="erp-stat-label">{stat.title}</div>
              <div className="erp-stat-value mono">{stat.value}</div>
              <div className={`erp-stat-icon ${stat.colorClass}`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
