"use client"

import { useState, useEffect, useRef } from "react"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Car,
  Calendar,
  Banknote,
  Star,
  Activity,
  Award,
  ShieldCheck,
} from "lucide-react"
import { Line, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js"
import "../styles/DashboardStats.css"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler)

const DashboardStats = ({ pendingCount = 0, confirmedCount = 0 }) => {
  const [isVisible, setIsVisible] = useState({
    stats: false,
    customers: false,
    topCars: false,
    revenue: false,
    bookings: false,
  })

  const statsRef = useRef(null)
  const customersRef = useRef(null)
  const topCarsRef = useRef(null)
  const revenueRef = useRef(null)
  const bookingsRef = useRef(null)

  // Mock data
  const stats = {
    totalRevenue: {
      value: 9460,
      change: 1.5,
      trend: "up",
    },
    activeRentals: {
      value: pendingCount + confirmedCount,
      change: 12,
      trend: "up",
    },
    availableCars: {
      value: 15,
      change: 8,
      trend: "down",
    },
    todaysBookings: {
      value: 24,
      change: 4.2,
      trend: "up",
    },
  }

  const customerStats = {
    totalCustomers: 1240,
    newCustomers: 128,
    averageSpending: 4500,
    satisfactionRate: 94.5,
  }

  const topCars = [
    {
      model: "Tesla Model S",
      bookings: 145,
      revenue: 24500,
      rating: 4.8,
    },
    {
      model: "BMW X5",
      bookings: 132,
      revenue: 19800,
      rating: 4.7,
    },
    {
      model: "Mercedes E-Class",
      bookings: 128,
      revenue: 18400,
      rating: 4.6,
    },
  ]

  // Chart data
  const revenueData = {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    datasets: [
      {
        label: "Revenue",
        data: [65000, 81000, 90000, 105000, 125000, 160000],
        borderColor: "rgba(97, 96, 254, 1)",
        backgroundColor: "rgba(97, 96, 254, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 3,
      },
      {
        label: "Target",
        data: [60000, 75000, 85000, 95000, 110000, 140000],
        borderColor: "rgba(200, 200, 200, 0.5)",
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        pointRadius: 0,
      },
    ],
  }

  const bookingStatusData = {
    labels: ["Active Rentals", "Cancelled", "Completed"],
    datasets: [
      {
        data: [65, 15, 20],
        backgroundColor: ["rgba(97, 96, 254, 0.8)", "rgba(255, 99, 132, 0.8)", "rgba(75, 192, 192, 0.8)"],
        borderColor: ["rgba(97, 96, 254, 1)", "rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
        cutout: "75%",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1e293b",
        bodyColor: "#1e293b",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 12,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("fr-MA", {
                style: "currency",
                currency: "MAD",
                maximumFractionDigits: 0,
              }).format(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          callback: (value) => {
            if (value >= 1000) {
              return value / 1000 + "k MAD"
            }
            return value + " MAD"
          },
          color: "rgba(0, 0, 0, 0.7)",
          font: {
            size: 11,
          },
          padding: 10,
        },
        border: {
          dash: [4, 4],
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "rgba(0, 0, 0, 0.7)",
          font: {
            size: 11,
          },
          padding: 10,
        },
        border: {
          dash: [4, 4],
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        backgroundColor: "white",
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1e293b",
        bodyColor: "#1e293b",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 12,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    cutout: "75%",
  }

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === statsRef.current) {
            setIsVisible((prev) => ({ ...prev, stats: true }))
          } else if (entry.target === customersRef.current) {
            setIsVisible((prev) => ({ ...prev, customers: true }))
          } else if (entry.target === topCarsRef.current) {
            setIsVisible((prev) => ({ ...prev, topCars: true }))
          } else if (entry.target === revenueRef.current) {
            setIsVisible((prev) => ({ ...prev, revenue: true }))
          } else if (entry.target === bookingsRef.current) {
            setIsVisible((prev) => ({ ...prev, bookings: true }))
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    if (statsRef.current) observer.observe(statsRef.current)
    if (customersRef.current) observer.observe(customersRef.current)
    if (topCarsRef.current) observer.observe(topCarsRef.current)
    if (revenueRef.current) observer.observe(revenueRef.current)
    if (bookingsRef.current) observer.observe(bookingsRef.current)

    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current)
      if (customersRef.current) observer.unobserve(customersRef.current)
      if (topCarsRef.current) observer.unobserve(topCarsRef.current)
      if (revenueRef.current) observer.unobserve(revenueRef.current)
      if (bookingsRef.current) observer.unobserve(bookingsRef.current)
    }
  }, [])

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="dashboard-stats light">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to your rental management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div ref={statsRef} className={`stats-grid ${isVisible.stats ? "animate-in" : ""}`}>
        <div className="stat-card revenue-card">
          <div className="stat-header">
            <div className="stat-title">
              <Banknote size={18} />
              <span>Total Revenue</span>
            </div>
            <div className={`trend-icon ${stats.totalRevenue.trend}`}>
              {stats.totalRevenue.trend === "up" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
          </div>
          <div className="stat-value" style={{ color: "#1e293b" }}>
            {formatCurrency(stats.totalRevenue.value)}
          </div>
          <div className="stat-footer">
            <div className={`stat-change ${stats.totalRevenue.trend}`}>
              {stats.totalRevenue.trend === "up" ? "+" : ""}
              {stats.totalRevenue.change}%
            </div>
            <div className="stat-period">vs last month</div>
          </div>
          <div className="stat-bg-icon">
            <Banknote size={80} />
          </div>
        </div>

        <div className="stat-card rentals-card">
          <div className="stat-header">
            <div className="stat-title">
              <Activity size={18} />
              <span>Active Rentals</span>
            </div>
            <div className={`trend-icon ${stats.activeRentals.trend}`}>
              {stats.activeRentals.trend === "up" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
          </div>
          <div className="stat-value" style={{ color: "#1e293b" }}>
            {stats.activeRentals.value}
          </div>
          <div className="stat-footer">
            <div className={`stat-change ${stats.activeRentals.trend}`}>
              {stats.activeRentals.trend === "up" ? "+" : ""}
              {stats.activeRentals.change}%
            </div>
            <div className="stat-period">vs last month</div>
          </div>
          <div className="stat-bg-icon">
            <Activity size={80} />
          </div>
        </div>

        <div className="stat-card cars-card">
          <div className="stat-header">
            <div className="stat-title">
              <Car size={18} />
              <span>Available Cars</span>
            </div>
            <div className={`trend-icon ${stats.availableCars.trend}`}>
              {stats.availableCars.trend === "up" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
          </div>
          <div className="stat-value" style={{ color: "#1e293b" }}>
            {stats.availableCars.value}
          </div>
          <div className="stat-footer">
            <div className={`stat-change ${stats.availableCars.trend}`}>
              {stats.availableCars.trend === "up" ? "+" : ""}
              {stats.availableCars.change}%
            </div>
            <div className="stat-period">vs last month</div>
          </div>
          <div className="stat-bg-icon">
            <Car size={80} />
          </div>
        </div>

        <div className="stat-card bookings-card">
          <div className="stat-header">
            <div className="stat-title">
              <Calendar size={18} />
              <span>Today's Bookings</span>
            </div>
            <div className={`trend-icon ${stats.todaysBookings.trend}`}>
              {stats.todaysBookings.trend === "up" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
          </div>
          <div className="stat-value" style={{ color: "#1e293b" }}>
            {stats.todaysBookings.value}
          </div>
          <div className="stat-footer">
            <div className={`stat-change ${stats.todaysBookings.trend}`}>
              {stats.todaysBookings.trend === "up" ? "+" : ""}
              {stats.todaysBookings.change}%
            </div>
            <div className="stat-period">vs last month</div>
          </div>
          <div className="stat-bg-icon">
            <Calendar size={80} />
          </div>
        </div>
      </div>

      {/* Revenue Chart and Booking Status */}
      <div className="dashboard-grid">
        <div ref={revenueRef} className={`dashboard-card revenue-chart ${isVisible.revenue ? "animate-in" : ""}`}>
          <div className="card-header">
            <div>
              <h2>Revenue Overview</h2>
              <p>Monthly revenue with MAD: 5,800</p>
            </div>
            <div className="card-icon">
              <Banknote size={24} />
            </div>
          </div>

          <div className="chart-container">
            <Line data={revenueData} options={chartOptions} height={300} />
          </div>
        </div>

        <div ref={bookingsRef} className={`dashboard-card booking-status ${isVisible.bookings ? "animate-in" : ""}`}>
          <div className="card-header">
            <div>
              <h2>Booking Status</h2>
              <p>Current booking distribution</p>
            </div>
            <div className="card-icon">
              <Calendar size={24} />
            </div>
          </div>

          <div className="chart-container doughnut-container">
            <Doughnut data={bookingStatusData} options={doughnutOptions} height={250} />
            <div className="doughnut-center">
              <div className="doughnut-value">65%</div>
              <div className="doughnut-label">Active</div>
            </div>
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "rgba(97, 96, 254, 0.8)" }}></div>
              <span>Active Rentals</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "rgba(255, 99, 132, 0.8)" }}></div>
              <span>Cancelled</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "rgba(75, 192, 192, 0.8)" }}></div>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Overview and Top Cars */}
      <div className="dashboard-grid">
        <div
          ref={customersRef}
          className={`dashboard-card customer-overview ${isVisible.customers ? "animate-in" : ""}`}
        >
          <div className="card-header">
            <div>
              <h2>Customer Overview</h2>
              <p>Monthly customer insights</p>
            </div>
            <div className="card-icon">
              <Users size={24} />
            </div>
          </div>

          <div className="customer-stats">
            <div className="customer-stat-item total-customers">
              <div className="stat-icon-wrapper">
                <Users size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Customers</span>
                <span className="stat-number">{customerStats.totalCustomers.toLocaleString()}</span>
              </div>
            </div>

            <div className="customer-stat-item new-customers">
              <div className="stat-icon-wrapper">
                <Award size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">New Customers</span>
                <span className="stat-number positive">+{customerStats.newCustomers}</span>
              </div>
            </div>

            <div className="customer-stat-item avg-spending">
              <div className="stat-icon-wrapper">
                <Banknote size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Average Spending</span>
                <span className="stat-number orange">{customerStats.averageSpending.toLocaleString()} MAD</span>
              </div>
            </div>

            <div className="customer-stat-item satisfaction">
              <div className="stat-icon-wrapper">
                <ShieldCheck size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Satisfaction Rate</span>
                <span className="stat-number blue">
                  {customerStats.satisfactionRate}% <span className="stat-subtext">satisfied</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div ref={topCarsRef} className={`dashboard-card top-cars ${isVisible.topCars ? "animate-in" : ""}`}>
          <div className="card-header">
            <div>
              <h2>Top Performing Cars</h2>
              <p>Most booked vehicles this month</p>
            </div>
            <div className="card-icon">
              <Car size={24} />
            </div>
          </div>

          <div className="top-cars-list">
            {topCars.map((car, index) => (
              <div key={index} className="top-car-item">
                <div className="car-icon">
                  <Car size={20} />
                </div>
                <div className="car-details">
                  <span className="car-model">{car.model}</span>
                  <span className="car-bookings">{car.bookings} bookings</span>
                </div>
                <div className="car-stats">
                  <span className="car-revenue">{formatCurrency(car.revenue)}</span>
                  <div className="car-rating">
                    <Star size={14} fill="#FFD700" color="#FFD700" />
                    <span>{car.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
