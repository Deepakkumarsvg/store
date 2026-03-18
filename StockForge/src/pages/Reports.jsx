import { useState, useEffect } from 'react';
import '../css/erp.css';
import '../css/erp-mobile.css';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShoppingCart,
  Factory,
  FileDownload,
} from '@mui/icons-material';
import { reportsAPI } from '../services/api';
import { exportToExcel } from '../utils/exportExcel';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [financialSummary, setFinancialSummary] = useState([
    { label: 'Total Revenue', value: '₹0', icon: <TrendingUp />, color: '#10b981' },
    { label: 'Total Expenses', value: '₹0', icon: <TrendingDown />, color: '#ef4444' },
    { label: 'Net Profit', value: '₹0', icon: <AccountBalance />, color: '#3b82f6' },
    { label: 'Purchase Cost', value: '₹0', icon: <ShoppingCart />, color: '#f59e0b' },
  ]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getAll();
      if (response.success && response.data) {
        const { summary = {}, monthlyData: reportMonthlyData = [] } = response.data;

        setFinancialSummary([
          {
            label: 'Total Revenue',
            value: formatCurrency(summary.totalRevenue),
            icon: <TrendingUp />,
            color: '#10b981',
          },
          {
            label: 'Total Expenses',
            value: formatCurrency(summary.totalExpenses),
            icon: <TrendingDown />,
            color: '#ef4444',
          },
          {
            label: 'Net Profit',
            value: formatCurrency(summary.netProfit),
            icon: <AccountBalance />,
            color: '#3b82f6',
          },
          {
            label: 'In Production',
            value: String(summary.productionCount || 0),
            icon: <Factory />,
            color: '#f59e0b',
          },
        ]);

        setMonthlyData(
          reportMonthlyData.map((item) => ({
            ...item,
            revenue: Number(item.revenue || 0),
            expenses: Number(item.expenses || 0),
            profit: Number(item.profit || 0),
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const rows = monthlyData.map((item) => ({
      Month: item.month,
      Revenue: item.revenue || 0,
      Expenses: item.expenses || 0,
      Profit: item.profit || 0,
    }));

    exportToExcel({ rows, fileName: 'financial-report', sheetName: 'MonthlyPerformance' });
  };

  return (
    <div className="erp-page">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Profit & Reports</h1>
          <p className="erp-page-subtitle">Financial analytics and performance metrics</p>
        </div>
        <button className="erp-btn erp-btn-secondary" onClick={handleExport} disabled={monthlyData.length === 0}>
          <FileDownload /> Export Excel
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
          Loading reports...
        </div>
      ) : (
        <>
          <div className="erp-stat-grid">
            {financialSummary.map((item) => {
              const className = item.color === '#10b981' ? 'success' : item.color === '#ef4444' ? 'danger' : item.color === '#3b82f6' ? 'blue' : 'warning';
              return (
                <div key={item.label} className={`erp-stat-card ${className}`}>
                  <div className="erp-stat-label">{item.label}</div>
                  <div className="erp-stat-value mono">{item.value}</div>
                  <div className={`erp-stat-icon ${className}`}>
                    {item.icon}
                  </div>
                </div>
              );
            })}
          </div>

          {monthlyData.length > 0 && (
            <div className="erp-card" style={{ marginBottom: '24px' }}>
              <div className="erp-card-header">
                <h3 className="erp-card-title">Monthly Performance</h3>
              </div>
              <div className="erp-table-wrap erp-table-responsive">
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Revenue (₹)</th>
                      <th>Expenses (₹)</th>
                      <th>Profit (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((data) => (
                      <tr key={data.month}>
                        <td data-label="Month" className="td-bold">{data.month}</td>
                        <td data-label="Revenue" className="erp-value">₹{data.revenue?.toLocaleString()}</td>
                        <td data-label="Expenses" className="erp-value">₹{data.expenses?.toLocaleString()}</td>
                        <td data-label="Profit" className="erp-value" style={{ color: '#10b981' }}>
                          ₹{data.profit?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {monthlyData.length === 0 && (
            <div className="erp-card" style={{ marginBottom: '24px' }}>
              <div className="erp-card-body" style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                No monthly data available yet. Reports will appear as you add more transactions.
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            <div className="erp-card">
              <div className="erp-card-header">
                <h3 className="erp-card-title">Top Selling Products</h3>
              </div>
              <div className="erp-card-body">
                <p style={{ color: '#94a3b8' }}>Chart will be displayed here...</p>
              </div>
            </div>
            <div className="erp-card">
              <div className="erp-card-header">
                <h3 className="erp-card-title">Revenue Trends</h3>
              </div>
              <div className="erp-card-body">
                <p style={{ color: '#94a3b8' }}>Chart will be displayed here...</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
