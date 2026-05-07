// ContactUs — public contact page with form and info
import { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: '📧', title: 'Email Us', value: 'support@educonnect.gov.in', desc: 'For general queries and support' },
    { icon: '📞', title: 'Call Us', value: '+91 77039538577', desc: 'Mon-Fri, 9AM to 6PM IST' },
    { icon: '📍', title: 'Visit Us', value: 'Shastri Bhawan, New Delhi', desc: 'Ministry of Education, GoI' },
    { icon: '💬', title: 'Live Chat', value: 'Available 24/7', desc: 'Instant support for urgent queries' },
  ];

  return (
    <div className="public-page" id="contact-us-page">
      {/* Hero */}
      <section className="public-hero">
        <div className="public-hero-content">
          <span className="public-hero-badge">Contact Us</span>
          <h1 className="public-hero-title">
            We'd Love to
            <span className="gradient-text"> Hear From You</span>
          </h1>
          <p className="public-hero-desc">
            Have a question, suggestion, or need support? Reach out to the EduConnect
            team and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="public-section">
        <div className="public-section-inner">
          <div className="contact-info-grid" id="contact-info-grid">
            {contactInfo.map((item, i) => (
              <div className="glass-card contact-info-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="contact-info-icon">{item.icon}</div>
                <h4 className="contact-info-title">{item.title}</h4>
                <p className="contact-info-value">{item.value}</p>
                <p className="contact-info-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="public-section alt-bg">
        <div className="public-section-inner">
          <div className="contact-form-wrapper" id="contact-form-wrapper">
            <div className="contact-form-info">
              <h2 className="section-title">Send Us a Message</h2>
              <p className="section-subtitle">
                Fill out the form and our team will respond promptly. For urgent
                issues, please call our helpline directly.
              </p>

              <div className="contact-feature-list">
                <div className="contact-feature">
                  <span className="contact-feature-icon">⚡</span>
                  <div>
                    <h5>Fast Response</h5>
                    <p>Average response time under 4 hours</p>
                  </div>
                </div>
                <div className="contact-feature">
                  <span className="contact-feature-icon">🛡️</span>
                  <div>
                    <h5>Secure & Private</h5>
                    <p>Your information is encrypted and safe</p>
                  </div>
                </div>
                <div className="contact-feature">
                  <span className="contact-feature-icon">🌍</span>
                  <div>
                    <h5>Pan-India Support</h5>
                    <p>Available in English and Hindi</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="contact-form glass-card" onSubmit={handleSubmit} id="contact-form">
              {submitted && (
                <div className="contact-success" id="contact-success-msg">
                  ✅ Thank you! Your message has been sent successfully.
                </div>
              )}
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Full Name</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email Address</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject</label>
                <select
                  id="contact-subject"
                  name="subject"
                  className="form-select"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="onboarding">University Onboarding</option>
                  <option value="data">Data & Privacy</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="form-textarea"
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full" id="contact-submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
