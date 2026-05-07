// Announcements Page (Admin) — create and view announcements
import { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApi } from '../../hooks/useApi';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', message: '', priority: 'medium', targetUniversities: [],
  });
  const [formError, setFormError] = useState('');
  const api = useApi();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [annRes, uniRes] = await Promise.all([
        api.get('/announcements'),
        api.get('/universities'),
      ]);
      setAnnouncements(annRes.data);
      setUniversities(uniRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.message) {
      setFormError('Title and message are required');
      return;
    }

    try {
      await api.post('/announcements', formData);
      setModalOpen(false);
      setFormData({ title: '', message: '', priority: 'medium', targetUniversities: [] });
      fetchData();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.del(`/announcements/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div id="announcements-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">Broadcast messages to universities</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setModalOpen(true)}
          id="create-announcement-btn"
        >
          + New Announcement
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📢</div>
          <h3 className="empty-state-title">No Announcements Yet</h3>
          <p className="empty-state-text">Create your first announcement to notify universities</p>
        </div>
      ) : (
        announcements.map((a) => (
          <div key={a._id} className={`announcement-card ${a.priority}`}>
            <div className="announcement-header">
              <div>
                <h4 className="announcement-title">{a.title}</h4>
                <div className="flex gap-sm items-center" style={{ marginTop: '4px' }}>
                  <span className={`badge badge-${a.priority === 'high' ? 'danger' : a.priority === 'medium' ? 'warning' : 'accent'}`}>
                    {a.priority}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    by {a.createdBy?.name || 'Admin'}
                  </span>
                  {a.targetUniversities?.length > 0 && (
                    <span className="badge badge-info">
                      {a.targetUniversities.length} target{a.targetUniversities.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {(!a.targetUniversities || a.targetUniversities.length === 0) && (
                    <span className="badge badge-primary">Broadcast</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <span className="announcement-date">
                  {new Date(a.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </span>
                <button
                  className="btn btn-icon btn-ghost"
                  onClick={() => handleDelete(a._id)}
                  style={{ color: 'var(--danger-400)' }}
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className="announcement-message">{a.message}</p>
            {a.targetUniversities?.length > 0 && (
              <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {a.targetUniversities.map((uni) => (
                  <span key={uni._id} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                    {uni.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      {/* Create Announcement Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Announcement"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Publish</button>
          </>
        }
      >
        {formError && <div className="auth-error">{formError}</div>}
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" placeholder="Announcement title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-textarea" placeholder="Type your message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Target (empty = broadcast to all)</label>
            <select className="form-select" multiple style={{ minHeight: '100px' }}
              value={formData.targetUniversities}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (o) => o.value);
                setFormData({ ...formData, targetUniversities: selected });
              }}>
              {universities.map((uni) => (
                <option key={uni._id} value={uni._id}>{uni.name}</option>
              ))}
            </select>
            <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
              Hold Ctrl/Cmd to select multiple. Leave empty for broadcast.
            </small>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Announcements;
