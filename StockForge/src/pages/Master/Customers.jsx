import { useState, useEffect } from 'react';
import '../../css/erp.css';
import '../../css/forms.css';
import '../../css/erp-mobile.css';
import { Add, Edit, Delete, FileDownload } from '@mui/icons-material';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useNotification } from '../../context/NotificationContext';
import { customersAPI } from '../../services/api';
import { exportToExcel } from '../../utils/exportExcel';

const Customers = () => {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const notification = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    gst: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getAll();
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
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
      const response = await customersAPI.create(formData);
      if (response.success) {
        setCustomers([...customers, response.data]);
        notification.success('Customer created successfully.');
        handleClose();
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      notification.error(error.response?.data?.message || 'Failed to create customer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setCustomerToDelete(id);
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;

    try {
      const response = await customersAPI.delete(customerToDelete);
      if (response.success) {
        setCustomers(customers.filter((customer) => customer._id !== customerToDelete));
        setCustomerToDelete(null);
        notification.success('Customer deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      notification.error(error.response?.data?.message || 'Failed to delete customer');
    }
  };

  const handleExport = () => {
    const rows = customers.map((customer) => ({
      Name: customer.name,
      Contact: customer.contact,
      Email: customer.email,
      Address: customer.address || '',
      GST: customer.gst || '',
      Status: customer.status,
    }));

    exportToExcel({ rows, fileName: 'customers', sheetName: 'Customers' });
  };

  return (
    <div className="erp-page">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Customers</h1>
          <p className="erp-page-subtitle">Manage customer database and information</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-secondary" onClick={handleExport} disabled={customers.length === 0}>
            <FileDownload /> Export Excel
          </button>
          <button className="erp-btn erp-btn-primary" onClick={handleOpen}>
            <Add /> Add Customer
          </button>
        </div>
      </div>

      <div className="erp-card erp-table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            No customers found. Click "Add Customer" to create one.
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
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td data-label="Name" className="td-bold">{customer.name}</td>
                    <td data-label="Contact">{customer.contact}</td>
                    <td data-label="Email">{customer.email}</td>
                    <td data-label="Address">{customer.address || 'N/A'}</td>
                    <td data-label="Status"><span className={`erp-badge ${customer.status === 'Active' ? 'success' : 'warning'}`}>{customer.status}</span></td>
                    <td data-label="Actions" className="td-actions">
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-edit" type="button" title="Edit customer">
                        <Edit />
                      </button>
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-delete" onClick={() => handleDeleteRequest(customer._id)} type="button" title="Delete customer">
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
          <div className="fm-modal fm-md fm-theme-customers" onClick={(e) => e.stopPropagation()}>
            <div className="fm-modal-header">
              <div className="fm-modal-title-group">
                <div className="fm-modal-icon">
                  <Add />
                </div>
                <div>
                  <h2 className="fm-modal-title">Add New Customer</h2>
                  <p className="fm-modal-subtitle">Register a new customer</p>
                </div>
              </div>
              <button className="fm-modal-close" onClick={handleClose}>✕</button>
            </div>

            <div className="fm-modal-body">
              <form className="fm-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="fm-field">
                  <label className="fm-label">
                    Customer Name <span className="fm-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="fm-input"
                    placeholder="Enter customer name"
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
                    placeholder="customer@example.com"
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
                    placeholder="Enter customer address"
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
                {submitting ? 'Adding...' : 'Add Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(customerToDelete)}
        title="Delete Customer"
        message="This will remove the selected customer from your sales contact list. Continue only if the customer record is no longer required."
        confirmLabel="Delete Customer"
        onConfirm={handleDelete}
        onClose={() => setCustomerToDelete(null)}
        tone="danger"
      />
    </div>
  );
};

export default Customers;
