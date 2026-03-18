import { useState, useEffect } from 'react';
import '../../css/erp.css';
import '../../css/forms.css';
import '../../css/erp-mobile.css';
import { Add, Edit, Delete, FileDownload } from '@mui/icons-material';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useNotification } from '../../context/NotificationContext';
import { unitsAPI } from '../../services/api';
import { exportToExcel } from '../../utils/exportExcel';

const Units = () => {
  const [open, setOpen] = useState(false);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const notification = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    shortForm: '',
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const response = await unitsAPI.getAll();
      if (response.success) {
        setUnits(response.data);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', shortForm: '' });
  };

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await unitsAPI.create(formData);
      if (response.success) {
        setUnits([...units, response.data]);
        notification.success('Unit created successfully.');
        handleClose();
      }
    } catch (error) {
      console.error('Error creating unit:', error);
      notification.error(error.response?.data?.message || 'Failed to create unit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setUnitToDelete(id);
  };

  const handleDelete = async () => {
    if (!unitToDelete) return;

    try {
      const response = await unitsAPI.delete(unitToDelete);
      if (response.success) {
        setUnits(units.filter((unit) => unit._id !== unitToDelete));
        setUnitToDelete(null);
        notification.success('Unit deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting unit:', error);
      notification.error(error.response?.data?.message || 'Failed to delete unit');
    }
  };

  const handleExport = () => {
    const rows = units.map((unit) => ({
      Name: unit.name,
      ShortForm: unit.shortForm,
      CreatedAt: unit.createdAt || '',
    }));

    exportToExcel({ rows, fileName: 'units', sheetName: 'Units' });
  };

  return (
    <div className="erp-page">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Units of Measurement</h1>
          <p className="erp-page-subtitle">Define measurement units for products</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-secondary" onClick={handleExport} disabled={units.length === 0}>
            <FileDownload /> Export Excel
          </button>
          <button className="erp-btn erp-btn-primary" onClick={handleOpen}>
            <Add /> Add Unit
          </button>
        </div>
      </div>

      <div className="erp-card erp-table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            Loading units...
          </div>
        ) : units.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            No units found. Click "Add Unit" to create one.
          </div>
        ) : (
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Unit Name</th>
                  <th>Short Form</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit._id}>
                    <td data-label="Unit Name" className="td-bold">{unit.name}</td>
                    <td data-label="Short Form"><span className="erp-badge info">{unit.shortForm}</span></td>
                    <td data-label="Actions" className="td-actions">
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-edit" type="button" title="Edit unit">
                        <Edit />
                      </button>
                      <button className="erp-btn erp-btn-ghost erp-action-btn erp-action-delete" onClick={() => handleDeleteRequest(unit._id)} type="button" title="Delete unit">
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
          <div className="fm-modal fm-sm fm-theme-units" onClick={(e) => e.stopPropagation()}>
            <div className="fm-modal-header">
              <div className="fm-modal-title-group">
                <div className="fm-modal-icon">
                  <Add />
                </div>
                <div>
                  <h2 className="fm-modal-title">Add New Unit</h2>
                  <p className="fm-modal-subtitle">Define a measurement unit</p>
                </div>
              </div>
              <button className="fm-modal-close" onClick={handleClose}>✕</button>
            </div>

            <div className="fm-modal-body">
              <form className="fm-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="fm-field">
                  <label className="fm-label">
                    Unit Name <span className="fm-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="fm-input"
                    placeholder="e.g., Kilogram"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="fm-field">
                  <label className="fm-label">
                    Short Form <span className="fm-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="fm-input"
                    placeholder="e.g., Kg"
                    value={formData.shortForm}
                    onChange={(e) => setFormData({ ...formData, shortForm: e.target.value })}
                    required
                  />
                </div>
              </form>
            </div>

            <div className="fm-modal-footer">
              <button className="fm-btn fm-btn-secondary" onClick={handleClose} type="button">
                Cancel
              </button>
              <button className="fm-btn fm-btn-primary" onClick={handleSubmit} type="button" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Unit'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(unitToDelete)}
        title="Delete Unit"
        message="This measurement unit will be removed from the master list. Continue only if it is not needed for any current product definitions."
        confirmLabel="Delete Unit"
        onConfirm={handleDelete}
        onClose={() => setUnitToDelete(null)}
        tone="danger"
      />
    </div>
  );
};

export default Units;
