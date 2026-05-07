// Register Page — secure signup with password strength meter,
// real-time validation, show/hide password, honeypot, and input sanitization
import { useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Sanitize input — strip HTML/script tags
const sanitize = (str) => str.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').trim();

// Password strength calculator
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '', checks: {} };

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const levels = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Very Weak', color: '#ef4444' },
    { score: 2, label: 'Weak', color: '#f97316' },
    { score: 3, label: 'Fair', color: '#f59e0b' },
    { score: 4, label: 'Strong', color: '#10b981' },
    { score: 5, label: 'Very Strong', color: '#06b6d4' },
  ];

  return { score, label: levels[score].label, color: levels[score].color, checks };
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const honeypotRef = useRef(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field-specific error on change
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  // Real-time field validation
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case 'name':
        if (value && value.length < 2) errors.name = 'Name must be at least 2 characters';
        if (value && !/^[a-zA-Z\s.'-]+$/.test(value)) errors.name = 'Name can only contain letters, spaces, dots, hyphens';
        break;
      case 'email':
        if (value && !/^\S+@\S+\.\S+$/.test(value)) errors.email = 'Please enter a valid email';
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) errors.confirmPassword = 'Passwords do not match';
        break;
      default:
        break;
    }

    setFieldErrors((prev) => ({ ...prev, ...errors }));
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Honeypot check — if hidden field is filled, it's a bot
    if (honeypotRef.current && honeypotRef.current.value) {
      return; // Silently reject bots
    }

    // Sanitize inputs
    const cleanName = sanitize(formData.name);
    const cleanEmail = sanitize(formData.email).toLowerCase();

    // Validate name
    if (cleanName.length < 2 || cleanName.length > 50) {
      setError('Name must be 2-50 characters');
      return;
    }
    if (!/^[a-zA-Z\s.'-]+$/.test(cleanName)) {
      setError('Name can only contain letters, spaces, dots, hyphens, and apostrophes');
      return;
    }

    // Validate email
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password strength — all 5 checks must pass
    if (passwordStrength.score < 5) {
      setError('Password must contain: 8+ characters, uppercase, lowercase, number, and special character');
      return;
    }

    // Confirm password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Terms agreement
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: cleanName,
        email: cleanEmail,
        password: formData.password,
        role: formData.role,
      });

      if (result.success) {
        const dashboardPaths = {
          admin: '/admin/dashboard',
          university: '/university/dashboard',
          student: '/student/dashboard',
        };
        navigate(dashboardPaths[result.user.role] || '/');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch = formData.confirmPassword
    ? formData.password === formData.confirmPassword
    : null;

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">🎓</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join EduConnect Platform</p>
        </div>

        {/* Security badges */}
        <div className="security-badges" id="register-security-badges">
          <span className="security-badge">🔒 Encrypted</span>
          <span className="security-badge">🛡️ Protected</span>
          <span className="security-badge">✅ Secure</span>
        </div>

        {error && <div className="auth-error" id="register-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          {/* Honeypot field */}
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
            <label htmlFor="company_url_field_hp">Do not fill this</label>
            <input type="text" id="company_url_field_hp" name="company_url_field_hp" tabIndex="-1" ref={honeypotRef} autoComplete="nope" />
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">👤 Full Name</label>
            <input
              type="text"
              id="reg-name"
              name="name"
              className={`form-input ${fieldErrors.name ? 'form-input-error' : ''}`}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              minLength={2}
              maxLength={50}
              autoComplete="name"
            />
            {fieldErrors.name && <p className="form-error">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">📧 Email Address</label>
            <input
              type="email"
              id="reg-email"
              name="email"
              className={`form-input ${fieldErrors.email ? 'form-input-error' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              maxLength={100}
              autoComplete="email"
            />
            {fieldErrors.email && <p className="form-error">{fieldErrors.email}</p>}
          </div>

          {/* Role */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-role">🏷️ Role</label>
            <select
              id="reg-role"
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="university">University</option>
              <option value="admin">Admin (Government)</option>
            </select>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">🔑 Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="reg-password"
                name="password"
                className="form-input"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                id="reg-password-toggle"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Password strength meter */}
            {formData.password && (
              <div className="password-strength" id="password-strength-meter">
                <div className="password-strength-bar">
                  <div
                    className="password-strength-fill"
                    style={{
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
                <span className="password-strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}

            {/* Password requirements checklist */}
            {formData.password && (
              <div className="password-requirements" id="password-requirements">
                <div className={`pwd-req ${passwordStrength.checks.length ? 'met' : ''}`}>
                  {passwordStrength.checks.length ? '✅' : '❌'} At least 8 characters
                </div>
                <div className={`pwd-req ${passwordStrength.checks.uppercase ? 'met' : ''}`}>
                  {passwordStrength.checks.uppercase ? '✅' : '❌'} One uppercase letter
                </div>
                <div className={`pwd-req ${passwordStrength.checks.lowercase ? 'met' : ''}`}>
                  {passwordStrength.checks.lowercase ? '✅' : '❌'} One lowercase letter
                </div>
                <div className={`pwd-req ${passwordStrength.checks.number ? 'met' : ''}`}>
                  {passwordStrength.checks.number ? '✅' : '❌'} One number
                </div>
                <div className={`pwd-req ${passwordStrength.checks.special ? 'met' : ''}`}>
                  {passwordStrength.checks.special ? '✅' : '❌'} One special character (!@#$%...)
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm-password">🔑 Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="reg-confirm-password"
                name="confirmPassword"
                className={`form-input ${passwordMatch === false ? 'form-input-error' : passwordMatch === true ? 'form-input-success' : ''}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength={128}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                id="reg-confirm-password-toggle"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {passwordMatch === false && <p className="form-error">Passwords do not match</p>}
            {passwordMatch === true && <p className="form-success">✅ Passwords match</p>}
          </div>

          {/* Terms agreement */}
          <div className="form-group">
            <label className="terms-checkbox" id="terms-checkbox-label">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                id="terms-checkbox"
              />
              <span className="terms-text">
                I agree to the{' '}
                <Link to="/terms" target="_blank">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || passwordStrength.score < 5 || !agreedToTerms}
            id="register-submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }}></span>
                Creating Account...
              </>
            ) : (
              '🔐 Create Secure Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
