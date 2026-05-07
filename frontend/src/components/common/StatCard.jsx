// StatCard — animated statistic card with icon
const StatCard = ({ icon, value, label, color = 'purple', trend }) => {
  return (
    <div className={`stat-card ${color} slide-up`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">
        {label}
        {trend && (
          <span
            style={{
              marginLeft: '8px',
              color: trend > 0 ? 'var(--accent-400)' : 'var(--danger-400)',
              fontSize: '0.8rem',
            }}
          >
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
