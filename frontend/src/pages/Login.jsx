// Login Page — secure login with rate limit feedback, lockout display,
// show/hide password, input sanitization, and honeypot bot trap
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Sanitize input — strip HTML/script tags
const sanitize = (str) => str.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').trim();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);
  const [lockout, setLockout] = useState(null); // { locked, minutes }
  const honeypotRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAttemptsRemaining(null);

    // Honeypot check — if hidden field is filled, it's a bot
    if (honeypotRef.current && honeypotRef.current.value) {
      return; // Silently reject bots
    }

    // Client-side validation
    const cleanEmail = sanitize(email).toLowerCase();
    const cleanPassword = password; // Don't strip chars from password

    if (!cleanEmail || !cleanPassword) {
      setError('Please provide email and password.');
      return;
    }

    // Basic email format check
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Check lockout state
    if (lockout && lockout.locked) {
      setError(`Account locked. Try again in ${lockout.minutes} minute(s).`);
      return;
    }

    setLoading(true);

    try {
      const result = await login(cleanEmail, cleanPassword);

      if (result.success) {
        setLockout(null);
        setAttemptsRemaining(null);
        const dashboardPaths = {
          admin: '/admin/dashboard',
          university: '/university/dashboard',
          student: '/student/dashboard',
        };
        navigate(dashboardPaths[result.user.role] || '/');
      } else {
        // Handle lockout from server
        if (result.lockout) {
          setLockout({ locked: true, minutes: result.remainingMinutes || 30 });
          setError(result.message);
        } else {
          if (result.attemptsRemaining !== undefined) {
            setAttemptsRemaining(result.attemptsRemaining);
          }
          setError(result.message || 'Login failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick login buttons for demo
  const demoLogins = [
    { label: 'Admin', email: 'admin@gov.in', password: 'Admin@123!', color: 'purple' },
    { label: 'University', email: 'indianinst@university.edu', password: 'University@123!', color: 'blue' },
    { label: 'Student', email: 'student1@student.edu', password: 'Student@123!', color: 'green' },
  ];

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">🎓</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to EduConnect</p>
        </div>

        {/* Security badges */}
        <div className="security-badges" id="login-security-badges">
          <span className="security-badge">🔒 Encrypted</span>
          <span className="security-badge">🛡️ Protected</span>
          <span className="security-badge">✅ Secure</span>
        </div>

        {/* Error display */}
        {error && (
          <div className={`auth-error ${lockout?.locked ? 'auth-error-lockout' : ''}`} id="login-error">
            {lockout?.locked && <span className="lockout-icon">🔐</span>}
            {error}
          </div>
        )}

        {/* Attempts remaining warning */}
        {attemptsRemaining !== null && attemptsRemaining <= 3 && !lockout?.locked && (
          <div className="auth-warning" id="login-attempts-warning">
            ⚠️ {attemptsRemaining} login attempt{attemptsRemaining !== 1 ? 's' : ''} remaining before lockout
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          {/* Honeypot field — hidden from users, bots fill it */}
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
            <label htmlFor="company_url_field_hp">Do not fill this</label>
            <input
              type="text"
              id="company_url_field_hp"
              name="company_url_field_hp"
              tabIndex="-1"
              ref={honeypotRef}
              autoComplete="nope"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              📧 Email Address
            </label>
            <input
              type="email"
              id="login-email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={100}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              🔑 Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={128}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                id="login-password-toggle"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || lockout?.locked}
            id="login-submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }}></span>
                Signing in...
              </>
            ) : lockout?.locked ? (
              '🔐 Account Locked'
            ) : (
              '🔓 Sign In Securely'
            )}
          </button>
        </form>

        {/* Demo quick login */}
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: '12px' }}>
            Quick Demo Login
          </p>
          <div className="flex gap-sm" style={{ justifyContent: 'center' }}>
            {demoLogins.map((demo) => (
              <button
                key={demo.label}
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setEmail(demo.email);
                  setPassword(demo.password);
                  setError('');
                  setLockout(null);
                  setAttemptsRemaining(null);
                }}
                type="button"
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
