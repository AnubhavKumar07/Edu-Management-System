// University Dashboard — overview of own students and stats
import { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import PieChart from '../../components/Charts/PieChart';
import BarChart from '../../components/Charts/BarChart';
import DoughnutChart from '../../components/Charts/DoughnutChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';

const UniversityDashboard = () => {
  const [students, setStudents] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [perfData, setPerfData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, courseRes, perfRes, skillsRes, annRes] = await Promise.all([
        api.get('/students?limit=500'),
        api.get('/analytics/course-distribution'),
        api.get('/analytics/performance-trends'),
        api.get('/analytics/skills'),
        api.get('/announcements'),
      ]);

      setStudents(studentsRes.data);
      setCourseData(courseRes.data);
      setPerfData(perfRes.data);
      setSkillsData(skillsRes.data);
      setAnnouncements(annRes.data.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  // Compute stats from student data
  const totalStudents = students.length;
  const avgMarks = totalStudents > 0
    ? Math.round(students.reduce((sum, s) => sum + s.marks, 0) / totalStudents * 100) / 100
    : 0;
  const placedCount = students.filter((s) => s.isPlaced).length;
  const placementRate = totalStudents > 0
    ? Math.round((placedCount / totalStudents) * 100 * 100) / 100
    : 0;

  return (
    <div id="university-dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">University Dashboard</h1>
          <p className="page-subtitle">Overview of your students and performance data</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="🎓" value={totalStudents} label="Total Students" color="purple" />
        <StatCard icon="📊" value={avgMarks} label="Average Marks" color="amber" />
        <StatCard icon="💼" value={placedCount} label="Students Placed" color="green" />
        <StatCard icon="📈" value={`${placementRate}%`} label="Placement Rate" color="blue" />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">📚 Course Distribution</h3>
          </div>
          {courseData.length > 0 ? (
            <PieChart
              labels={courseData.map((d) => d.course)}
              values={courseData.map((d) => d.count)}
              height={320}
            />
          ) : (
            <div className="empty-state"><p className="empty-state-text">No data</p></div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">📊 Performance Distribution</h3>
          </div>
          {perfData.length > 0 ? (
            <BarChart
              labels={perfData.map((d) => d.range)}
              datasets={[{
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
              }]}
              height={320}
            />
          ) : (
            <div className="empty-state"><p className="empty-state-text">No data</p></div>
          )}
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">🛠️ Top Skills</h3>
          </div>
          {skillsData.length > 0 ? (
            <BarChart
              labels={skillsData.slice(0, 8).map((d) => d.skill)}
              datasets={[{
                label: 'Students',
                data: skillsData.slice(0, 8).map((d) => d.count),
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
              }]}
              height={280}
            />
          ) : (
            <div className="empty-state"><p className="empty-state-text">No data</p></div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">💼 Placement Status</h3>
          </div>
          <DoughnutChart
            labels={['Placed', 'Not Placed']}
            values={[placedCount, totalStudents - placedCount]}
            height={280}
            centerText={{ value: `${placementRate}%`, label: 'Placed' }}
          />
        </div>
      </div>

      {/* Announcements from Admin */}
      {announcements.length > 0 && (
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)', fontWeight: 600 }}>
            📢 Latest Announcements from Government
          </h3>
          {announcements.map((a) => (
            <div key={a._id} className={`announcement-card ${a.priority}`}>
              <div className="announcement-header">
                <h4 className="announcement-title">{a.title}</h4>
                <span className="announcement-date">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="announcement-message">{a.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversityDashboard;
