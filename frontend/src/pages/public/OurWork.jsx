// OurWork — public page showcasing platform features and initiatives
const OurWork = () => {
  const features = [
    { icon: '📊', title: 'Real-Time Analytics', desc: 'Live dashboards aggregating student data across thousands of universities.', color: 'purple' },
    { icon: '🏫', title: 'University Management', desc: 'Comprehensive tools to manage student records and generate reports.', color: 'blue' },
    { icon: '🎓', title: 'Student Profiles', desc: 'Standardized profiles with academic history, skills, and placement status.', color: 'green' },
    { icon: '🔒', title: 'Role-Based Access', desc: 'Multi-tier security for government, universities, and students.', color: 'amber' },
    { icon: '📢', title: 'Announcement System', desc: 'Centralized communication for broadcasting updates nationwide.', color: 'red' },
    { icon: '📈', title: 'Predictive Insights', desc: 'AI-powered forecasting for enrollment trends and at-risk students.', color: 'info' },
  ];

  const initiatives = [
    { title: 'Digital India Education Hub', desc: 'Partnering with Digital India to standardize institutional data.', status: 'Active' },
    { title: 'National Student Database', desc: 'Creating India\'s first unified student database.', status: 'Active' },
    { title: 'Skill Mapping Program', desc: 'Mapping student skills to industry requirements.', status: 'Pilot' },
    { title: 'Rural University Connect', desc: 'Extending the platform to rural and tier-3 institutions.', status: 'Upcoming' },
  ];

  return (
    <div className="public-page" id="our-work-page">
      <section className="public-hero">
        <div className="public-hero-content">
          <span className="public-hero-badge">Our Work</span>
          <h1 className="public-hero-title">Transforming Education<span className="gradient-text"> Through Technology</span></h1>
          <p className="public-hero-desc">Explore how EduConnect is revolutionizing India's education landscape.</p>
        </div>
      </section>

      <section className="public-section">
        <div className="public-section-inner">
          <h2 className="section-title text-center">Platform Capabilities</h2>
          <p className="section-subtitle text-center">Powerful tools for India's education ecosystem</p>
          <div className="features-grid" id="features-grid">
            {features.map((feat, i) => (
              <div className={`glass-card feature-card feature-${feat.color}`} key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon-wrap"><span className="feature-icon">{feat.icon}</span></div>
                <h4 className="feature-title">{feat.title}</h4>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section alt-bg">
        <div className="public-section-inner">
          <h2 className="section-title text-center">How It Works</h2>
          <p className="section-subtitle text-center">From data collection to actionable insights</p>
          <div className="how-it-works" id="how-it-works">
            <div className="hiw-step glass-card"><div className="hiw-number">01</div><h4>Universities Onboard</h4><p>Institutions connect their systems to EduConnect.</p></div>
            <div className="hiw-connector">→</div>
            <div className="hiw-step glass-card"><div className="hiw-number">02</div><h4>Data Flows In</h4><p>Student records sync in real-time securely.</p></div>
            <div className="hiw-connector">→</div>
            <div className="hiw-step glass-card"><div className="hiw-number">03</div><h4>Analytics & Insights</h4><p>Dashboards visualize trends and predictions.</p></div>
            <div className="hiw-connector">→</div>
            <div className="hiw-step glass-card"><div className="hiw-number">04</div><h4>Policy & Action</h4><p>Data-backed insights shape education policy.</p></div>
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-section-inner">
          <h2 className="section-title text-center">Active Initiatives</h2>
          <p className="section-subtitle text-center">Programs making real-world impact</p>
          <div className="initiatives-grid" id="initiatives-grid">
            {initiatives.map((init, i) => (
              <div className="glass-card initiative-card" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="initiative-header">
                  <h4 className="initiative-title">{init.title}</h4>
                  <span className={`badge ${init.status === 'Active' ? 'badge-accent' : init.status === 'Pilot' ? 'badge-warning' : 'badge-info'}`}>{init.status}</span>
                </div>
                <p className="initiative-desc">{init.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurWork;
