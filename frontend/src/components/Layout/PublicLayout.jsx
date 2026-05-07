// PublicLayout — shared layout for public pages (About, Contact, etc.)
import { Link, Outlet, useLocation } from 'react-router-dom';

const PublicLayout = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/our-work', label: 'Our Work' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/project-format', label: 'Project' },
    { path: '/privacy-policy', label: 'Policy' },
  ];

  return (
    <div className="public-layout" id="public-layout">
      {/* Public Navbar */}
      <nav className="public-navbar" id="public-navbar">
        <div className="public-navbar-inner">
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">🎓</div>
            <span>EduConnect</span>
          </Link>

          <div className="public-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`public-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                id={`nav-link-${link.path.replace('/', '')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="public-nav-actions">
            <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login-btn">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="public-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="public-footer" id="public-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-col">
              <div className="footer-brand">
                <div className="brand-icon">🎓</div>
                <span>EduConnect</span>
              </div>
              <p className="footer-desc">
                India's centralized student management platform. Connecting
                universities, students, and government for a smarter education ecosystem.
              </p>
              <div className="footer-socials">
                <a href="#" className="footer-social-link" aria-label="Twitter">𝕏</a>
                <a href="#" className="footer-social-link" aria-label="LinkedIn">in</a>
                <a href="#" className="footer-social-link" aria-label="GitHub">⌨</a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/our-work" className="footer-link">Our Work</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
              <Link to="/project-format" className="footer-link">Project Format</Link>
            </div>

            {/* Legal */}
            <div className="footer-col">
              <h4 className="footer-heading">Legal</h4>
              <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms of Service</Link>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4 className="footer-heading">Contact</h4>
              <p className="footer-contact-item">📧 support@educonnect.gov.in</p>
              <p className="footer-contact-item">📞 +91 11 2345 6789</p>
              <p className="footer-contact-item">📍 New Delhi, India</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} EduConnect — Ministry of Education, Government of India. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
