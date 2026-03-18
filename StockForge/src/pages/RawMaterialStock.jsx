import { useState, useEffect } from 'react';
import '../css/erp.css';
import '../css/forms.css';
import '../css/erp-mobile.css';
import { Add, FileDownload } from '@mui/icons-material';
import { useNotification } from '../context/NotificationContext';
import { productsAPI, rawMaterialsAPI } from '../services/api';
import { exportToExcel } from '../utils/exportExcel';

const RawMaterialStock = () => {
  const [stocks, setStocks] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const notification = useNotification();
  const [formData, setFormData] = useState({
    material: '',
    quantity: '',
    minLevel: '',
    maxLevel: '',
    location: 'Main Warehouse',
  });

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const [stockResponse, productResponse] = await Promise.all([
        rawMaterialsAPI.getAll(),
        productsAPI.getAll(),
      ]);

      if (stockResponse.success) {
        setStocks(stockResponse.data);
      }

      if (productResponse.success) {
        setMaterials(productResponse.data.filter((product) => product.type === 'Raw Material'));
      }
    } catch (error) {
      console.error('Error fetching raw materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setFormData({
      material: '',
      quantity: '',
      minLevel: '',
      maxLevel: '',
      location: 'Main Warehouse',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      material: formData.material,
      quantity: Number.parseFloat(formData.quantity),
      minLevel: formData.minLevel === '' ? 0 : Number.parseFloat(formData.minLevel),
      maxLevel: formData.maxLevel === '' ? 0 : Number.parseFloat(formData.maxLevel),
      location: formData.location.trim() || 'Main Warehouse',
    };

    if (!payload.material || Number.isNaN(payload.quantity)) {
      notification.warning('Please select a material and enter a valid quantity.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await rawMaterialsAPI.create(payload);
      if (response.success) {
        await fetchPageData();
        notification.success('Raw material stock updated successfully.');
        handleClose();
      }
    } catch (error) {
      console.error('Error adding raw material stock:', error);
      notification.error(error.response?.data?.message || 'Failed to add raw material stock');
    } finally {
      setSubmitting(false);
    }
  };

  const getStockStatus = (quantity, minLevel, maxLevel) => {
    const safeMaxLevel = maxLevel > 0 ? maxLevel : 100;
    const percentage = (quantity / safeMaxLevel) * 100;
    if (quantity <= minLevel) return { label: 'Low Stock', color: 'error' };
    if (percentage < 50) return { label: 'Medium', color: 'warning' };
    return { label: 'Good', color: 'success' };
  };

  const getStockPercentage = (quantity, maxLevel) => {
    const safeMaxLevel = maxLevel > 0 ? maxLevel : 100;
    return Math.min((quantity / safeMaxLevel) * 100, 100);
  };

  const handleExport = () => {
    const rows = stocks.map((stock) => ({
      Material: stock.material?.name || '',
      Quantity: stock.quantity || 0,
      Unit: stock.material?.unit || '',
      MinLevel: stock.minLevel || 0,
      MaxLevel: stock.maxLevel || 0,
      Location: stock.location || '',
    }));

    exportToExcel({ rows, fileName: 'raw-material-stock', sheetName: 'RawMaterialStock' });
  };

  return (
    <div className="erp-page">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Raw Material Stock</h1>
          <p className="erp-page-subtitle">Monitor inventory levels and stock alerts</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-secondary" onClick={handleExport} disabled={stocks.length === 0}>
            <FileDownload /> Export Excel
          </button>
          <button className="erp-btn erp-btn-primary" onClick={handleOpen}>
            <Add /> Add Stock
          </button>
        </div>
      </div>

      <div className="erp-card erp-table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            Loading raw material stock...
          </div>
        ) : stocks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            No raw material stock found.
          </div>
        ) : (
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Current Stock</th>
                  <th>Unit</th>
                  <th>Min Level</th>
                  <th>Max Level</th>
                  <th>Stock Level</th>
                  <th>Status</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => {
                  const status = getStockStatus(stock.quantity, stock.minLevel || 0, stock.maxLevel || 100);
                  const percentage = getStockPercentage(stock.quantity, stock.maxLevel || 100);
                  const colorClass = status.color === 'error' ? 'danger' : status.color === 'warning' ? 'warning' : 'success';
                  return (
                    <tr key={stock._id}>
                      <td data-label="Material" className="td-bold">{stock.material?.name || 'N/A'}</td>
                      <td data-label="Current Stock">{stock.quantity}</td>
                      <td data-label="Unit">{stock.material?.unit || 'N/A'}</td>
                      <td data-label="Min Level">{stock.minLevel || 0}</td>
                      <td data-label="Max Level">{stock.maxLevel || 100}</td>
                      <td data-label="Stock Level">
                        <div className="erp-progress-wrap">
                          <div className="erp-progress-bar">
                            <div className={`erp-progress-fill ${colorClass}`} style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="erp-progress-pct">{Math.round(percentage)}%</span>
                        </div>
                      </td>
                      <td data-label="Status">
                        <span className={`erp-badge ${colorClass}`}>
                          {status.label}
                        </span>
                      </td>
                      <td data-label="Location">{stock.location || 'N/A'}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {open && (
        <div className="fm-overlay" onClick={handleClose}>
          <div className="fm-modal fm-md fm-theme-raw-materials" onClick={(e) => e.stopPropagation()}>
            <div className="fm-modal-header">
              <div className="fm-modal-title-group">
                <div className="fm-modal-icon">
                  <Add />
                </div>
                <div>
                  <h2 className="fm-modal-title">Add Raw Material Stock</h2>
                  <p className="fm-modal-subtitle">Create or increase stock for an existing raw material</p>
                </div>
              </div>
              <button className="fm-modal-close" onClick={handleClose}>✕</button>
            </div>

            <div className="fm-modal-body">
              {materials.length === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                  No raw material products available. Create a raw material in Products first.
                </div>
              ) : (
                <form className="fm-form" onSubmit={handleSubmit}>
                  <div className="fm-field">
                    <label className="fm-label">
                      Material <span className="fm-required">*</span>
                    </label>
                    <select
                      className="fm-select"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      required
                    >
                      <option value="">Select raw material</option>
                      {materials.map((material) => (
                        <option key={material._id} value={material._id}>
                          {material.name} ({material.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="fm-field">
                    <label className="fm-label">
                      Quantity <span className="fm-required">*</span>
                    </label>
                    <input
                      type="number"
                      className="fm-input"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="fm-field">
                    <label className="fm-label">Min Level</label>
                    <input
                      type="number"
                      className="fm-input"
                      placeholder="0"
                      value={formData.minLevel}
                      onChange={(e) => setFormData({ ...formData, minLevel: e.target.value })}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="fm-field">
                    <label className="fm-label">Max Level</label>
                    <input
                      type="number"
                      className="fm-input"
                      placeholder="100"
                      value={formData.maxLevel}
                      onChange={(e) => setFormData({ ...formData, maxLevel: e.target.value })}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="fm-field">
                    <label className="fm-label">Location</label>
                    <input
                      type="text"
                      className="fm-input"
                      placeholder="Main Warehouse"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </form>
              )}
            </div>

            <div className="fm-modal-footer">
              <button className="fm-btn fm-btn-secondary" onClick={handleClose} type="button">
                Cancel
              </button>
              <button
                className="fm-btn fm-btn-primary"
                onClick={handleSubmit}
                type="button"
                disabled={submitting || materials.length === 0}
              >
                {submitting ? 'Saving...' : 'Add Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RawMaterialStock;
