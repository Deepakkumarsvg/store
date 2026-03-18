/**
 * Layout.jsx  —  Root layout that wires Sidebar + mobile state
 * 
 * Import order:
 *   erp.css            → base design tokens
 *   erp-forms.css      → form / modal system
 *   erp-mobile.css     → page-level mobile overrides
 *   sidebar-mobile.css → sidebar-specific mobile (imported inside Sidebar.jsx)
 */

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../../css/erp.css';
import '../../css/forms.css';
import '../../css/erp-mobile.css';

// Map routes → human-readable page title shown in mobile top bar
const PAGE_TITLES = {
  '/':                        'Dashboard',
  '/purchase':                'Purchase',
  '/raw-material-stock':      'Raw Material Stock',
  '/production':              'Production',
  '/finished-goods':          'Finished Goods',
  '/sales':                   'Sales & Dispatch',
  '/reports':                 'Profit & Reports',
  '/master/products':         'Products',
  '/master/suppliers':        'Suppliers',
  '/master/customers':        'Customers',
  '/master/units':            'Units',
  '/app':                     'Dashboard',
  '/app/purchase':            'Purchase',
  '/app/raw-material-stock':  'Raw Material Stock',
  '/app/production':          'Production',
  '/app/finished-goods':      'Finished Goods',
  '/app/sales':               'Sales & Dispatch',
  '/app/reports':             'Profit & Reports',
  '/app/enquiries':           'Enquiries',
  '/app/master/products':     'Products',
  '/app/master/suppliers':    'Suppliers',
  '/app/master/customers':    'Customers',
  '/app/master/units':        'Units',
};

// SVG icons (no MUI needed in layout)
const MenuIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const BellIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const FactoryIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20a2 2 0 002 2h16a2 2 0 002-2V8l-7 5V8l-7 5V4a2 2 0 00-2-2H4a2 2 0 00-2 2v16z"/></svg>;

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);   // desktop: expanded / collapsed
  const [mobileOpen,  setMobileOpen]  = useState(false);  // mobile: drawer open / closed
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'StockForge';

  return (
    <div className="sf-app-shell">

      {/* ── Top Navbar ── */}
      <Navbar onMobileMenuClick={() => setMobileOpen(o => !o)} />

      {/* ── Sidebar ── */}
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Main content area ── */}
      <div className={`sf-content ${sidebarOpen ? 'sf-content-open' : 'sf-content-closed'}`} style={{ marginTop: '64px' }}>

        {/* Mobile top bar — hidden on desktop via sidebar-mobile.css */}
        <header className="sf-topbar">
          <div className="sf-topbar__logo">
            <div className="sf-topbar__logo-icon">
              <FactoryIcon />
            </div>
            <div>
              <span className="sf-topbar__title">{pageTitle}</span>
              <span className="sf-topbar__subtitle">Manufacturing ERP</span>
            </div>
          </div>

          <div className="sf-topbar__actions">
            <button className="sf-topbar__btn sf-topbar__btn--notify" title="Notifications">
              <BellIcon />
            </button>
            <button
              className={`sf-topbar__btn ${mobileOpen ? 'active' : ''}`}
              title="Menu"
              onClick={() => setMobileOpen(o => !o)}
            >
              <MenuIcon />
            </button>
          </div>
        </header>

        {/* Page content rendered by React Router */}
        <main>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;