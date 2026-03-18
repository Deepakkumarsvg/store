import { useState, useEffect } from 'react';
import '../css/erp.css';
import '../css/forms.css';
import '../css/erp-mobile.css';
import { Add, Visibility, Delete, FileDownload, ReceiptLong } from '@mui/icons-material';
import ConfirmDialog from '../components/ConfirmDialog';
import DetailDrawer from '../components/DetailDrawer';
import { useNotification } from '../context/NotificationContext';
import { purchasesAPI, suppliersAPI, productsAPI, createRequestController } from '../services/api';
import { exportToExcel } from '../utils/exportExcel';

const Purchase = () => {
  const [open, setOpen] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);
  const [viewPurchase, setViewPurchase] = useState(null);
  const [formData, setFormData] = useState({
    supplier: '',
    product: '',
    quantity: '',
    rate: '',
    totalAmount: 0,
    date: new Date().toISOString().split('T')[0],
  });
  const notification = useNotification();

  useEffect(() => {
    const controller = createRequestController();

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [purchasesResponse, suppliersResponse, productsResponse] = await Promise.all([
          purchasesAPI.getAll({ signal: controller.signal }),
          suppliersAPI.getAll({ signal: controller.signal }),
          productsAPI.getAll({ signal: controller.signal }),
        ]);

        if (purchasesResponse.success) {
          setPurchases(purchasesResponse.data);
        }

        if (suppliersResponse.success) {
          setSuppliers(suppliersResponse.data);
        }

        if (productsResponse.success) {
          setProducts(productsResponse.data);
        }
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          console.error('Error loading purchase data:', error);
          notification.error('Failed to load purchase data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    return () => {
      controller.abort();
    };
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ supplier: '', product: '', quantity: '', rate: '', totalAmount: 0, date: new Date().toISOString().split('T')[0] });
  };

  const handleSubmit = async () => {
    if (!formData.supplier || !formData.product || !formData.quantity || !formData.rate || !formData.date) {
      notification.warning('Please fill all required fields.');
      return;
    }

    const quantity = Number(formData.quantity);
    const rate = Number(formData.rate);

    if (Number.isNaN(quantity) || quantity <= 0) {
      notification.warning('Quantity must be greater than 0.');
      return;
    }

    if (Number.isNaN(rate) || rate < 0) {
      notification.warning('Rate must be a valid number.');
      return;
    }

    const amount = quantity * rate;

    try {
      setSubmitting(true);
      const payload = {
        supplier: formData.supplier,
        items: [{
          product: formData.product,
          quantity,
          rate,
          amount,
        }],
        totalAmount: amount,
        date: formData.date,
      };

      const response = await purchasesAPI.create(payload);
      if (response.success) {
        setPurchases([response.data, ...purchases]);
        notification.success('Purchase order created successfully.');
        handleClose();
      }
    } catch (error) {
      console.error('Error creating purchase:', error);
      notification.error(error.response?.data?.message || 'Failed to create purchase');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setPurchaseToDelete(id);
  };

  const handleDelete = async () => {
    if (!purchaseToDelete) return;

    try {
      const response = await purchasesAPI.delete(purchaseToDelete);
      if (response.success) {
        setPurchases(purchases.filter((purchase) => purchase._id !== purchaseToDelete));
        setPurchaseToDelete(null);
        notification.success('Purchase order deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting purchase:', error);
      notification.error('Failed to delete purchase');
    }
  };

  const handleExport = () => {
    const rows = purchases.map((purchase) => ({
      PONumber: purchase.poNumber,
      Supplier: purchase.supplier?.name || '',
      Date: purchase.date ? new Date(purchase.date).toLocaleDateString() : '',
      TotalAmount: purchase.totalAmount || 0,
      Status: purchase.status,
    }));

    exportToExcel({ rows, fileName: 'purchases', sheetName: 'Purchases' });
  };

  return (
    <div className="erp-page">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Raw Material Purchase</h1>
          <p className="erp-page-subtitle">Create and manage purchase orders</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-secondary" onClick={handleExport} disabled={purchases.length === 0}>
            <FileDownload /> Export Excel
          </button>
          <button className="erp-btn erp-btn-primary" onClick={handleOpen}>
            <Add /> New Purchase Order
          </button>
        </div>
      </div>

      <div className="erp-card erp-table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            Loading purchases...
          </div>
        ) : purchases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            No purchases found. Click "New Purchase Order" to create one.
          </div>
        ) : (
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Supplier</th>
                  <th>Date</th>
                  <th>Amount (₹)</th>
                  <th>Status</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase._id}>
                    <td data-label="PO Number" className="td-mono">{purchase.poNumber}</td>
                    <td data-label="Supplier" className="td-bold">{purchase.supplier?.name || 'N/A'}</td>
                    <td data-label="Date">{new Date(purchase.date).toLocaleDateString()}</td>
                    <td data-label="Amount" className="erp-value">₹{purchase.totalAmount?.toLocaleString()}</td>
                    <td data-label="Status">
                      <span className={`erp-badge ${purchase.status === 'Received' ? 'success' : purchase.status === 'Cancelled' ? 'danger' : 'warning'}`}>
                        {purchase.status}
                      </span>
                    </td>
                    <td data-label="Actions" className="td-actions">
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-view" type="button" title="View purchase order" onClick={() => setViewPurchase(purchase)}>
                        <Visibility />
                      </button>
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-delete" onClick={() => handleDeleteRequest(purchase._id)} type="button" title="Delete purchase order">
                        <Delete />
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
          <div className="fm-modal fm-md fm-theme-purchase" onClick={(e) => e.stopPropagation()}>
            <div className="fm-modal-header">
              <div className="fm-modal-title-group">
                <div className="fm-modal-icon">
                  <Add />
                </div>
                <div>
                  <h2 className="fm-modal-title">Create Purchase Order</h2>
                  <p className="fm-modal-subtitle">Capture supplier intake and raw material cost</p>
                </div>
              </div>
              <button className="fm-modal-close" onClick={handleClose} type="button">✕</button>
            </div>
            <div className="fm-modal-body">
              <div className="fm-field">
                <label htmlFor="supplier">Supplier</label>
                <select 
                  id="supplier"
                  className="fm-select"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fm-field">
                <label htmlFor="material">Material</label>
                <select 
                  id="material"
                  className="fm-select"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                >
                  <option value="">Select Material</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fm-field">
                <label htmlFor="quantity">Quantity</label>
                <input 
                  id="quantity"
                  className="fm-input"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="fm-field">
                <label htmlFor="rate">Rate per Unit (₹)</label>
                <input 
                  id="rate"
                  className="fm-input"
                  type="number"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  placeholder="Enter rate"
                />
              </div>

              <div className="fm-field">
                <label htmlFor="date">Purchase Date</label>
                <input 
                  id="date"
                  className="fm-input"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            <div className="fm-modal-footer">
              <button className="fm-btn fm-btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button className="fm-btn fm-btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Creating...' : 'Create PO'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(purchaseToDelete)}
        title="Delete Purchase Order"
        message="This purchase order will be removed from procurement tracking. Continue only if you are sure it was created by mistake or is no longer valid."
        confirmLabel="Delete Purchase"
        onConfirm={handleDelete}
        onClose={() => setPurchaseToDelete(null)}
        tone="danger"
      />

      <DetailDrawer
        open={Boolean(viewPurchase)}
        onClose={() => setViewPurchase(null)}
        title={viewPurchase?.poNumber || 'Purchase Order'}
        subtitle="Purchase order details"
        theme="purchase"
        icon={<ReceiptLong />}
        badge={
          viewPurchase ? (
            <span
              className={`erp-badge ${
                viewPurchase.status === 'Received'
                  ? 'success'
                  : viewPurchase.status === 'Cancelled'
                  ? 'danger'
                  : 'warning'
              }`}
            >
              {viewPurchase.status}
            </span>
          ) : null
        }
        sections={[
          {
            title: 'Order Overview',
            items: [
              { label: 'PO Number',  value: viewPurchase?.poNumber,  mono: true },
              {
                label: 'Date',
                value: viewPurchase?.date
                  ? new Date(viewPurchase.date).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })
                  : '—',
              },
              { label: 'Total Amount', value: viewPurchase ? `₹${viewPurchase.totalAmount?.toLocaleString()}` : '—' },
            ],
          },
          {
            title: 'Supplier',
            items: [
              { label: 'Name',  value: viewPurchase?.supplier?.name  || '—' },
              { label: 'Email', value: viewPurchase?.supplier?.email || '—' },
              { label: 'Phone', value: viewPurchase?.supplier?.phone || '—' },
            ],
          },
          {
            title: 'Line Items',
            table: {
              columns: [
                { key: 'product',  label: 'Product' },
                { key: 'quantity', label: 'Qty',    align: 'right' },
                { key: 'rate',     label: 'Rate',   align: 'right' },
                { key: 'amount',   label: 'Amount', align: 'right' },
              ],
              rows: (viewPurchase?.items || []).map((item) => ({
                product:  item.product?.name || item.product || '—',
                quantity: item.quantity,
                rate:     `₹${item.rate?.toLocaleString?.() ?? item.rate}`,
                amount:   `₹${item.amount?.toLocaleString?.() ?? item.amount}`,
              })),
            },
          },
        ]}
        footer={
          viewPurchase ? (
            <div className="dd-total-row">
              <span className="dd-total-label">Total Amount</span>
              <span className="dd-total-value">₹{viewPurchase.totalAmount?.toLocaleString()}</span>
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default Purchase;
