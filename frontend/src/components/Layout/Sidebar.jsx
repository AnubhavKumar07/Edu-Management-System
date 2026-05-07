// Sidebar — role-based navigation menu
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();

  // Menu items per role
  const menuItems = {
    admin: [
      { section: 'Overview', items: [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
      ]},
      { section: 'Management', items: [
        { path: '/admin/universities', icon: '🏫', label: 'Universities' },
        { path: '/admin/students', icon: '🎓', label: 'All Students' },
      ]},
      { section: 'Communication', items: [
        { path: '/admin/announcements', icon: '📢', label: 'Announcements' },
      ]},
    ],
    university: [
      { section: 'Overview', items: [
        { path: '/university/dashboard', icon: '📊', label: 'Dashboard' },
      ]},
      { section: 'Management', items: [
        { path: '/university/students', icon: '🎓', label: 'Manage Students' },
        { path: '/university/student-list', icon: '📋', label: 'Student List' },
      ]},
    ],
    student: [
      { section: 'Overview', items: [
        { path: '/student/dashboard', icon: '👤', label: 'My Profile' },
      ]},
    ],
  };

  const currentMenu = menuItems[user?.role] || [];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="main-sidebar">
      {currentMenu.map((section, sIdx) => (
        <div className="sidebar-section" key={sIdx}>
          <div className="sidebar-section-title">{section.section}</div>
          {section.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              id={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
