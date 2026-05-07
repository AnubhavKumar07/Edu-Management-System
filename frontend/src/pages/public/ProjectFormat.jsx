// ProjectFormat — project documentation page showing tech stack, architecture, and features
const ProjectFormat = () => {
  const techStack = [
    {
      category: 'Frontend',
      icon: '🖥️',
      color: 'purple',
      technologies: [
        { name: 'React.js', version: '19.x', desc: 'Component-based UI library' },
        { name: 'Vite', version: '8.x', desc: 'Next-gen build tool & dev server' },
        { name: 'React Router', version: '7.x', desc: 'Client-side routing & navigation' },
        { name: 'Chart.js', version: '4.x', desc: 'Interactive data visualization' },
        { name: 'CSS3', version: 'Custom', desc: 'Premium dark theme design system' },
      ],
    },
    {
      category: 'Backend',
      icon: '⚙️',
      color: 'green',
      technologies: [
        { name: 'Node.js', version: '20.x', desc: 'JavaScript runtime environment' },
        { name: 'Express.js', version: '4.x', desc: 'Minimal web framework for APIs' },
        { name: 'JWT', version: '9.x', desc: 'JSON Web Token authentication' },
        { name: 'Bcrypt.js', version: '2.x', desc: 'Password hashing & encryption' },
        { name: 'Express Validator', version: '7.x', desc: 'Input validation & sanitization' },
      ],
    },
    {
      category: 'Database',
      icon: '🗄️',
      color: 'amber',
      technologies: [
        { name: 'MongoDB', version: '7.x', desc: 'NoSQL document database' },
        { name: 'Mongoose', version: '8.x', desc: 'MongoDB ODM for Node.js' },
        { name: 'MongoDB Atlas', version: 'Cloud', desc: 'Cloud-hosted database service' },
      ],
    },
    {
      category: 'Security',
      icon: '🔒',
      color: 'red',
      technologies: [
        { name: 'Helmet', version: '8.x', desc: 'HTTP security headers' },
        { name: 'Rate Limiter', version: '7.x', desc: 'Brute force attack prevention' },
        { name: 'Mongo Sanitize', version: '2.x', desc: 'NoSQL injection protection' },
        { name: 'HPP', version: '0.2', desc: 'HTTP parameter pollution prevention' },
        { name: 'CORS', version: '2.x', desc: 'Cross-origin resource sharing' },
      ],
    },
  ];

  const features = [
    { icon: '👥', title: 'Multi-Role Authentication', desc: 'Three-tier access: Government Admin, University, and Student roles with JWT-based secure login.' },
    { icon: '📊', title: 'Real-Time Analytics Dashboard', desc: 'Interactive charts showing course distribution, university comparison, performance trends, and placement data.' },
    { icon: '🏫', title: 'University Management', desc: 'CRUD operations for universities with admin controls to add, edit, and remove institutions.' },
    { icon: '🎓', title: 'Student Records Management', desc: 'Comprehensive student profiles with academic data, skills, marks, and placement status tracking.' },
    { icon: '📢', title: 'Announcement System', desc: 'Centralized communication with priority levels (high, medium, low) for broadcasting updates.' },
    { icon: '🔒', title: '7-Layer Security', desc: 'Helmet, rate limiting, account lockout, input validation, XSS prevention, NoSQL injection protection, and password strength enforcement.' },
    { icon: '📈', title: 'Data Visualization', desc: 'Bar charts, pie charts, and doughnut charts using Chart.js for visual analytics.' },
    { icon: '📱', title: 'Responsive Design', desc: 'Fully responsive dark-themed UI with glassmorphism effects, working on all device sizes.' },
  ];

  const apiEndpoints = [
    { method: 'POST', path: '/api/auth/register', desc: 'Register new user', auth: 'Public' },
    { method: 'POST', path: '/api/auth/login', desc: 'User login', auth: 'Public' },
    { method: 'GET', path: '/api/auth/me', desc: 'Get current user profile', auth: 'Protected' },
    { method: 'GET', path: '/api/students', desc: 'List all students', auth: 'Admin/University' },
    { method: 'POST', path: '/api/students', desc: 'Create new student', auth: 'University' },
    { method: 'PUT', path: '/api/students/:id', desc: 'Update student record', auth: 'University' },
    { method: 'DELETE', path: '/api/students/:id', desc: 'Delete student', auth: 'University' },
    { method: 'GET', path: '/api/universities', desc: 'List all universities', auth: 'Admin' },
    { method: 'GET', path: '/api/analytics/overview', desc: 'Dashboard overview stats', auth: 'Admin' },
    { method: 'GET', path: '/api/announcements', desc: 'Get announcements', auth: 'Protected' },
  ];

  const projectStructure = [
    { path: 'project/', type: 'root', label: 'Project Root' },
    { path: '├── backend/', type: 'dir', label: 'Node.js + Express API' },
    { path: '│   ├── config/', type: 'dir', label: 'Database configuration' },
    { path: '│   ├── controllers/', type: 'dir', label: 'Route handlers (auth, student, university, analytics)' },
    { path: '│   ├── middleware/', type: 'dir', label: 'Auth, rate limiter, validators, sanitizer, error handler' },
    { path: '│   ├── models/', type: 'dir', label: 'Mongoose schemas (User, Student, University, Announcement)' },
    { path: '│   ├── routes/', type: 'dir', label: 'API route definitions' },
    { path: '│   ├── utils/', type: 'dir', label: 'Seed data script' },
    { path: '│   └── server.js', type: 'file', label: 'Entry point with security middleware' },
    { path: '├── frontend/', type: 'dir', label: 'React + Vite SPA' },
    { path: '│   └── src/', type: 'dir', label: 'Source code' },
    { path: '│       ├── components/', type: 'dir', label: 'Layout (Navbar, Sidebar), Charts, Common' },
    { path: '│       ├── context/', type: 'dir', label: 'AuthContext (global auth state)' },
    { path: '│       ├── hooks/', type: 'dir', label: 'useApi (authenticated HTTP requests)' },
    { path: '│       ├── pages/', type: 'dir', label: 'Login, Register, Admin, University, Student, Public' },
    { path: '│       └── index.css', type: 'file', label: 'Complete design system (2000+ lines)' },
  ];

  const dbModels = [
    {
      name: 'User',
      fields: ['name', 'email', 'password (hashed)', 'role (admin/university/student)', 'universityId', 'timestamps'],
    },
    {
      name: 'Student',
      fields: ['name', 'email', 'course', 'marks', 'skills[]', 'universityId', 'isPlaced', 'placementCompany'],
    },
    {
      name: 'University',
      fields: ['name', 'location', 'userId', 'timestamps'],
    },
    {
      name: 'Announcement',
      fields: ['title', 'message', 'priority (high/medium/low)', 'createdBy', 'targetUniversities[]'],
    },
  ];

  return (
    <div className="public-page" id="project-format-page">
      {/* Hero */}
      <section className="public-hero">
        <div className="public-hero-content">
          <span className="public-hero-badge">Project Documentation</span>
          <h1 className="public-hero-title">
            EduConnect —
            <span className="gradient-text"> Project Format</span>
          </h1>
          <p className="public-hero-desc">
            A Centralized Student Data Management System built with the MERN Stack
            (MongoDB, Express.js, React.js, Node.js) for Government oversight of Indian universities.
          </p>
        </div>
      </section>

      {/* Project Overview */}
      <section className="public-section">
        <div className="public-section-inner">
          <h2 className="section-title text-center">Project Overview</h2>
          <p className="section-subtitle text-center">Key details about this project</p>
          <div className="pf-overview-grid" id="project-overview">
            <div className="glass-card pf-overview-card">
              <div className="pf-overview-label">Project Title</div>
              <div className="pf-overview-value">EduConnect — Centralized Student Data Management System</div>
            </div>
            <div className="glass-card pf-overview-card">
              <div className="pf-overview-label">Technology Stack</div>
              <div className="pf-overview-value">MERN Stack (MongoDB, Express.js, React.js, Node.js)</div>
            </div>
            <div className="glass-card pf-overview-card">
              <div className="pf-overview-label">Project Type</div>
              <div className="pf-overview-value">Full-Stack Web Application</div>
            </div>
            <div className="glass-card pf-overview-card">
              <div className="pf-overview-label">Architecture</div>
              <div className="pf-overview-value">REST API + Single Page Application (SPA)</div>
            </div>
            <div className="glass-card pf-overview-card">
              <div className="pf-overview-label">Authentication</div>
              <div className="pf-overview-value">JWT-based Role-Based Access Control (RBAC)</div>
            </div>
            <div className="glass-card pf-overview-card">
              <div className="pf-overview-label">Deployment</div>
              <div className="pf-overview-value">Vercel (Frontend) + Render (Backend) + MongoDB Atlas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="public-section alt-bg">
        <div className="public-section-inner">
          <h2 className="section-title text-center">Technology Stack</h2>
          <p className="section-subtitle text-center">All technologies used in this project</p>
          <div className="pf-tech-grid" id="tech-stack-grid">
            {techStack.map((cat, i) => (
              <div className={`glass-card pf-tech-card feature-${cat.color}`} key={i}>
                <div className="pf-tech-header">
                  <span className="pf-tech-icon">{cat.icon}</span>
                  <h3>{cat.category}</h3>
                </div>
                <div className="pf-tech-list">
                  {cat.technologies.map((tech, j) => (
                    <div className="pf-tech-item" key={j}>
                      <div className="pf-tech-name">
                        <strong>{tech.name}</strong>
                        <span className="pf-tech-version">{tech.version}</span>
                      </div>
                      <div className="pf-tech-desc">{tech.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="public-section">
        <div className="public-section-inner">
          <h2 className="section-title text-center">Key Features</h2>
          <p className="section-subtitle text-center">Core functionalities of the platform</p>
          <div className="features-grid" id="project-features">
            {features.map((feat, i) => (
              <div className="glass-card feature-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="feature-icon-wrap">
                  <span className="feature-icon">{feat.icon}</span>
                </div>
                <h4 className="feature-title">{feat.title}</h4>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Structure */}
      <section className="public-section alt-bg">
        <div className="public-section-inner">
          <h2 className="section-title text-center">Project Structure</h2>
          <p className="section-subtitle text-center">File and folder organization</p>
          <div className="glass-card pf-structure-card" id="project-structure">
            <div className="pf-structure-list">
              {projectStructure.map((item, i) => (
                <div className={`pf-structure-item pf-structure-${item.type}`} key={i}>
                  <code className="pf-structure-path">{item.path}</code>
                  <span className="pf-structure-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Database Models */}
      <section className="public-section">
        <div className="public-section-inner">
          <h2 className="section-title text-center">Database Schema</h2>
          <p className="section-subtitle text-center">MongoDB collections and their fields</p>
          <div className="pf-models-grid" id="db-models">
            {dbModels.map((model, i) => (
              <div className="glass-card pf-model-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <h4 className="pf-model-name">
                  <span className="pf-model-icon">📄</span>
                  {model.name}
                </h4>
                <div className="pf-model-fields">
                  {model.fields.map((field, j) => (
                    <span className="pf-model-field" key={j}>{field}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="public-section alt-bg">
        <div className="public-section-inner">
          <h2 className="section-title text-center">API Endpoints</h2>
          <p className="section-subtitle text-center">RESTful API routes documentation</p>
          <div className="glass-card pf-api-table-card" id="api-endpoints">
            <div className="pf-api-table">
              <div className="pf-api-header-row">
                <span>Method</span>
                <span>Endpoint</span>
                <span>Description</span>
                <span>Access</span>
              </div>
              {apiEndpoints.map((api, i) => (
                <div className="pf-api-row" key={i}>
                  <span className={`pf-api-method pf-method-${api.method.toLowerCase()}`}>
                    {api.method}
                  </span>
                  <code className="pf-api-path">{api.path}</code>
                  <span className="pf-api-desc">{api.desc}</span>
                  <span className={`badge ${api.auth === 'Public' ? 'badge-accent' : api.auth === 'Protected' ? 'badge-warning' : 'badge-primary'}`}>
                    {api.auth}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="public-section">
        <div className="public-section-inner">
          <h2 className="section-title text-center">User Roles & Permissions</h2>
          <p className="section-subtitle text-center">Role-based access control system</p>
          <div className="pf-roles-grid" id="user-roles">
            <div className="glass-card pf-role-card feature-purple">
              <div className="pf-role-icon">🏛️</div>
              <h4>Government Admin</h4>
              <ul className="pf-role-perms">
                <li>✅ View all universities & students</li>
                <li>✅ Real-time analytics dashboard</li>
                <li>✅ Manage universities (CRUD)</li>
                <li>✅ Create announcements</li>
                <li>✅ View placement statistics</li>
              </ul>
            </div>
            <div className="glass-card pf-role-card feature-blue">
              <div className="pf-role-icon">🏫</div>
              <h4>University</h4>
              <ul className="pf-role-perms">
                <li>✅ University dashboard</li>
                <li>✅ Manage own students (CRUD)</li>
                <li>✅ View student list & details</li>
                <li>✅ View announcements</li>
                <li>❌ Cannot access other universities</li>
              </ul>
            </div>
            <div className="glass-card pf-role-card feature-green">
              <div className="pf-role-icon">🎓</div>
              <h4>Student</h4>
              <ul className="pf-role-perms">
                <li>✅ View own profile</li>
                <li>✅ View academic details & marks</li>
                <li>✅ View placement status</li>
                <li>✅ View announcements</li>
                <li>❌ Cannot modify own records</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Login Credentials */}
      <section className="public-section alt-bg">
        <div className="public-section-inner">
          <h2 className="section-title text-center">Demo Login Credentials</h2>
          <p className="section-subtitle text-center">Use these to test different roles</p>
          <div className="pf-creds-grid" id="demo-credentials">
            <div className="glass-card pf-cred-card">
              <span className="pf-cred-role badge badge-primary">Admin</span>
              <div className="pf-cred-detail"><strong>Email:</strong> admin@gov.in</div>
              <div className="pf-cred-detail"><strong>Password:</strong> Admin@123!</div>
            </div>
            <div className="glass-card pf-cred-card">
              <span className="pf-cred-role badge badge-info">University</span>
              <div className="pf-cred-detail"><strong>Email:</strong> indianinst@university.edu</div>
              <div className="pf-cred-detail"><strong>Password:</strong> University@123!</div>
            </div>
            <div className="glass-card pf-cred-card">
              <span className="pf-cred-role badge badge-accent">Student</span>
              <div className="pf-cred-detail"><strong>Email:</strong> student1@student.edu</div>
              <div className="pf-cred-detail"><strong>Password:</strong> Student@123!</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectFormat;
