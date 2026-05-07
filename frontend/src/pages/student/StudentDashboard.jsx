// Student Dashboard — personal profile view
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const api = useApi();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      // Fetch student data (scoped to current user in backend)
      const res = await api.get('/students');
      if (res.data && res.data.length > 0) {
        setStudent(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your profile..." />;

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Calculate grade color
  const getGradeColor = (grade) => {
    if (!grade) return 'var(--text-tertiary)';
    if (grade.startsWith('A')) return 'var(--accent-400)';
    if (grade.startsWith('B')) return 'var(--primary-400)';
    if (grade.startsWith('C')) return 'var(--warning-400)';
    return 'var(--danger-400)';
  };

  return (
    <div id="student-dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your academic information and performance</p>
        </div>
      </div>

      {!student ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📋</div>
          <h3 style={{ marginBottom: '8px' }}>No Student Record Found</h3>
          <p style={{ color: 'var(--text-tertiary)' }}>
            Your university hasn't linked a student record to your account yet.
            Please contact your university administration.
          </p>
        </div>
      ) : (
        <>
          {/* Profile Card */}
          <div className="profile-card slide-up">
            <div className="profile-card-banner">
              <div className="profile-card-avatar">
                {getInitials(student.name)}
              </div>
            </div>
            <div className="profile-card-body">
              <h2 className="profile-card-name">{student.name}</h2>
              <p className="profile-card-email">{student.email}</p>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <div className="profile-info-label">Course</div>
                  <div className="profile-info-value">{student.course}</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">University</div>
                  <div className="profile-info-value">
                    {student.universityId?.name || 'N/A'}
                  </div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">Location</div>
                  <div className="profile-info-value">
                    {student.universityId?.location || 'N/A'}
                  </div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">Marks</div>
                  <div className="profile-info-value">
                    {student.marks}/100
                  </div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">Grade</div>
                  <div
                    className="profile-info-value"
                    style={{ color: getGradeColor(student.grade), fontSize: '1.25rem' }}
                  >
                    {student.grade}
                  </div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">Placement Status</div>
                  <div className="profile-info-value">
                    {student.isPlaced ? (
                      <span style={{ color: 'var(--accent-400)' }}>
                        ✓ Placed at {student.placementCompany || 'Company'}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--warning-400)' }}>Seeking Opportunities</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          {student.skills?.length > 0 && (
            <div className="glass-card slide-up" style={{ marginTop: 'var(--space-lg)' }}>
              <h3 style={{ marginBottom: 'var(--space-md)', fontWeight: 600 }}>🛠️ Skills</h3>
              <div className="skills-container">
                {student.skills.map((skill) => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Performance Visual */}
          <div className="glass-card slide-up" style={{ marginTop: 'var(--space-lg)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)', fontWeight: 600 }}>📊 Performance</h3>
            <div style={{ position: 'relative', height: '24px', background: 'var(--bg-glass)', borderRadius: '12px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${student.marks}%`,
                  background: student.marks >= 80 ? 'var(--gradient-accent)' :
                    student.marks >= 60 ? 'var(--gradient-primary)' :
                    student.marks >= 40 ? 'var(--gradient-warm)' : 'var(--gradient-danger)',
                  borderRadius: '12px',
                  transition: 'width 1s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                {student.marks}%
              </div>
            </div>
            <div className="flex justify-between" style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              <span>0</span>
              <span>Your position</span>
              <span>100</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
