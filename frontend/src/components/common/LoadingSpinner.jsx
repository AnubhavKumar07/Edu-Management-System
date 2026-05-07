// LoadingSpinner — full-page or inline loading indicator
const LoadingSpinner = ({ size = 'default', text = 'Loading...' }) => {
  return (
    <div className="spinner-container">
      <div style={{ textAlign: 'center' }}>
        <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`}></div>
        {text && (
          <p style={{ marginTop: '16px', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
