import { useEffect, useMemo, useState } from 'react';
import { MarkEmailRead, TaskAlt, Refresh, MailOutline, FileDownload } from '@mui/icons-material';
import '../css/erp.css';
import '../css/erp-mobile.css';
import { enquiriesAPI } from '../services/api';
import { exportToExcel } from '../utils/exportExcel';

const statusToClass = {
  New: 'warning',
  Contacted: 'info',
  Closed: 'success',
};

const Enquiries = () => {
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [enquiries, setEnquiries] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, open: 0, contacted: 0, closed: 0 });
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEnquiries = async ({ exportMode = false } = {}) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: exportMode ? 1 : currentPage,
        limit: exportMode ? 5000 : pageSize,
      };

      if (statusFilter !== 'All') {
        params.status = statusFilter;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      if (fromDate) {
        params.fromDate = fromDate;
      }
      if (toDate) {
        params.toDate = toDate;
      }

      const response = await enquiriesAPI.getAll(params);
      if (response.success) {
        const rows = response.data || [];

        if (exportMode) {
          return rows;
        }

        setEnquiries(rows);

        const pagination = response.pagination || {};
        setTotalItems(pagination.total || 0);
        setTotalPages(pagination.totalPages || 1);

        const counts = response.counts || {};
        setMetrics({
          total: counts.total || 0,
          open: counts.new || 0,
          contacted: counts.contacted || 0,
          closed: counts.closed || 0,
        });
      }
      return [];
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load enquiries.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchQuery]);

  useEffect(() => {
    fetchEnquiries();
  }, [currentPage, pageSize, statusFilter, debouncedSearch, fromDate, toDate]);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError('');
      const response = await enquiriesAPI.updateStatus(id, status);
      if (response.success) {
        fetchEnquiries();
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update enquiry status.');
    } finally {
      setUpdatingId('');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, debouncedSearch, fromDate, toDate, pageSize]);

  const exportRowsFromEnquiries = (rows) => rows.map((item) => ({
    Name: item.name || '',
    Phone: item.phone || '',
    Email: item.email || '',
    Requirement: item.message || '',
    Status: item.status || '',
    Source: item.source || 'landing-page',
    Date: item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : '',
  }));

  const handleExportExcel = async () => {
    const rows = await fetchEnquiries({ exportMode: true });
    const exportRows = exportRowsFromEnquiries(rows);

    exportToExcel({
      rows: exportRows,
      fileName: `enquiries_${new Date().toISOString().slice(0, 10)}`,
      sheetName: 'Enquiries',
    });
  };

  const handleExportCsv = async () => {
    const rows = await fetchEnquiries({ exportMode: true });
    const exportRows = exportRowsFromEnquiries(rows);

    if (!exportRows.length) {
      return;
    }

    const headers = Object.keys(exportRows[0]);
    const escapeValue = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csvLines = [
      headers.join(','),
      ...exportRows.map((row) => headers.map((header) => escapeValue(row[header])).join(',')),
    ];

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enquiries_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="erp-page">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Enquiries</h1>
          <p className="erp-page-subtitle">View and manage landing page enquiries</p>
        </div>
        <button className="erp-btn erp-btn-secondary" onClick={() => fetchEnquiries()}>
          <Refresh /> Refresh
        </button>
      </div>

      <div className="erp-stat-grid" style={{ marginBottom: '20px' }}>
        <div className="erp-stat-card warning">
          <div className="erp-stat-label">Total Enquiries</div>
          <div className="erp-stat-value mono">{metrics.total}</div>
          <div className="erp-stat-icon warning"><MailOutline /></div>
        </div>
        <div className="erp-stat-card warning">
          <div className="erp-stat-label">New</div>
          <div className="erp-stat-value mono">{metrics.open}</div>
          <div className="erp-stat-icon warning"><MailOutline /></div>
        </div>
        <div className="erp-stat-card blue">
          <div className="erp-stat-label">Contacted</div>
          <div className="erp-stat-value mono">{metrics.contacted}</div>
          <div className="erp-stat-icon blue"><MarkEmailRead /></div>
        </div>
        <div className="erp-stat-card success">
          <div className="erp-stat-label">Closed</div>
          <div className="erp-stat-value mono">{metrics.closed}</div>
          <div className="erp-stat-icon success"><TaskAlt /></div>
        </div>
      </div>

      {error && (
        <div className="erp-card" style={{ marginBottom: '14px', padding: '14px 16px', color: '#b91c1c', border: '1px solid rgba(239, 68, 68, 0.26)' }}>
          {error}
        </div>
      )}

      <div className="erp-card" style={{ marginBottom: '14px', padding: '14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          {['All', 'New', 'Contacted', 'Closed'].map((status) => (
            <button
              key={status}
              type="button"
              className={`erp-btn ${statusFilter === status ? 'erp-btn-primary' : 'erp-btn-secondary'}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button type="button" className="erp-btn erp-btn-secondary" onClick={handleExportCsv} disabled={!totalItems}>
              <FileDownload /> Export CSV
            </button>
            <button type="button" className="erp-btn erp-btn-secondary" onClick={handleExportExcel} disabled={!totalItems}>
              <FileDownload /> Export Excel
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto auto', gap: '10px' }}>
          <input
            type="text"
            className="erp-input"
            placeholder="Search by name, phone, email, message"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <input
            type="date"
            className="erp-input"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
          <input
            type="date"
            className="erp-input"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
          <select
            className="erp-input"
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>{size} / page</option>
            ))}
          </select>
          <button
            type="button"
            className="erp-btn erp-btn-ghost"
            onClick={() => {
              setStatusFilter('All');
              setSearchQuery('');
              setFromDate('');
              setToDate('');
              setPageSize(10);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="erp-card erp-table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            Loading enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>
            No enquiries match current filters.
          </div>
        ) : (
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Requirement</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((item) => {
                  const isBusy = updatingId === item._id;
                  const canContact = item.status === 'New';
                  const canClose = item.status !== 'Closed';

                  return (
                    <tr key={item._id}>
                      <td data-label="Name" className="td-bold">{item.name}</td>
                      <td data-label="Phone" className="td-mono">{item.phone}</td>
                      <td data-label="Email">{item.email}</td>
                      <td data-label="Requirement" style={{ maxWidth: '320px' }}>
                        <span style={{ display: 'inline-block', color: '#475569' }}>
                          {item.message}
                        </span>
                      </td>
                      <td data-label="Date">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td data-label="Status">
                        <span className={`erp-badge ${statusToClass[item.status] || 'warning'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td data-label="Actions" className="td-actions">
                        <button
                          className="erp-btn erp-btn-ghost erp-action-btn erp-action-view"
                          type="button"
                          title="Mark as Contacted"
                          disabled={!canContact || isBusy}
                          onClick={() => updateStatus(item._id, 'Contacted')}
                        >
                          <MarkEmailRead />
                        </button>
                        <button
                          className="erp-btn erp-btn-ghost erp-action-btn erp-action-complete"
                          type="button"
                          title="Mark as Closed"
                          disabled={!canClose || isBusy}
                          onClick={() => updateStatus(item._id, 'Closed')}
                        >
                          <TaskAlt />
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

      {!loading && totalItems > 0 && (
        <div className="erp-card" style={{ marginTop: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ color: '#64748b', fontSize: '13px' }}>
            Showing {(currentPage - 1) * pageSize + 1}
            {' '}-{' '}
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="erp-btn erp-btn-ghost"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              Previous
            </button>
            <span style={{ color: '#475569', fontSize: '13px', minWidth: '90px', textAlign: 'center' }}>
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              className="erp-btn erp-btn-ghost"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;
