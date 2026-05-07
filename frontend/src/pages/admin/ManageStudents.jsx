// Manage Students (Admin) — view all students across universities
import { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApi } from '../../hooks/useApi';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', course: '', marks: '', skills: '', universityId: '', isPlaced: false, placementCompany: '',
  });
  const [formError, setFormError] = useState('');
  const [filterUni, setFilterUni] = useState('');
  const api = useApi();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, uniRes] = await Promise.all([
        api.get('/students?limit=500'),
        api.get('/universities'),
      ]);
      setStudents(studentsRes.data);
      setUniversities(uniRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = filterUni
    ? students.filter((s) => s.universityId?._id === filterUni)
    : students;

  const openCreateModal = () => {
    setEditingStudent(null);
    setFormData({
      name: '', email: '', course: '', marks: '', skills: '', universityId: '', isPlaced: false, placementCompany: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      marks: student.marks,
      skills: student.skills?.join(', ') || '',
      universityId: student.universityId?._id || '',
      isPlaced: student.isPlaced || false,
      placementCompany: student.placementCompany || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      ...formData,
      marks: Number(formData.marks),
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, payload);
      } else {
        await api.post('/students', payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.del(`/students/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'course', label: 'Course' },
    {
      key: 'marks',
      label: 'Marks',
      render: (val, row) => (
        <span>
          {val}{' '}
          <span className={`badge ${val >= 80 ? 'badge-accent' : val >= 60 ? 'badge-primary' : val >= 40 ? 'badge-warning' : 'badge-danger'}`}>
            {row.grade}
          </span>
        </span>
      ),
    },
    {
      key: 'universityId',
      label: 'University',
      render: (val) => val?.name || 'N/A',
    },
    {
      key: 'isPlaced',
      label: 'Placed',
      render: (val, row) => (
        <span className={`badge ${val ? 'badge-accent' : 'badge-warning'}`}>
          {val ? row.placementCompany || 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex gap-sm">
          <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(row)}>
            ✏️
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => handleDelete(row._id)}
            style={{ color: 'var(--danger-400)' }}
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div id="admin-manage-students-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Students</h1>
          <p className="page-subtitle">View and manage students across all universities</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal} id="admin-add-student-btn">
          + Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select
          className="form-select"
          value={filterUni}
          onChange={(e) => setFilterUni(e.target.value)}
          id="filter-university-select"
        >
          <option value="">All Universities</option>
          {universities.map((uni) => (
            <option key={uni._id} value={uni._id}>{uni.name}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredStudents}
        searchPlaceholder="Search students..."
        pageSize={15}
      />

      {/* Student Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingStudent ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        {formError && <div className="auth-error">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input type="text" className="form-input" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Course</label>
            <input type="text" className="form-input" value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Marks (0-100)</label>
            <input type="number" className="form-input" min="0" max="100" value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Skills (comma-separated)</label>
            <input type="text" className="form-input" placeholder="JavaScript, React, Node.js"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">University</label>
            <select className="form-select" value={formData.universityId}
              onChange={(e) => setFormData({ ...formData, universityId: e.target.value })} required>
              <option value="">Select University</option>
              {universities.map((uni) => (
                <option key={uni._id} value={uni._id}>{uni.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={formData.isPlaced}
                onChange={(e) => setFormData({ ...formData, isPlaced: e.target.checked })} />
              Placed
            </label>
          </div>
          {formData.isPlaced && (
            <div className="form-group">
              <label className="form-label">Placement Company</label>
              <input type="text" className="form-input" value={formData.placementCompany}
                onChange={(e) => setFormData({ ...formData, placementCompany: e.target.value })} />
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default ManageStudents;
