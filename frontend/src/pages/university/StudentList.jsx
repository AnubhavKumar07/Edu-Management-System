// Student List (University) — read-only searchable/filterable list
import { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApi } from '../../hooks/useApi';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState('');
  const api = useApi();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students?limit=500');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique courses for filter
  const courses = [...new Set(students.map((s) => s.course))].sort();

  const filteredStudents = filterCourse
    ? students.filter((s) => s.course === filterCourse)
    : students;

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (val) => (
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{val}</span>
      ),
    },
    { key: 'email', label: 'Email' },
    {
      key: 'course',
      label: 'Course',
      render: (val) => <span className="badge badge-primary">{val}</span>,
    },
    {
      key: 'marks',
      label: 'Marks',
      render: (val, row) => (
        <div className="flex items-center gap-sm">
          <span>{val}/100</span>
          <span
            className={`badge ${val >= 80 ? 'badge-accent' : val >= 60 ? 'badge-primary' : val >= 40 ? 'badge-warning' : 'badge-danger'}`}
          >
            {row.grade}
          </span>
        </div>
      ),
    },
    {
      key: 'skills',
      label: 'Skills',
      render: (val) => (
        <div className="skills-container">
          {(val || []).slice(0, 2).map((s) => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
          {val?.length > 2 && (
            <span className="skill-tag" style={{ opacity: 0.6 }}>+{val.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      key: 'isPlaced',
      label: 'Status',
      render: (val, row) => (
        <span className={`badge ${val ? 'badge-accent' : 'badge-warning'}`}>
          {val ? `✓ ${row.placementCompany || 'Placed'}` : 'Seeking'}
        </span>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div id="student-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student List</h1>
          <p className="page-subtitle">Complete list of your university's students</p>
        </div>
      </div>

      {/* Course Filter */}
      <div className="filters-bar">
        <select
          className="form-select"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          id="filter-course-select"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
          Showing {filteredStudents.length} of {students.length} students
        </span>
      </div>

      <DataTable
        columns={columns}
        data={filteredStudents}
        searchPlaceholder="Search by name, email, or course..."
        pageSize={20}
      />
    </div>
  );
};

export default StudentList;
