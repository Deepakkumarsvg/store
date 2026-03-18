import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useNotification } from '../context/NotificationContext';
import '../css/login.css';

const LOGIN_BUILD = 'SF-LOGIN-20260312-2';

const Icons = {
  Factory: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16z" />
    </svg>
  ),
  Mail: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  ),
  Lock: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Eye: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  AlertCircle: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Package: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  BarChart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Google: () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
  Microsoft: () => (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <rect x="1" y="1" width="10" height="10" fill="#f25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7fba00" />
      <rect x="1" y="13" width="10" height="10" fill="#00a4ef" />
      <rect x="13" y="13" width="10" height="10" fill="#ffb900" />
    </svg>
  ),
};

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const notification = useNotification();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setError('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.email) {
      nextErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      notification.success('Logged in successfully.');
      navigate('/app');
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Invalid email or password.';
      setError(message);
      notification.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" data-login-build={LOGIN_BUILD}>
      <div className="login-left">
        <div className="login-grid" />
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />

        <div className="login-left-content">
          <div className="login-logo">
            <div className="login-logo-icon"><Icons.Factory /></div>
            <div>
              <div className="login-logo-text">StockForge</div>
              <span className="login-logo-sub">Manufacturing ERP</span>
            </div>
          </div>

          <h1 className="login-headline">
            Run your factory<br />
            <em>smarter, faster,</em><br />
            better.
          </h1>

          <p className="login-tagline">
            End-to-end visibility across procurement, production, inventory, and dispatch, all in one place.
          </p>
        </div>

        <div className="login-features">
          {[
            { icon: <Icons.Package />, title: 'Real-time Inventory', desc: 'Track raw materials and finished goods live' },
            { icon: <Icons.BarChart />, title: 'Profit and Reports', desc: 'Instant P and L with per-batch cost analysis' },
            { icon: <Icons.Shield />, title: 'Role-based Access', desc: 'Granular permissions for every team member' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="login-feature">
              <div className="login-feature-icon">{icon}</div>
              <div className="login-feature-text">
                <strong>{title}</strong>
                {desc}
              </div>
            </div>
          ))}
        </div>

        <div className="login-left-footer">Copyright 2026 StockForge. All rights reserved.</div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-mobile-logo">
            <div className="login-mobile-logo-icon"><Icons.Factory /></div>
            <span className="login-mobile-logo-text">StockForge</span>
          </div>

          <div className="login-welcome">
            <div className="login-welcome-eyebrow">Secure Sign-In</div>
            <h2 className="login-welcome-title">Welcome back</h2>
            <p className="login-welcome-sub">Sign in to your StockForge account to continue.</p>
            <div className="login-build-marker">Build {LOGIN_BUILD}</div>
          </div>

          {error && (
            <div className="login-alert error" style={{ marginBottom: '20px' }}>
              <Icons.AlertCircle />
              <span>{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label className="login-label" htmlFor="login-email">Email Address</label>
              <div className="login-input-wrap">
                <span className="login-input-icon"><Icons.Mail /></span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className={`login-input ${errors.email ? 'error' : ''}`}
                  placeholder="admin@stockforge.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {errors.email && <span className="login-error-msg">{errors.email}</span>}
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="login-password">
                Password
                <a href="/forgot-password" tabIndex={-1}>Forgot password?</a>
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon"><Icons.Lock /></span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`login-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  tabIndex={-1}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
              {errors.password && <span className="login-error-msg">{errors.password}</span>}
            </div>

            <label className="login-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Keep me signed in for 30 days
            </label>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? <><span className="login-spinner" /> Signing in...</> : <>Sign In <Icons.ArrowRight /></>}
            </button>

            <div className="login-divider">or continue with</div>

            <div className="login-sso">
              <button type="button" className="login-sso-btn"><Icons.Google /> Google</button>
              <button type="button" className="login-sso-btn"><Icons.Microsoft /> Microsoft</button>
            </div>
          </form>

          <p className="login-footer-text">
            Do not have an account? <a href="/register">Request access</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
