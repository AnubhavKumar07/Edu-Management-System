// TermsOfService — public terms page
const TermsOfService = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using the EduConnect platform, you agree to be bound by these Terms of Service. If you do not agree, you must discontinue use immediately. These terms apply to all users including government administrators, university officials, and students.`
    },
    {
      title: '2. User Accounts',
      content: `Each user is responsible for maintaining the confidentiality of their login credentials. University accounts are created through an official onboarding process. Student accounts are provisioned by their respective universities. Sharing account credentials is strictly prohibited.`
    },
    {
      title: '3. Acceptable Use',
      content: `Users must use the platform solely for educational data management purposes. Prohibited activities include: unauthorized data scraping, attempting to access other users' data, uploading malicious content, using the platform for commercial purposes, and any activity that violates Indian law.`
    },
    {
      title: '4. Data Accuracy',
      content: `Universities are responsible for the accuracy and completeness of student data entered. The government reserves the right to audit data for compliance. Intentional submission of false data may result in account suspension and legal action under applicable laws.`
    },
    {
      title: '5. Intellectual Property',
      content: `The EduConnect platform, its design, code, and content are owned by the Ministry of Education, Government of India. Users may not reproduce, distribute, or create derivative works from platform materials without explicit authorization.`
    },
    {
      title: '6. Service Availability',
      content: `We strive for 99.9% uptime but do not guarantee uninterrupted access. Scheduled maintenance windows are communicated in advance. We are not liable for data loss due to force majeure events or circumstances beyond our control.`
    },
    {
      title: '7. Termination',
      content: `We may suspend or terminate accounts that violate these terms. Universities may be offboarded if they fail to maintain data quality standards. Users may request account deletion, subject to data retention policies outlined in the Privacy Policy.`
    },
    {
      title: '8. Governing Law',
      content: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi. These terms constitute the entire agreement between users and EduConnect regarding platform usage.`
    },
  ];

  return (
    <div className="public-page" id="terms-page">
      <section className="public-hero public-hero-compact">
        <div className="public-hero-content">
          <span className="public-hero-badge">Legal</span>
          <h1 className="public-hero-title">Terms of <span className="gradient-text">Service</span></h1>
          <p className="public-hero-desc">Rules and guidelines for using the EduConnect platform.</p>
          <p className="policy-date">Last updated: May 1, 2026</p>
        </div>
      </section>

      <section className="public-section">
        <div className="public-section-inner policy-content" id="terms-content">
          {sections.map((s, i) => (
            <div className="policy-section glass-card" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
              <h3 className="policy-section-title">{s.title}</h3>
              <p className="policy-section-text">{s.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
