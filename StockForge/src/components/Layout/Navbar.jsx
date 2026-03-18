import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Search, Notifications, AccountCircle, Settings, Logout, Menu } from '@mui/icons-material';
import '../../css/navbar.css';

const Navbar = ({ onMobileMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, text: 'New purchase order PO-2024-003 created', time: '5 min ago', unread: true },
    { id: 2, text: 'Production job JOB-2024-025 completed', time: '1 hour ago', unread: true },
    { id: 3, text: 'Low stock alert: Steel Sheet', time: '2 hours ago', unread: false },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Mobile Menu Button */}
        <button className="navbar-mobile-menu" onClick={onMobileMenuClick}>
          <Menu />
        </button>

        {/* Logo Section */}
        <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="navbar-logo-icon">
            <img src="/logo.svg" alt="Classic Logo" />
          </div>
          <div className="navbar-logo-text">
            <span className="navbar-brand">Classic गृह उद्योग</span>
            <span className="navbar-tagline">Homemade • Pure • Traditional</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <Search className="navbar-search-icon" />
          <input 
            type="text" 
            placeholder="Search orders, inventory, customers..." 
            className="navbar-search-input"
          />
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Notifications */}
          <div className="navbar-dropdown">
            <button 
              className="navbar-btn navbar-btn-notify"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Notifications />
              <span className="navbar-badge">3</span>
            </button>
            
            {showNotifications && (
              <>
                <div className="navbar-overlay" onClick={() => setShowNotifications(false)}></div>
                <div className="navbar-dropdown-menu navbar-notifications">
                  <div className="navbar-dropdown-header">
                    <h3>Notifications</h3>
                    <button className="navbar-link">Mark all as read</button>
                  </div>
                  <div className="navbar-notifications-list">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`navbar-notification-item ${notif.unread ? 'unread' : ''}`}>
                        <div className="navbar-notification-text">{notif.text}</div>
                        <div className="navbar-notification-time">{notif.time}</div>
                      </div>
                    ))}
                  </div>
                  <div className="navbar-dropdown-footer">
                    <button className="navbar-link">View all notifications</button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="navbar-dropdown">
            <button 
              className="navbar-user"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <AccountCircle className="navbar-user-icon" />
              <div className="navbar-user-info">
                <span className="navbar-user-name">{user?.name || 'User'}</span>
                <span className="navbar-user-role">{user?.role || 'User'}</span>
              </div>
            </button>

            {showUserMenu && (
              <>
                <div className="navbar-overlay" onClick={() => setShowUserMenu(false)}></div>
                <div className="navbar-dropdown-menu navbar-user-menu">
                  <div className="navbar-user-profile">
                    <AccountCircle style={{ fontSize: 48, color: '#64748b' }} />
                    <div>
                      <div className="navbar-user-name">{user?.name || 'User'}</div>
                      <div className="navbar-user-email">{user?.email || ''}</div>
                    </div>
                  </div>
                  <div className="navbar-menu-divider"></div>
                  <button className="navbar-menu-item">
                    <AccountCircle />
                    <span>My Profile</span>
                  </button>
                  <button className="navbar-menu-item">
                    <Settings />
                    <span>Settings</span>
                  </button>
                  <div className="navbar-menu-divider"></div>
                  <button className="navbar-menu-item navbar-menu-item-danger" onClick={handleLogout}>
                    <Logout />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
