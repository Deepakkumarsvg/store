import { useState } from 'react';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Box, Collapse, IconButton,
  Tooltip, Divider, Avatar,
} from '@mui/material';
import {
  Dashboard, Settings, ShoppingCart, Inventory, Factory,
  Warehouse, PointOfSale, Assessment, ExpandLess, ExpandMore,
  Category, People, Business, Menu, ChevronLeft,
  NotificationsNone, Circle,
  MailOutline,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/sidebar-mobile.css';

const drawerWidth       = 272;
const drawerClosedWidth = 72;

/**
 * Props:
 *   open          — boolean  sidebar expanded on desktop?
 *   onToggle      — () => void
 *   mobileOpen    — boolean  drawer visible on mobile?
 *   onMobileClose — () => void
 */
const Sidebar = ({ open, onToggle, mobileOpen, onMobileClose }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [masterOpen, setMasterOpen] = useState(false);

  const menuItems = [
    { title: 'Dashboard',          icon: <Dashboard />,    path: '/app' },
    {
      title: 'Master Setup', icon: <Settings />,
      subItems: [
        { title: 'Products',  icon: <Category />, path: '/app/master/products' },
        { title: 'Suppliers', icon: <Business />, path: '/app/master/suppliers' },
        { title: 'Customers', icon: <People />,   path: '/app/master/customers' },
        { title: 'Units',     icon: <Category />, path: '/app/master/units' },
      ],
    },
    { title: 'Purchase',           icon: <ShoppingCart />, path: '/app/purchase',            badge: 3 },
    { title: 'Raw Material Stock', icon: <Inventory />,    path: '/app/raw-material-stock' },
    { title: 'Production',         icon: <Factory />,      path: '/app/production' },
    { title: 'Finished Goods',     icon: <Warehouse />,    path: '/app/finished-goods' },
    { title: 'Sales & Dispatch',   icon: <PointOfSale />,  path: '/app/sales' },
    { title: 'Profit & Reports',   icon: <Assessment />,   path: '/app/reports' },
    { title: 'Enquiries',          icon: <MailOutline />,  path: '/app/enquiries' },
  ];

  const handleMenuClick = (item) => {
    if (item.subItems) { setMasterOpen(o => !o); return; }
    navigate(item.path);
    onMobileClose?.();
  };

  const isActive       = (path) => location.pathname === path;
  const isParentActive = (item) => item.subItems?.some(s => isActive(s.path));
  const showLabels     = open;   // on mobile drawer is always full-width so labels always show

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        .sf-sidebar * { box-sizing: border-box; }
        .sf-sidebar    { font-family: 'DM Sans', sans-serif; }

        .sf-logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 18px; letter-spacing: -0.5px;
          background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .sf-section-label {
          font-size: 10px; font-weight: 600; letter-spacing: 1.2px;
          text-transform: uppercase; color: #475569;
          padding: 0 12px; margin: 16px 0 6px;
        }

        .sf-nav-item {
          position: relative; border-radius: 10px !important;
          margin-bottom: 2px !important; padding: 9px 12px !important;
          transition: all 0.18s ease !important; min-height: unset !important;
        }
        .sf-nav-item:hover         { background: rgba(59,130,246,0.08) !important; }
        .sf-nav-item.active        { background: linear-gradient(135deg,#3b82f6,#2563eb) !important; box-shadow: 0 4px 14px rgba(59,130,246,0.4) !important; }
        .sf-nav-item.parent-active { background: rgba(59,130,246,0.1) !important; }

        .sf-nav-text { font-size: 13.5px !important; font-weight: 500 !important; color: #94a3b8; letter-spacing: 0.1px; transition: color 0.18s ease; }
        .sf-nav-item:hover .sf-nav-text        { color: #cbd5e1 !important; }
        .sf-nav-item.active .sf-nav-text       { color: #fff !important; font-weight: 600 !important; }
        .sf-nav-item.parent-active .sf-nav-text{ color: #3b82f6 !important; font-weight: 600 !important; }

        .sf-sub-item { border-radius: 8px !important; padding: 7px 12px 7px 16px !important; margin-bottom: 1px !important; transition: all 0.15s ease !important; min-height: unset !important; }
        .sf-sub-item:hover  { background: rgba(59,130,246,0.06) !important; }
        .sf-sub-item.active { background: rgba(59,130,246,0.15) !important; }

        .sf-sub-text { font-size: 13px !important; font-weight: 400 !important; color: #64748b !important; transition: color 0.15s ease; }
        .sf-sub-item:hover .sf-sub-text,
        .sf-sub-item.active .sf-sub-text { color: #3b82f6 !important; font-weight: 500 !important; }

        .sf-badge { background: linear-gradient(135deg,#f59e0b,#ef4444); color: white; font-size: 10px; font-weight: 700; border-radius: 10px; min-width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; padding: 0 5px; }

        .sf-active-indicator { position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: #60a5fa; border-radius: 0 3px 3px 0; opacity: 0; transition: opacity 0.18s ease; }
        .sf-nav-item.active  .sf-active-indicator { display: none; }
        .sf-sub-item.active  .sf-active-indicator { opacity: 1; }

        .sf-toggle-btn { width: 28px !important; height: 28px !important; background: rgba(51,65,85,0.8) !important; border-radius: 8px !important; color: #94a3b8 !important; transition: all 0.18s ease !important; border: 1px solid rgba(71,85,105,0.5) !important; }
        .sf-toggle-btn:hover { background: rgba(59,130,246,0.2) !important; color: #3b82f6 !important; border-color: rgba(59,130,246,0.3) !important; }

        .sf-footer-avatar { width: 32px !important; height: 32px !important; background: linear-gradient(135deg,#3b82f6,#8b5cf6) !important; font-size: 13px !important; font-weight: 600 !important; }
        .sf-status-dot    { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; border: 2px solid #0f172a; position: absolute; bottom: 0; right: 0; }
        .sf-divider       { border-color: rgba(51,65,85,0.6) !important; margin: 8px 0 !important; }

        .sf-list-scroll::-webkit-scrollbar       { width: 4px; }
        .sf-list-scroll::-webkit-scrollbar-track { background: transparent; }
        .sf-list-scroll::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        .sf-list-scroll:hover::-webkit-scrollbar-thumb { background: #334155; }

        /* Mobile close button */
        .sf-mob-close-btn {
          display: none;
          width: 32px; height: 32px; border-radius: 9px;
          background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25);
          color: #f87171; cursor: pointer; align-items: center; justify-content: center;
          font-size: 16px; line-height: 1; transition: all 0.17s ease;
          flex-shrink: 0;
        }
        .sf-mob-close-btn:hover { background: rgba(239,68,68,0.22); color: #ef4444; }

        @media (max-width: 767px) {
          .sf-mob-close-btn { display: flex; }
          .sf-toggle-btn    { display: none !important; }
        }
      `}</style>

      {/* Overlay — mobile only */}
      <div
        className={`sf-mob-overlay ${mobileOpen ? 'sf-mob-overlay--show' : ''}`}
        onClick={onMobileClose}
      />

      <Drawer
        className={`sf-sidebar ${mobileOpen ? 'sf-sidebar--open' : ''}`}
        variant="permanent"
        sx={{
          width: open ? drawerWidth : drawerClosedWidth,
          flexShrink: 0,
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          '@media (max-width: 767px)': { width: 0 },
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : drawerClosedWidth,
            boxSizing: 'border-box',
            bgcolor: '#0f172a',
            color: 'white',
            transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
            overflowX: 'hidden',
            borderRight: '1px solid rgba(30,41,59,0.8)',
            backgroundImage: 'radial-gradient(ellipse at top left,rgba(59,130,246,0.04) 0%,transparent 60%)',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Desktop toggle */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderBottom: '1px solid rgba(30,41,59,0.8)', minHeight: 64 }}>
          <IconButton className="sf-toggle-btn" size="small" onClick={onToggle}>
            {open ? <ChevronLeft sx={{ fontSize: 16 }} /> : <Menu sx={{ fontSize: 16 }} />}
          </IconButton>
          {/* Mobile close */}
          <button className="sf-mob-close-btn" onClick={onMobileClose}>✕</button>
        </Box>

        {/* Nav */}
        <Box className="sf-list-scroll" sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', px: showLabels ? 1.5 : 1, pt: 1 }}>
          {showLabels && <div className="sf-section-label">Main Menu</div>}

          <List disablePadding>
            {menuItems.map((item) => {
              const active       = isActive(item.path);
              const parentActive = isParentActive(item);
              return (
                <Box key={item.title}>
                  {!showLabels ? (
                    <Tooltip title={item.title} placement="right" arrow>
                      <ListItem disablePadding sx={{ mb: 0.5, display: 'flex', justifyContent: 'center' }}>
                        <ListItemButton onClick={() => handleMenuClick(item)} className={`sf-nav-item ${active ? 'active' : ''} ${parentActive ? 'parent-active' : ''}`} sx={{ justifyContent: 'center', px: 1, width: 48 }}>
                          <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                            <Box component="span" sx={{ color: active ? 'white' : parentActive ? '#3b82f6' : '#64748b', display: 'flex', fontSize: 20 }}>{item.icon}</Box>
                          </ListItemIcon>
                        </ListItemButton>
                      </ListItem>
                    </Tooltip>
                  ) : (
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton onClick={() => handleMenuClick(item)} className={`sf-nav-item ${active ? 'active' : ''} ${parentActive ? 'parent-active' : ''}`} sx={{ width: '100%' }}>
                        <div className="sf-active-indicator" />
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Box component="span" sx={{ color: active ? 'white' : parentActive ? '#3b82f6' : '#64748b', display: 'flex', fontSize: 20 }}>{item.icon}</Box>
                        </ListItemIcon>
                        <ListItemText primary={item.title} primaryTypographyProps={{ className: 'sf-nav-text' }} />
                        {item.badge && !active && <div className="sf-badge">{item.badge}</div>}
                        {item.subItems && (
                          <Box sx={{ color: parentActive ? '#3b82f6' : '#475569', display: 'flex', ml: 0.5 }}>
                            {masterOpen ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
                          </Box>
                        )}
                      </ListItemButton>
                    </ListItem>
                  )}

                  {item.subItems && showLabels && (
                    <Collapse in={masterOpen} timeout={200} unmountOnExit>
                      <Box sx={{ ml: 1.5, pl: 1.5, borderLeft: '1px solid rgba(51,65,85,0.7)', mb: 1, mt: 0.5 }}>
                        <List disablePadding>
                          {item.subItems.map((sub) => {
                            const subActive = isActive(sub.path);
                            return (
                              <ListItem key={sub.title} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton onClick={() => { navigate(sub.path); onMobileClose?.(); }} className={`sf-sub-item ${subActive ? 'active' : ''}`} sx={{ width: '100%' }}>
                                  <div className="sf-active-indicator" />
                                  <ListItemIcon sx={{ minWidth: 28 }}>
                                    <Box component="span" sx={{ color: subActive ? '#3b82f6' : '#475569', display: 'flex', fontSize: 16 }}>{sub.icon}</Box>
                                  </ListItemIcon>
                                  <ListItemText primary={sub.title} primaryTypographyProps={{ className: 'sf-sub-text' }} />
                                  {subActive && <Circle sx={{ fontSize: 6, color: '#3b82f6' }} />}
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Box>
                    </Collapse>
                  )}
                </Box>
              );
            })}
          </List>

          {showLabels && (
            <>
              <Divider className="sf-divider" sx={{ mt: 2 }} />
              <div className="sf-section-label" style={{ marginTop: 12 }}>System</div>
              <List disablePadding>
                {[
                  { title: 'Notifications', icon: <NotificationsNone />, badge: '2' },
                  { title: 'Settings',      icon: <Settings /> },
                ].map((item) => (
                  <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton className="sf-nav-item" sx={{ width: '100%' }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box component="span" sx={{ color: '#64748b', display: 'flex', fontSize: 20 }}>{item.icon}</Box>
                      </ListItemIcon>
                      <ListItemText primary={item.title} primaryTypographyProps={{ className: 'sf-nav-text' }} />
                      {item.badge && <div className="sf-badge">{item.badge}</div>}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ px: showLabels ? 2 : 1, py: 1.5, borderTop: '1px solid rgba(30,41,59,0.8)', display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: showLabels ? 'flex-start' : 'center' }}>
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar className="sf-footer-avatar">AK</Avatar>
            <div className="sf-status-dot" />
          </Box>
          {showLabels && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.3 }}>Admin Kumar</Typography>
              <Typography sx={{ fontSize: 11, color: '#475569', lineHeight: 1.3, mt: 0.2 }}>admin@stockforge.com</Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;