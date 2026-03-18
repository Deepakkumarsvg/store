import { useState, useEffect } from 'react';
import "../css/erp.css";
import "../css/forms.css";
import { FileDownload, Visibility, Inventory2 } from '@mui/icons-material';
import DetailDrawer from '../components/DetailDrawer';
import { finishedGoodsAPI } from '../services/api';
import { exportToExcel } from '../utils/exportExcel';

const FinishedGoods = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewStock, setViewStock] = useState(null);

  useEffect(() => {
    fetchFinishedGoods();
  }, []);

  const fetchFinishedGoods = async () => {
    try {
      setLoading(true);
      const response = await finishedGoodsAPI.getAll();
      if (response.success) {
        setStocks(response.data);
      }
    } catch (error) {
      console.error('Error fetching finished goods:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (quantity, minLevel = 0, maxLevel = 100) => {
    if (quantity <= minLevel) return { label: 'Low Stock', cls: 'danger' };
    if ((quantity / maxLevel) * 100 < 50) return { label: 'Medium', cls: 'warning' };
    return { label: 'Good', cls: 'success' };
  };

  const getPercentage = (quantity, maxLevel = 100) => {
    return Math.min((quantity / maxLevel) * 100, 100);
  };

  const handleExport = () => {
    const rows = stocks.map((stock) => ({
      Product: stock.product?.name || '',
      Quantity: stock.quantity || 0,
      Unit: stock.product?.unit || 'Pcs',
      MinLevel: stock.minLevel || 0,
      MaxLevel: stock.maxLevel || 0,
      Location: stock.location || '',
    }));

    exportToExcel({ rows, fileName: 'finished-goods-stock', sheetName: 'FinishedGoods' });
  };

  return (
    <div className="erp-page">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Finished Goods</h1>
          <p className="erp-page-subtitle">Inventory levels, stock status & valuation</p>
        </div>
        <button className="erp-btn erp-btn-secondary" onClick={handleExport} disabled={stocks.length === 0}>
          <FileDownload /> Export Excel
        </button>
      </div>

      <div className="erp-card erp-table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            Loading finished goods...
          </div>
        ) : stocks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            No finished goods found.
          </div>
        ) : (
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Min Level</th>
                  <th>Max Level</th>
                  <th>Stock Level</th>
                  <th>Status</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => {
                  const status = getStatus(stock.quantity, stock.minLevel || 0, stock.maxLevel || 100);
                  const percentage = getPercentage(stock.quantity, stock.maxLevel || 100);
                  return (
                    <tr key={stock._id}>
                      <td data-label="Product" className="td-bold">{stock.product?.name || 'N/A'}</td>
                      <td data-label="Quantity">{stock.quantity}</td>
                      <td data-label="Unit">{stock.product?.unit || 'Pcs'}</td>
                      <td data-label="Min Level">{stock.minLevel || 0}</td>
                      <td data-label="Max Level">{stock.maxLevel || 100}</td>
                      <td data-label="Stock Level">
                        <div className="erp-progress-wrap">
                          <div className="erp-progress-bar">
                            <div className={`erp-progress-fill ${status.cls}`} style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="erp-progress-pct">{Math.round(percentage)}%</span>
                        </div>
                      </td>
                      <td data-label="Status">
                        <span className={`erp-badge ${status.cls}`}>{status.label}</span>
                      </td>
                      <td data-label="Actions" className="td-actions">
                        <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-view" type="button" title="View stock details" onClick={() => setViewStock(stock)}>
                          <Visibility />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DetailDrawer
        open={Boolean(viewStock)}
        onClose={() => setViewStock(null)}
        title={viewStock?.product?.name || 'Finished Good'}
        subtitle="Finished goods stock details"
        theme="finished"
        icon={<Inventory2 />}
        badge={
          viewStock ? (
            <span className={`erp-badge ${getStatus(viewStock.quantity, viewStock.minLevel || 0, viewStock.maxLevel || 100).cls}`}>
              {getStatus(viewStock.quantity, viewStock.minLevel || 0, viewStock.maxLevel || 100).label}
            </span>
          ) : null
        }
        sections={[
          {
            title: 'Stock Overview',
            items: [
              { label: 'Product', value: viewStock?.product?.name || '—' },
              { label: 'SKU', value: viewStock?.product?.sku || '—', mono: true },
              { label: 'Quantity', value: viewStock?.quantity ?? '—' },
              { label: 'Unit', value: viewStock?.product?.unit || 'Pcs' },
              { label: 'Location', value: viewStock?.location || 'Main Warehouse' },
            ],
          },
          {
            title: 'Thresholds',
            items: [
              { label: 'Minimum Level', value: viewStock?.minLevel ?? 0 },
              { label: 'Maximum Level', value: viewStock?.maxLevel ?? 0 },
              {
                label: 'Fill %',
                value: viewStock ? `${Math.round(getPercentage(viewStock.quantity, viewStock.maxLevel || 100))}%` : '—',
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default FinishedGoods;