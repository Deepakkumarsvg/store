import { useState, useEffect } from 'react';
import '../../css/erp.css';
import '../../css/forms.css';
import '../../css/erp-mobile.css';
import { Add, Edit, Delete, FileDownload } from '@mui/icons-material';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useNotification } from '../../context/NotificationContext';
import { productsAPI } from '../../services/api';
import { exportToExcel } from '../../utils/exportExcel';

const Products = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Raw Material',
    unit: '',
    price: '',
  });
  const notification = useNotification();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', type: 'Raw Material', unit: '', price: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      unit: formData.unit.trim(),
      price: Number.parseFloat(formData.price),
    };

    if (!payload.name || !payload.unit || Number.isNaN(payload.price)) {
      notification.warning('Please fill in all required product fields.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await productsAPI.create(payload);
      if (response.success) {
        setProducts([...products, response.data]);
        notification.success('Product created successfully.');
        handleClose();
      }
    } catch (error) {
      console.error('Error creating product:', error);
      notification.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setProductToDelete(id);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await productsAPI.delete(productToDelete);
      if (response.success) {
        setProducts(products.filter((product) => product._id !== productToDelete));
        setProductToDelete(null);
        notification.success('Product deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      notification.error('Failed to delete product');
    }
  };

  const handleExport = () => {
    const rows = products.map((product) => ({
      SKU: product.sku || '',
      Name: product.name,
      Type: product.type,
      Unit: product.unit,
      Price: product.price,
      Category: product.category || 'General',
      Status: product.status || 'Active',
    }));

    exportToExcel({ rows, fileName: 'products', sheetName: 'Products' });
  };

  return (
    <div className="erp-page">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Products</h1>
          <p className="erp-page-subtitle">Manage raw materials and finished goods</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-secondary" onClick={handleExport} disabled={products.length === 0}>
            <FileDownload /> Export Excel
          </button>
          <button className="erp-btn erp-btn-primary" onClick={handleOpen}>
            <Add /> Add Product
          </button>
        </div>
      </div>

      <div className="erp-card erp-table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            No products found. Click "Add Product" to create one.
          </div>
        ) : (
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Type</th>
                  <th>Unit</th>
                  <th>Price (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td data-label="SKU" className="td-mono">{product.sku || 'N/A'}</td>
                    <td data-label="Product Name" className="td-bold">{product.name}</td>
                    <td data-label="Type"><span className={`erp-badge ${product.type === 'Raw Material' ? 'info' : 'success'}`}>{product.type}</span></td>
                    <td data-label="Unit">{product.unit}</td>
                    <td data-label="Price" className="erp-value">₹{product.price}</td>
                    <td data-label="Actions" className="td-actions">
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-edit" type="button" title="Edit product">
                        <Edit />
                      </button>
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-delete" onClick={() => handleDeleteRequest(product._id)} type="button" title="Delete product">
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
          <div className="fm-modal fm-md fm-theme-products" onClick={(e) => e.stopPropagation()}>
            <div className="fm-modal-header">
              <div className="fm-modal-title-group">
                <div className="fm-modal-icon">
                  <Add />
                </div>
                <div>
                  <h2 className="fm-modal-title">Add New Product</h2>
                  <p className="fm-modal-subtitle">Create a new product entry</p>
                </div>
              </div>
              <button className="fm-modal-close" onClick={handleClose}>✕</button>
            </div>

            <div className="fm-modal-body">
              <form className="fm-form" onSubmit={handleSubmit}>
                <div className="fm-field">
                  <label className="fm-label">
                    Product Name <span className="fm-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="fm-input"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="fm-field">
                  <label className="fm-label">
                    Type <span className="fm-required">*</span>
                  </label>
                  <select
                    className="fm-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="Raw Material">Raw Material</option>
                    <option value="Finished Good">Finished Good</option>
                  </select>
                </div>

                <div className="fm-field">
                  <label className="fm-label">
                    Unit <span className="fm-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="fm-input"
                    placeholder="e.g., Kg, Meter, Piece"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                  />
                </div>

                <div className="fm-field">
                  <label className="fm-label">
                    Price (₹) <span className="fm-required">*</span>
                  </label>
                  <input
                    type="number"
                    className="fm-input"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    step="0.01"
                    min="0"
                  />
                </div>
              </form>
            </div>

            <div className="fm-modal-footer">
              <button className="fm-btn fm-btn-secondary" onClick={handleClose} type="button">
                Cancel
              </button>
              <button className="fm-btn fm-btn-primary" onClick={handleSubmit} type="button" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(productToDelete)}
        title="Delete Product"
        message="This will permanently remove the selected product from the catalog. Continue only if the product is no longer needed in stock or planning records."
        confirmLabel="Delete Product"
        onConfirm={handleDelete}
        onClose={() => setProductToDelete(null)}
        tone="danger"
      />
    </div>
  );
};

export default Products;
