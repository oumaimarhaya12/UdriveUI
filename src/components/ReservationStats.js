"use client"

import { BarChart3, Calendar, CheckCircle, Clock } from "lucide-react"
import "../styles/dashboard.css"

const ReservationStats = ({ pendingCount, confirmedCount }) => {
  const totalCount = pendingCount + confirmedCount
  const pendingPercentage = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0
  const confirmedPercentage = totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0

  return (
    <div className="reservation-stats">
      <div className="stat-card total glass-card">
        <div className="stat-icon">
          <Calendar size={24} />
        </div>
        <div className="stat-content">
          <h3>Total Reservations</h3>
          <p className="stat-value">{totalCount}</p>
          <div className="stat-progress">
            <div className="progress-bar">
              <div className="progress-fill confirmed" style={{ width: `${confirmedPercentage}%` }}></div>
              <div className="progress-fill pending" style={{ width: `${pendingPercentage}%` }}></div>
            </div>
            <div className="progress-legend">
              <div className="legend-item">
                <span className="legend-color confirmed"></span>
                <span>Confirmed ({confirmedPercentage}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color pending"></span>
                <span>Pending ({pendingPercentage}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card pending glass-card">
        <div className="stat-icon">
          <Clock size={24} />
        </div>
        <div className="stat-content">
          <h3>Pending Reservations</h3>
          <p className="stat-value">{pendingCount}</p>
          <p className="stat-description">Awaiting approval</p>
        </div>
      </div>

      <div className="stat-card confirmed glass-card">
        <div className="stat-icon">
          <CheckCircle size={24} />
        </div>
        <div className="stat-content">
          <h3>Confirmed Reservations</h3>
          <p className="stat-value">{confirmedCount}</p>
          <p className="stat-description">Successfully booked</p>
        </div>
      </div>

      <div className="stat-card ratio glass-card">
        <div className="stat-icon">
          <BarChart3 size={24} />
        </div>
        <div className="stat-content">
          <h3>Confirmation Rate</h3>
          <p className="stat-value">{totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0}%</p>
          <p className="stat-description">
            {totalCount > 0 ? `${confirmedCount} out of ${totalCount} reservations confirmed` : "No reservations yet"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReservationStats
