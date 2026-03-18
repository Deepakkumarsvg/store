import { useState, useEffect } from 'react';
import '../../css/erp.css';
import '../../css/forms.css';
import '../../css/erp-mobile.css';
import { Add, Edit, Delete, FileDownload } from '@mui/icons-material';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useNotification } from '../../context/NotificationContext';
import { suppliersAPI } from '../../services/api';
import { exportToExcel } from '../../utils/exportExcel';

const Suppliers = () => {
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const notification = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    gst: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await suppliersAPI.getAll();
      if (response.success) {
        setSuppliers(response.data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', contact: '', email: '', address: '', gst: '' });
  };

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await suppliersAPI.create(formData);
      if (response.success) {
        setSuppliers([...suppliers, response.data]);
        notification.success('Supplier created successfully.');
        handleClose();
      }
    } catch (error) {
      console.error('Error creating supplier:', error);
      notification.error(error.response?.data?.message || 'Failed to create supplier');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setSupplierToDelete(id);
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;

    try {
      const response = await suppliersAPI.delete(supplierToDelete);
      if (response.success) {
        setSuppliers(suppliers.filter((supplier) => supplier._id !== supplierToDelete));
        setSupplierToDelete(null);
        notification.success('Supplier deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      notification.error(error.response?.data?.message || 'Failed to delete supplier');
    }
  };

  const handleExport = () => {
    const rows = suppliers.map((supplier) => ({
      Name: supplier.name,
      Contact: supplier.contact,
      Email: supplier.email,
      Address: supplier.address || '',
      GST: supplier.gst || '',
      Status: supplier.status,
    }));

    exportToExcel({ rows, fileName: 'suppliers', sheetName: 'Suppliers' });
  };

  return (
    <div className="erp-page">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Suppliers</h1>
          <p className="erp-page-subtitle">Manage supplier information and contacts</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-secondary" onClick={handleExport} disabled={suppliers.length === 0}>
            <FileDownload /> Export Excel
          </button>
          <button className="erp-btn erp-btn-primary" onClick={handleOpen}>
            <Add /> Add Supplier
          </button>
        </div>
      </div>

      <div className="erp-card erp-table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            Loading suppliers...
          </div>
        ) : suppliers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            No suppliers found. Click "Add Supplier" to create one.
          </div>
        ) : (
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td data-label="Name" className="td-bold">{supplier.name}</td>
                    <td data-label="Contact">{supplier.contact}</td>
                    <td data-label="Email">{supplier.email}</td>
                    <td data-label="Address">{supplier.address || 'N/A'}</td>
                    <td data-label="Status"><span className={`erp-badge ${supplier.status === 'Active' ? 'success' : 'warning'}`}>{supplier.status}</span></td>
                    <td data-label="Actions" className="td-actions">
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-edit" type="button" title="Edit supplier">
                        <Edit />
                      </button>
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-delete" onClick={() => handleDeleteRequest(supplier._id)} type="button" title="Delete supplier">
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
          <div className="fm-modal fm-md fm-theme-suppliers" onClick={(e) => e.stopPropagation()}>
            <div className="fm-modal-header">
              <div className="fm-modal-title-group">
                <div className="fm-modal-icon">
                  <Add />
                </div>
                <div>
                  <h2 className="fm-modal-title">Add New Supplier</h2>
                  <p className="fm-modal-subtitle">Register a new supplier</p>
                </div>
              </div>
              <button className="fm-modal-close" onClick={handleClose}>✕</button>
            </div>

            <div className="fm-modal-body">
              <form className="fm-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="fm-field">
                  <label className="fm-label">
                    Supplier Name <span className="fm-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="fm-input"
                    placeholder="Enter supplier name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="fm-field">
                  <label className="fm-label">
                    Contact Number <span className="fm-required">*</span>
                  </label>
                  <input
                    type="tel"
                    className="fm-input"
                    placeholder="Enter phone number"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    required
                  />
                </div>

                <div className="fm-field">
                  <label className="fm-label">
                    Email <span className="fm-required">*</span>
                  </label>
                  <input
                    type="email"
                    className="fm-input"
                    placeholder="supplier@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="fm-field">
                  <label className="fm-label">
                    Address <span className="fm-required">*</span>
                  </label>
                  <textarea
                    className="fm-textarea"
                    placeholder="Enter supplier address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    rows={3}
                  />
                </div>
              </form>
            </div>

            <div className="fm-modal-footer">
              <button className="fm-btn fm-btn-secondary" onClick={handleClose} type="button">
                Cancel
              </button>
              <button className="fm-btn fm-btn-primary" onClick={handleSubmit} type="button" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Supplier'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(supplierToDelete)}
        title="Delete Supplier"
        message="This supplier record will be removed from the vendor list. Continue only if it is no longer referenced for future procurement work."
        confirmLabel="Delete Supplier"
        onConfirm={handleDelete}
        onClose={() => setSupplierToDelete(null)}
        tone="danger"
      />
    </div>
  );
};

export default Suppliers;
