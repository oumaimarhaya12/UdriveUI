import "../styles/dashboard.css"

const DashboardStats = ({ stats }) => {
  return (
    <div className="dashboard-stats">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <h3>{stat.title}</h3>
          <p className="stat-value">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats
