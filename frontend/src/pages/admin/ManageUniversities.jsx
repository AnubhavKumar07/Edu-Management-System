// Manage Universities — CRUD for university records (admin)
import { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApi } from '../../hooks/useApi';

const ManageUniversities = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUni, setEditingUni] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [formError, setFormError] = useState('');
  const api = useApi();

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const res = await api.get('/universities');
      setUniversities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUni(null);
    setFormData({ name: '', location: '' });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (uni) => {
    setEditingUni(uni);
    setFormData({ name: uni.name, location: uni.location });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.location) {
      setFormError('All fields are required');
      return;
    }

    try {
      if (editingUni) {
        await api.put(`/universities/${editingUni._id}`, formData);
      } else {
        await api.post('/universities', formData);
      }
      setModalOpen(false);
      fetchUniversities();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this university?')) return;
    try {
      await api.del(`/universities/${id}`);
      fetchUniversities();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    { key: 'name', label: 'University Name' },
    { key: 'location', label: 'Location' },
    {
      key: 'studentCount',
      label: 'Students',
      render: (val) => (
        <span className="badge badge-primary">{val || 0}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Added',
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex gap-sm">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => openEditModal(row)}
          >
            ✏️ Edit
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => handleDelete(row._id)}
            style={{ color: 'var(--danger-400)' }}
          >
            🗑️ Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div id="manage-universities-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Universities</h1>
          <p className="page-subtitle">Add, edit, and manage registered universities</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openCreateModal}
          id="add-university-btn"
        >
          + Add University
        </button>
      </div>

      <DataTable
        columns={columns}
        data={universities}
        title="All Universities"
        searchPlaceholder="Search universities..."
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUni ? 'Edit University' : 'Add New University'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} id="save-university-btn">
              {editingUni ? 'Update' : 'Create'} University
            </button>
          </>
        }
      >
        {formError && <div className="auth-error">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="uni-name">University Name</label>
            <input
              type="text"
              id="uni-name"
              className="form-input"
              placeholder="e.g., Indian Institute of Technology"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="uni-location">Location</label>
            <input
              type="text"
              id="uni-location"
              className="form-input"
              placeholder="e.g., New Delhi"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageUniversities;
