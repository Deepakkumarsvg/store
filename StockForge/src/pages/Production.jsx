import { useState, useEffect } from 'react';
import '../css/erp.css';
import '../css/forms.css';
import '../css/erp-mobile.css';
import { Add, Visibility, CheckCircle, FileDownload, PrecisionManufacturing } from '@mui/icons-material';
import ConfirmDialog from '../components/ConfirmDialog';
import DetailDrawer from '../components/DetailDrawer';
import { useNotification } from '../context/NotificationContext';
import { productionAPI, productsAPI } from '../services/api';
import { exportToExcel } from '../utils/exportExcel';

const Production = () => {
  const [open, setOpen] = useState(false);
  const [productions, setProductions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [productionToClose, setProductionToClose] = useState(null);
  const [viewProduction, setViewProduction] = useState(null);
  const notification = useNotification();
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchProductions();
    fetchProducts();
  }, []);

  const fetchProductions = async () => {
    try {
      setLoading(true);
      const response = await productionAPI.getAll();
      if (response.success) {
        setProductions(response.data);
      }
    } catch (error) {
      console.error('Error fetching productions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ product: '', quantity: '', startDate: new Date().toISOString().split('T')[0] });
  };

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    if (!formData.product || !formData.quantity || !formData.startDate) {
      notification.warning('Please fill all required fields.');
      return;
    }

    const quantity = Number(formData.quantity);
    if (Number.isNaN(quantity) || quantity <= 0) {
      notification.warning('Quantity must be greater than 0.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        quantity,
      };

      const response = await productionAPI.create(payload);
      if (response.success) {
        fetchProductions();
        notification.success('Production job created successfully.');
        handleClose();
      }
    } catch (error) {
      console.error('Error creating production:', error);
      notification.error(error.response?.data?.message || 'Failed to create production job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setProductionToClose(id);
  };

  const handleDelete = async () => {
    if (!productionToClose) return;

    try {
      const response = await productionAPI.delete(productionToClose);
      if (response.success) {
        setProductions(productions.filter((production) => production._id !== productionToClose));
        setProductionToClose(null);
        notification.success('Production job updated successfully.');
      }
    } catch (error) {
      console.error('Error deleting production:', error);
      notification.error(error.response?.data?.message || 'Failed to delete production job');
    }
  };

  const handleExport = () => {
    const rows = productions.map((production) => ({
      JobNumber: production.jobNumber,
      Product: production.product?.name || '',
      Quantity: production.quantity || 0,
      StartDate: production.startDate ? new Date(production.startDate).toLocaleDateString() : '',
      Status: production.status,
    }));

    exportToExcel({ rows, fileName: 'production-jobs', sheetName: 'Production' });
  };

  return (
    <div className="erp-page">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Production / Manufacturing</h1>
          <p className="erp-page-subtitle">Manage production jobs and manufacturing processes</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-secondary" onClick={handleExport} disabled={productions.length === 0}>
            <FileDownload /> Export Excel
          </button>
          <button className="erp-btn erp-btn-primary" onClick={handleOpen}>
            <Add /> New Production Job
          </button>
        </div>
      </div>

      <div className="erp-card erp-table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            Loading production jobs...
          </div>
        ) : productions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            No production jobs found. Click "New Production Job" to create one.
          </div>
        ) : (
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Job Number</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Start Date</th>
                  <th>Status</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productions.map((production) => (
                  <tr key={production._id}>
                    <td data-label="Job Number" className="td-mono">{production.jobNumber}</td>
                    <td data-label="Product" className="td-bold">{production.product?.name || 'N/A'}</td>
                    <td data-label="Quantity">{production.quantity}</td>
                    <td data-label="Start Date">{new Date(production.startDate).toLocaleDateString()}</td>
                    <td data-label="Status">
                      <span className={`erp-badge ${production.status === 'Completed' ? 'success' : production.status === 'Cancelled' ? 'danger' : 'warning'}`}>
                        {production.status}
                      </span>
                    </td>
                    <td data-label="Actions" className="td-actions">
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-view" type="button" title="View production job" onClick={() => setViewProduction(production)}>
                        <Visibility />
                      </button>
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-complete" onClick={() => handleDeleteRequest(production._id)} type="button" title="Complete or close production job">
                        <CheckCircle />
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {open && (
        <div className="fm-overlay" onClick={handleClose}>
          <div className="fm-modal fm-md fm-theme-production" onClick={(e) => e.stopPropagation()}>
            <div className="fm-modal-header">
              <div className="fm-modal-title-group">
                <div className="fm-modal-icon">
                  <Add />
                </div>
                <div>
                  <h2 className="fm-modal-title">Create Production Job</h2>
                  <p className="fm-modal-subtitle">Start a new manufacturing job</p>
                </div>
              </div>
              <button className="fm-modal-close" onClick={handleClose}>✕</button>
            </div>

            <div className="fm-modal-body">
              <form className="fm-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="fm-field">
                  <label className="fm-label">
                    Product <span className="fm-required">*</span>
                  </label>
                  <select
                    className="fm-select"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    required
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="fm-field">
                  <label className="fm-label">
                    Quantity to Produce <span className="fm-required">*</span>
                  </label>
                  <input
                    type="number"
                    className="fm-input"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    min="1"
                  />
                </div>

                <div className="fm-field">
                  <label className="fm-label">
                    Start Date <span className="fm-required">*</span>
                  </label>
                  <input
                    type="date"
                    className="fm-input"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
              </form>
            </div>

            <div className="fm-modal-footer">
              <button className="fm-btn fm-btn-secondary" onClick={handleClose} type="button">
                Cancel
              </button>
              <button className="fm-btn fm-btn-success" onClick={handleSubmit} type="button" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(productionToClose)}
        title="Complete Production Job"
        message="This will remove the selected production job from the active queue. Continue only if manufacturing is complete and the record should be closed out."
        confirmLabel="Complete Job"
        onConfirm={handleDelete}
        onClose={() => setProductionToClose(null)}
        tone="success"
      />

      <DetailDrawer
        open={Boolean(viewProduction)}
        onClose={() => setViewProduction(null)}
        title={viewProduction?.jobNumber || 'Production Job'}
        subtitle="Manufacturing job details"
        theme="production"
        icon={<PrecisionManufacturing />}
        badge={
          viewProduction ? (
            <span
              className={`erp-badge ${
                viewProduction.status === 'Completed'
                  ? 'success'
                  : viewProduction.status === 'Cancelled'
                  ? 'danger'
                  : 'warning'
              }`}
            >
              {viewProduction.status}
            </span>
          ) : null
        }
        sections={[
          {
            title: 'Job Overview',
            items: [
              { label: 'Job Number', value: viewProduction?.jobNumber, mono: true },
              { label: 'Product', value: viewProduction?.product?.name || '—' },
              { label: 'Quantity', value: viewProduction?.quantity ?? '—' },
              {
                label: 'Start Date',
                value: viewProduction?.startDate
                  ? new Date(viewProduction.startDate).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })
                  : '—',
              },
              {
                label: 'End Date',
                value: viewProduction?.endDate
                  ? new Date(viewProduction.endDate).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })
                  : '—',
              },
            ],
          },
          {
            title: 'Raw Materials Used',
            table: {
              columns: [
                { key: 'material', label: 'Material' },
                { key: 'quantity', label: 'Qty', align: 'right' },
              ],
              rows: (viewProduction?.rawMaterialsUsed || []).map((item) => ({
                material: item.material?.name || '—',
                quantity: item.quantity ?? '—',
              })),
            },
          },
          {
            title: 'Notes',
            items: [
              { label: 'Details', value: viewProduction?.notes || 'No notes added' },
            ],
          },
        ]}
      />
    </div>
  );
};

export default Production;
