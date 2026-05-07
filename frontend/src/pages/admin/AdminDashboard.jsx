// Admin Dashboard — overview stats, charts, and recent activity
import { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import DoughnutChart from '../../components/Charts/DoughnutChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApi } from '../../hooks/useApi';

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [uniData, setUniData] = useState([]);
  const [perfData, setPerfData] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, courseRes, uniRes, perfRes, announcementRes] =
        await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/course-distribution'),
          api.get('/analytics/university-comparison'),
          api.get('/analytics/performance-trends'),
          api.get('/announcements'),
        ]);

      setOverview(overviewRes.data);
      setCourseData(courseRes.data);
      setUniData(uniRes.data);
      setPerfData(perfRes.data);
      setAnnouncements(announcementRes.data.slice(0, 3));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div id="admin-dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Government Dashboard</h1>
          <p className="page-subtitle">
            Overview of student data across all universities
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon="🎓"
          value={overview?.totalStudents || 0}
          label="Total Students"
          color="purple"
        />
        <StatCard
          icon="🏫"
          value={overview?.totalUniversities || 0}
          label="Universities"
          color="blue"
        />
        <StatCard
          icon="📊"
          value={overview?.avgMarks || 0}
          label="Average Marks"
          color="amber"
        />
        <StatCard
          icon="💼"
          value={`${overview?.placementRate || 0}%`}
          label="Placement Rate"
          color="green"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Course Distribution</h3>
          </div>
          {courseData.length > 0 ? (
            <PieChart
              labels={courseData.map((d) => d.course)}
              values={courseData.map((d) => d.count)}
              height={320}
            />
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">No course data available</p>
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">University Comparison</h3>
          </div>
          {uniData.length > 0 ? (
            <BarChart
              labels={uniData.map((d) =>
                d.universityName.length > 20
                  ? d.universityName.slice(0, 20) + '...'
                  : d.universityName
              )}
              datasets={[
                {
                  label: 'Average Marks',
                  data: uniData.map((d) => d.avgMarks),
                },
              ]}
              height={320}
            />
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">No university data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Performance Distribution</h3>
          </div>
          {perfData.length > 0 ? (
            <BarChart
              labels={perfData.map((d) => d.range)}
              datasets={[
                {
                  label: 'Students',
                  data: perfData.map((d) => d.count),
                  backgroundColor: [
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(234, 179, 8, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(168, 85, 247, 0.7)',
                  ],
                },
              ]}
              height={280}
            />
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">No performance data available</p>
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Placement by University</h3>
          </div>
          {uniData.length > 0 ? (
            <DoughnutChart
              labels={uniData.map((d) =>
                d.universityName.length > 15
                  ? d.universityName.slice(0, 15) + '...'
                  : d.universityName
              )}
              values={uniData.map((d) => d.placedCount)}
              height={320}
              centerText={{
                value: overview?.placedCount || 0,
                label: 'Total Placed',
              }}
            />
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">No placement data</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Announcements */}
      {announcements.length > 0 && (
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)', fontWeight: 600 }}>
            Recent Announcements
          </h3>
          {announcements.map((a) => (
            <div
              key={a._id}
              className={`announcement-card ${a.priority}`}
            >
              <div className="announcement-header">
                <h4 className="announcement-title">{a.title}</h4>
                <span className="announcement-date">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="announcement-message">{a.message}</p>
              <div style={{ marginTop: '8px' }}>
                <span className={`badge badge-${a.priority === 'high' ? 'danger' : a.priority === 'medium' ? 'warning' : 'accent'}`}>
                  {a.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
