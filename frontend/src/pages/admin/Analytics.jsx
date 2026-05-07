// Analytics Page (Admin) — full-page analytics with filters
import { useState, useEffect } from 'react';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import DoughnutChart from '../../components/Charts/DoughnutChart';
import LineChart from '../../components/Charts/LineChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/common/StatCard';
import { useApi } from '../../hooks/useApi';

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [uniData, setUniData] = useState([]);
  const [perfData, setPerfData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [overviewRes, courseRes, uniRes, perfRes, skillsRes] =
        await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/course-distribution'),
          api.get('/analytics/university-comparison'),
          api.get('/analytics/performance-trends'),
          api.get('/analytics/skills'),
        ]);

      setOverview(overviewRes.data);
      setCourseData(courseRes.data);
      setUniData(uniRes.data);
      setPerfData(perfRes.data);
      setSkillsData(skillsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading analytics..." />;

  return (
    <div id="analytics-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Analytics</h1>
          <p className="page-subtitle">Comprehensive analysis of educational data</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="🎓" value={overview?.totalStudents || 0} label="Total Students" color="purple" />
        <StatCard icon="🏫" value={overview?.totalUniversities || 0} label="Universities" color="blue" />
        <StatCard icon="📊" value={overview?.avgMarks || 0} label="Average Marks" color="amber" />
        <StatCard icon="💼" value={`${overview?.placementRate || 0}%`} label="Placement Rate" color="green" />
        <StatCard icon="👥" value={overview?.totalUsers || 0} label="Registered Users" color="red" />
      </div>

      {/* Course & Skills */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">📚 Course-wise Distribution</h3>
          </div>
          <PieChart
            labels={courseData.map((d) => d.course)}
            values={courseData.map((d) => d.count)}
            height={350}
          />
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">🛠️ Top Skills</h3>
          </div>
          <BarChart
            labels={skillsData.map((d) => d.skill)}
            datasets={[
              {
                label: 'Students with Skill',
                data: skillsData.map((d) => d.count),
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
              },
            ]}
            height={350}
          />
        </div>
      </div>

      {/* University Comparison */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">🏫 University — Average Marks</h3>
          </div>
          <BarChart
            labels={uniData.map((d) =>
              d.universityName.length > 18 ? d.universityName.slice(0, 18) + '...' : d.universityName
            )}
            datasets={[
              {
                label: 'Average Marks',
                data: uniData.map((d) => d.avgMarks),
              },
            ]}
            height={320}
          />
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">💼 University — Placement Rate (%)</h3>
          </div>
          <BarChart
            labels={uniData.map((d) =>
              d.universityName.length > 18 ? d.universityName.slice(0, 18) + '...' : d.universityName
            )}
            datasets={[
              {
                label: 'Placement Rate (%)',
                data: uniData.map((d) => d.placementRate),
                backgroundColor: 'rgba(99, 102, 241, 0.7)',
              },
            ]}
            height={320}
          />
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="charts-grid">
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title">📈 Marks Distribution (Performance Buckets)</h3>
          </div>
          <LineChart
            labels={perfData.map((d) => d.range)}
            datasets={[
              {
                label: 'Number of Students',
                data: perfData.map((d) => d.count),
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
              },
            ]}
            height={300}
          />
        </div>
      </div>

      {/* Course-wise Average Marks Table */}
      <div className="chart-card" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="chart-card-header">
          <h3 className="chart-card-title">📋 Course-wise Average Marks</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Students</th>
                <th>Avg Marks</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {courseData.map((d) => (
                <tr key={d.course}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{d.course}</td>
                  <td>{d.count}</td>
                  <td>{d.avgMarks}</td>
                  <td>
                    <div style={{
                      width: '100%',
                      maxWidth: '200px',
                      height: '8px',
                      background: 'var(--bg-glass)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${d.avgMarks}%`,
                        height: '100%',
                        background: d.avgMarks >= 70 ? 'var(--accent-500)' :
                          d.avgMarks >= 50 ? 'var(--warning-500)' : 'var(--danger-500)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
