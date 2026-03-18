import { useState, useEffect } from 'react';
import '../css/erp.css';
import '../css/forms.css';
import '../css/erp-mobile.css';
import { Add, Visibility, LocalShipping, FileDownload, ReceiptLong } from '@mui/icons-material';
import ConfirmDialog from '../components/ConfirmDialog';
import DetailDrawer from '../components/DetailDrawer';
import { useNotification } from '../context/NotificationContext';
import { salesAPI, customersAPI, productsAPI } from '../services/api';
import { exportToExcel } from '../utils/exportExcel';

const Sales = () => {
  const [open, setOpen] = useState(false);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saleToClose, setSaleToClose] = useState(null);
  const [viewSale, setViewSale] = useState(null);
  const notification = useNotification();
  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    quantity: '',
    price: '',
    totalAmount: 0,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await salesAPI.getAll();
      if (response.success) {
        setSales(response.data);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
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
    setFormData({ customer: '', product: '', quantity: '', price: '', totalAmount: 0, date: new Date().toISOString().split('T')[0] });
  };

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    if (!formData.customer || !formData.product || !formData.quantity || !formData.price || !formData.date) {
      notification.warning('Please fill all required fields.');
      return;
    }

    const quantity = Number(formData.quantity);
    const price = Number(formData.price);
    if (Number.isNaN(quantity) || quantity <= 0) {
      notification.warning('Quantity must be greater than 0.');
      return;
    }

    if (Number.isNaN(price) || price < 0) {
      notification.warning('Price must be a valid number.');
      return;
    }

    const amount = quantity * price;

    try {
      setSubmitting(true);
      const payload = {
        customer: formData.customer,
        items: [{
          product: formData.product,
          quantity,
          price,
          amount,
        }],
        totalAmount: amount,
        date: formData.date,
      };

      const response = await salesAPI.create(payload);
      if (response.success) {
        setSales([response.data, ...sales]);
        notification.success('Sale order created successfully.');
        handleClose();
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      notification.error(error.response?.data?.message || 'Failed to create sale');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setSaleToClose(id);
  };

  const getCustomerName = (customerRef) => {
    if (!customerRef) return '—';
    if (typeof customerRef === 'object') return customerRef.name || '—';
    const matchedCustomer = customers.find((customer) => customer._id === customerRef);
    return matchedCustomer?.name || '—';
  };

  const getProductName = (productRef) => {
    if (!productRef) return '—';
    if (typeof productRef === 'object') return productRef.name || '—';
    const matchedProduct = products.find((product) => product._id === productRef);
    return matchedProduct?.name || '—';
  };

  const handleViewSale = async (sale) => {
    const hasStringRefs =
      typeof sale.customer === 'string' ||
      (sale.items || []).some((item) => typeof item.product === 'string');

    if (!hasStringRefs) {
      setViewSale(sale);
      return;
    }

    try {
      const response = await salesAPI.getById(sale._id);
      if (response.success) {
        setViewSale(response.data);
        return;
      }
    } catch (error) {
      console.error('Error fetching sale details:', error);
    }

    setViewSale(sale);
  };

  const handleDelete = async () => {
    if (!saleToClose) return;

    try {
      const response = await salesAPI.delete(saleToClose);
      if (response.success) {
        setSales(sales.filter((sale) => sale._id !== saleToClose));
        setSaleToClose(null);
        notification.success('Sale order updated successfully.');
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      notification.error(error.response?.data?.message || 'Failed to delete sale');
    }
  };

  const handleExport = () => {
    const rows = sales.map((sale) => ({
      InvoiceNumber: sale.invoiceNumber,
      Customer: sale.customer?.name || '',
      Date: sale.date ? new Date(sale.date).toLocaleDateString() : '',
      TotalAmount: sale.totalAmount || 0,
      Status: sale.status,
    }));

    exportToExcel({ rows, fileName: 'sales', sheetName: 'Sales' });
  };

  return (
    <div className="erp-page">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Sales & Dispatch</h1>
          <p className="erp-page-subtitle">Manage sales orders and dispatch tracking</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-secondary" onClick={handleExport} disabled={sales.length === 0}>
            <FileDownload /> Export Excel
          </button>
          <button className="erp-btn erp-btn-primary" onClick={handleOpen}>
            <Add /> New Sale Order
          </button>
        </div>
      </div>

      <div className="erp-card erp-table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            Loading sales...
          </div>
        ) : sales.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            No sales found. Click "New Sale Order" to create one.
          </div>
        ) : (
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Invoice No.</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount (₹)</th>
                  <th>Status</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td data-label="Invoice No" className="td-mono">{sale.invoiceNumber}</td>
                    <td data-label="Customer" className="td-bold">{getCustomerName(sale.customer)}</td>
                    <td data-label="Date">{new Date(sale.date).toLocaleDateString()}</td>
                    <td data-label="Amount" className="erp-value">₹{sale.totalAmount?.toLocaleString()}</td>
                    <td data-label="Status">
                      <span className={`erp-badge ${
                        sale.status === 'Delivered' ? 'success' : 
                        sale.status === 'Dispatched' ? 'info' :
                        sale.status === 'Cancelled' ? 'danger' : 'warning'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td data-label="Actions" className="td-actions">
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-view" type="button" title="View sale order" onClick={() => handleViewSale(sale)}>
                        <Visibility />
                      </button>
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-ship" onClick={() => handleDeleteRequest(sale._id)} type="button" title="Dispatch or close sale order">
                        <LocalShipping />
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
          <div className="fm-modal fm-md fm-theme-sales" onClick={(e) => e.stopPropagation()}>
            <div className="fm-modal-header">
              <div className="fm-modal-title-group">
                <div className="fm-modal-icon">
                  <Add />
                </div>
                <div>
                  <h2 className="fm-modal-title">Create Sale Order</h2>
                  <p className="fm-modal-subtitle">Record outgoing finished goods and revenue</p>
                </div>
              </div>
              <button className="fm-modal-close" onClick={handleClose} type="button">✕</button>
            </div>
            <div className="fm-modal-body">
              <div className="fm-field">
                <label htmlFor="customer">Customer</label>
                <select 
                  id="customer"
                  className="fm-select"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fm-field">
                <label htmlFor="product">Product</label>
                <select 
                  id="product"
                  className="fm-select"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                >
                  <option value="">Select Product</option>
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
                <label htmlFor="price">Price per Unit (₹)</label>
                <input 
                  id="price"
                  className="fm-input"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Enter price"
                />
              </div>

              <div className="fm-field">
                <label htmlFor="date">Sale Date</label>
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
                {submitting ? 'Creating...' : 'Create Sale'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(saleToClose)}
        title="Close Sale Order"
        message="This action will remove the selected sale order from the current sales list. Continue only if the order should be closed out and removed from active tracking."
        confirmLabel="Close Sale"
        onConfirm={handleDelete}
        onClose={() => setSaleToClose(null)}
        tone="warning"
      />

      <DetailDrawer
        open={Boolean(viewSale)}
        onClose={() => setViewSale(null)}
        title={viewSale?.invoiceNumber || 'Sale Order'}
        subtitle="Sales order details"
        theme="sales"
        icon={<ReceiptLong />}
        badge={
          viewSale ? (
            <span
              className={`erp-badge ${
                viewSale.status === 'Delivered'
                  ? 'success'
                  : viewSale.status === 'Dispatched'
                  ? 'info'
                  : viewSale.status === 'Cancelled'
                  ? 'danger'
                  : 'warning'
              }`}
            >
              {viewSale.status}
            </span>
          ) : null
        }
        sections={[
          {
            title: 'Order Overview',
            items: [
              { label: 'Invoice No.', value: viewSale?.invoiceNumber, mono: true },
              {
                label: 'Date',
                value: viewSale?.date
                  ? new Date(viewSale.date).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })
                  : '—',
              },
              { label: 'Total Amount', value: viewSale ? `₹${viewSale.totalAmount?.toLocaleString()}` : '—' },
            ],
          },
          {
            title: 'Customer',
            items: [
              { label: 'Name', value: getCustomerName(viewSale?.customer) },
              { label: 'Email', value: viewSale?.customer?.email || '—' },
              { label: 'Phone', value: viewSale?.customer?.phone || '—' },
            ],
          },
          {
            title: 'Line Items',
            table: {
              columns: [
                { key: 'product', label: 'Product' },
                { key: 'quantity', label: 'Qty', align: 'right' },
                { key: 'price', label: 'Price', align: 'right' },
                { key: 'amount', label: 'Amount', align: 'right' },
              ],
              rows: (viewSale?.items || []).map((item) => ({
                product: getProductName(item.product),
                quantity: item.quantity,
                price: `₹${item.price?.toLocaleString?.() ?? item.price}`,
                amount: `₹${item.amount?.toLocaleString?.() ?? item.amount}`,
              })),
            },
          },
        ]}
        footer={
          viewSale ? (
            <div className="dd-total-row">
              <span className="dd-total-label">Total Bill Value</span>
              <span className="dd-total-value">₹{viewSale.totalAmount?.toLocaleString()}</span>
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default Sales;
