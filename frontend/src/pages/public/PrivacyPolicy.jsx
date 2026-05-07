// PrivacyPolicy — public privacy policy page
const PrivacyPolicy = () => {
  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information that you provide directly, including name, email address, academic records, and institutional affiliation. For universities, we collect institutional data such as student enrollment records, academic performance metrics, and placement statistics. All data collection is in compliance with the Information Technology Act, 2000 and applicable government regulations.`
    },
    {
      title: '2. How We Use Your Information',
      content: `Your information is used to provide centralized student data management, generate analytics for educational policy-making, facilitate communication between institutions and government bodies, and improve our platform's features and security. We do not sell or rent personal information to third parties.`
    },
    {
      title: '3. Data Security',
      content: `We employ industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Access is controlled through role-based authentication with JWT tokens. Regular security audits are conducted, and all systems are hosted on government-approved cloud infrastructure within Indian data centers.`
    },
    {
      title: '4. Data Retention',
      content: `Student academic records are retained for the duration of their enrollment plus 10 years as per UGC guidelines. University institutional data is retained as long as the institution remains registered on the platform. Users may request data deletion subject to regulatory requirements.`
    },
    {
      title: '5. Third-Party Sharing',
      content: `Data may be shared with authorized government agencies (Ministry of Education, UGC, AICTE) for policy analysis and accreditation. No data is shared with private entities without explicit consent. All third-party integrations undergo rigorous security review.`
    },
    {
      title: '6. Your Rights',
      content: `You have the right to access, correct, and request deletion of your personal data. Universities can export their data at any time. Students can view and download their complete profile. To exercise these rights, contact our Data Protection Officer at dpo@educonnect.gov.in.`
    },
    {
      title: '7. Cookies & Tracking',
      content: `We use essential cookies for authentication and session management. No third-party advertising cookies are used. Analytics cookies are used solely to improve platform performance and user experience.`
    },
    {
      title: '8. Updates to This Policy',
      content: `This policy may be updated periodically. All registered users will be notified of material changes via email and platform announcements. Continued use of the platform after updates constitutes acceptance of the revised policy.`
    },
  ];

  return (
    <div className="public-page" id="privacy-policy-page">
      <section className="public-hero public-hero-compact">
        <div className="public-hero-content">
          <span className="public-hero-badge">Legal</span>
          <h1 className="public-hero-title">Privacy <span className="gradient-text">Policy</span></h1>
          <p className="public-hero-desc">How we collect, use, and protect your data on EduConnect.</p>
          <p className="policy-date">Last updated: May 1, 2026</p>
        </div>
      </section>

      <section className="public-section">
        <div className="public-section-inner policy-content" id="policy-content">
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

export default PrivacyPolicy;
