// Navbar — top navigation bar with user info and logout
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="flex items-center gap-md">
        <button
          className="btn btn-icon btn-ghost sidebar-toggle"
          onClick={onToggleSidebar}
          style={{ display: 'none' }}
          id="sidebar-toggle-btn"
        >
          ☰
        </button>
        <a href="/" className="navbar-brand">
          <div className="brand-icon">🎓</div>
          <span>EduConnect</span>
        </a>
      </div>

      <div className="navbar-actions">
        <div className="navbar-user" onClick={handleLogout} title="Click to logout" id="navbar-user-menu">
          <div className="navbar-user-avatar">
            {getInitials(user?.name)}
          </div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">{user?.name || 'User'}</span>
            <span className="navbar-user-role">{user?.role || 'guest'}</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>⏻</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
