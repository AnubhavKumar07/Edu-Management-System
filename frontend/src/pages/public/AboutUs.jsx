// AboutUs — public about page
const AboutUs = () => {
  const teamMembers = [
    { name: 'Dr. Vivek Singh', role: 'Director General', emoji: '👩‍💼', desc: 'Leading education reform with 20+ years of policy experience.' },
    { name: 'Ayush Kumar Pandey', role: 'CTO', emoji: '👨‍💻', desc: 'Architecting scalable platforms for millions of students.' },
    { name: 'Ashok Mittal', role: 'Head of Analytics', emoji: '📊', desc: 'Transforming raw data into actionable educational insights.' },
    { name: 'Anubhav Kumar', role: 'Head of Operations', emoji: '⚙️', desc: 'Ensuring seamless onboarding of universities nationwide.' },
  ];

  const milestones = [
    { year: '2020', title: 'Platform Conceived', desc: 'Idea born during NEP 2020 discussions to centralize student data.' },
    { year: '2022', title: 'Pilot Launch', desc: 'First 50 universities onboarded across 5 states.' },
    { year: '2024', title: 'National Rollout', desc: 'Expanded to 500+ universities with real-time analytics.' },
    { year: '2026', title: 'Full Scale', desc: 'Serving 10,000+ universities and millions of students across India.' },
  ];

  return (
    <div className="public-page" id="about-us-page">
      {/* Hero Section */}
      <section className="public-hero">
        <div className="public-hero-content">
          <span className="public-hero-badge">About EduConnect</span>
          <h1 className="public-hero-title">
            Building India's Smartest
            <span className="gradient-text"> Education Infrastructure</span>
          </h1>
          <p className="public-hero-desc">
            EduConnect is India's most ambitious initiative to centralize, analyze, and
            optimize student data across every university in the country — empowering
            institutions, students, and policymakers alike.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="public-section">
        <div className="public-section-inner">
          <div className="mission-vision-grid">
            <div className="glass-card mission-card" id="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To create a unified, transparent, and intelligent platform that bridges
                the gap between educational institutions, government bodies, and students —
                ensuring every learner's potential is tracked, nurtured, and realized.
              </p>
            </div>
            <div className="glass-card mission-card" id="vision-card">
              <div className="mission-icon">🔭</div>
              <h3>Our Vision</h3>
              <p>
                A future where data-driven decisions transform Indian education — where
                every university has real-time insights, every student has visibility, and
                every policy is backed by evidence.
              </p>
            </div>
            <div className="glass-card mission-card" id="values-card">
              <div className="mission-icon">💎</div>
              <h3>Our Values</h3>
              <p>
                Transparency, inclusivity, and innovation guide everything we build.
                We believe technology should serve equity — giving equal opportunity
                and visibility to every student, regardless of geography.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="public-section alt-bg">
        <div className="public-section-inner">
          <h2 className="section-title text-center">Our Journey</h2>
          <p className="section-subtitle text-center">Key milestones that shaped EduConnect</p>
          <div className="timeline" id="about-timeline">
            {milestones.map((m, i) => (
              <div className="timeline-item" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="timeline-marker">
                  <span className="timeline-year">{m.year}</span>
                </div>
                <div className="timeline-content glass-card">
                  <h4>{m.title}</h4>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="public-section">
        <div className="public-section-inner">
          <h2 className="section-title text-center">Meet Our Team</h2>
          <p className="section-subtitle text-center">The people driving India's education revolution</p>
          <div className="team-grid" id="team-grid">
            {teamMembers.map((member, i) => (
              <div className="glass-card team-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="team-avatar">{member.emoji}</div>
                <h4 className="team-name">{member.name}</h4>
                <span className="team-role">{member.role}</span>
                <p className="team-desc">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="public-section alt-bg">
        <div className="public-section-inner">
          <div className="impact-stats-grid" id="impact-stats">
            <div className="impact-stat">
              <span className="impact-stat-value">100+</span>
              <span className="impact-stat-label">Universities</span>
            </div>
            <div className="impact-stat">
              <span className="impact-stat-value">1M+</span>
              <span className="impact-stat-label">Students Tracked</span>
            </div>
            <div className="impact-stat">
              <span className="impact-stat-value">28</span>
              <span className="impact-stat-label">States Covered</span>
            </div>
            <div className="impact-stat">
              <span className="impact-stat-value">99.9%</span>
              <span className="impact-stat-label">Uptime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
