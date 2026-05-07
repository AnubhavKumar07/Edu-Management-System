// Manage Students (University) — add/edit/delete own students + CSV upload
import { useState, useEffect, useRef } from 'react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApi } from '../../hooks/useApi';

const UniversityManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', course: '', marks: '', skills: '', isPlaced: false, placementCompany: '',
  });
  const [formError, setFormError] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);
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

  const openCreateModal = () => {
    setEditingStudent(null);
    setFormData({ name: '', email: '', course: '', marks: '', skills: '', isPlaced: false, placementCompany: '' });
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
      fetchStudents();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.del(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCSVUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      setUploadStatus({ error: 'Please select a CSV file' });
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await api.post('/students/bulk-upload', formDataUpload);
      setUploadStatus({
        success: `${res.data.uploaded} students uploaded successfully!`,
        failed: res.data.failed > 0 ? `${res.data.failed} failed` : null,
      });
      fetchStudents();
    } catch (err) {
      setUploadStatus({ error: err.message });
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'course', label: 'Course' },
    {
      key: 'marks', label: 'Marks',
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
      key: 'skills', label: 'Skills',
      render: (val) => (
        <div className="skills-container">
          {(val || []).slice(0, 3).map((s) => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
          {val?.length > 3 && (
            <span className="skill-tag" style={{ opacity: 0.6 }}>+{val.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: 'isPlaced', label: 'Placed',
      render: (val, row) => (
        <span className={`badge ${val ? 'badge-accent' : 'badge-warning'}`}>
          {val ? row.placementCompany || 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div className="flex gap-sm">
          <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(row)}>✏️</button>
          <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(row._id)} style={{ color: 'var(--danger-400)' }}>🗑️</button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div id="university-manage-students-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Students</h1>
          <p className="page-subtitle">Add, edit, and manage your university's students</p>
        </div>
        <div className="flex gap-md">
          <button className="btn btn-ghost" onClick={() => { setUploadModalOpen(true); setUploadStatus(null); }}
            id="bulk-upload-btn">
            📄 Bulk Upload (CSV)
          </button>
          <button className="btn btn-primary" onClick={openCreateModal} id="uni-add-student-btn">
            + Add Student
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={students}
        searchPlaceholder="Search students..."
        pageSize={15}
      />

      {/* Student Form Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
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
            <input type="text" className="form-input" placeholder="Python, ML, Data Analysis"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
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

      {/* CSV Upload Modal */}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)}
        title="Bulk Upload Students (CSV)"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setUploadModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCSVUpload}>Upload</button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>
          Upload a CSV file with columns: <strong>name, email, course, marks, skills, isPlaced, placementCompany</strong>
        </p>
        <div className="form-group">
          <input type="file" accept=".csv" ref={fileInputRef} className="form-input"
            style={{ padding: '10px' }} />
        </div>
        {uploadStatus?.success && (
          <div style={{ color: 'var(--accent-400)', marginTop: '8px' }}>✅ {uploadStatus.success}</div>
        )}
        {uploadStatus?.failed && (
          <div style={{ color: 'var(--warning-400)', marginTop: '4px' }}>⚠️ {uploadStatus.failed}</div>
        )}
        {uploadStatus?.error && (
          <div style={{ color: 'var(--danger-400)', marginTop: '8px' }}>❌ {uploadStatus.error}</div>
        )}
      </Modal>
    </div>
  );
};

export default UniversityManageStudents;
