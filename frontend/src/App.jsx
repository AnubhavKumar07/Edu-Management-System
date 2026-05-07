// App.jsx — main application with routing and auth
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import DashboardLayout from './components/Layout/DashboardLayout';
import PublicLayout from './components/Layout/PublicLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Public Pages
import AboutUs from './pages/public/AboutUs';
import ContactUs from './pages/public/ContactUs';
import OurWork from './pages/public/OurWork';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';
import ProjectFormat from './pages/public/ProjectFormat';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUniversities from './pages/admin/ManageUniversities';
import AdminManageStudents from './pages/admin/ManageStudents';
import Analytics from './pages/admin/Analytics';
import Announcements from './pages/admin/Announcements';

// University Pages
import UniversityDashboard from './pages/university/UniversityDashboard';
import UniversityManageStudents from './pages/university/ManageStudents';
import StudentList from './pages/university/StudentList';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';

// Redirect helper based on user role
const RoleRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/about" replace />;

  const dashboardPaths = {
    admin: '/admin/dashboard',
    university: '/university/dashboard',
    student: '/student/dashboard',
  };

  return <Navigate to={dashboardPaths[user.role] || '/login'} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public pages with shared layout (navbar + footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/project-format" element={<ProjectFormat />} />
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<RoleRedirect />} />

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/universities" element={<ManageUniversities />} />
          <Route path="/admin/students" element={<AdminManageStudents />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/announcements" element={<Announcements />} />
        </Route>

        {/* University Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['university']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/university/dashboard" element={<UniversityDashboard />} />
          <Route path="/university/students" element={<UniversityManageStudents />} />
          <Route path="/university/student-list" element={<StudentList />} />
        </Route>

        {/* Student Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
