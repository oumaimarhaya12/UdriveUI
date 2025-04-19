"use client"

import { useEffect, useRef } from "react"

const CarStatistics = ({ cars }) => {
  const donutChartRef = useRef(null)
  const barChartRef = useRef(null)

  // Helper functions for statistics
  const getCategoryColor = (category) => {
    const colors = {
      ECONOMY: "#6366f1",
      COMPACT: "#8b5cf6",
      MIDSIZE: "#ec4899",
      FULLSIZE: "#f43f5e",
      LUXURY: "#f59e0b",
      SUV: "#10b981",
      MINIVAN: "#06b6d4",
      CONVERTIBLE: "#3b82f6",
      STANDARD: "#0ea5e9",
    }
    return colors[category] || "#6b7280"
  }

  // Calculate statistics
  const availableCars = cars.filter((car) => car.status).length
  const unavailableCars = cars.filter((car) => !car.status).length
  const availablePercentage = Math.round((availableCars / cars.length) * 100) || 0
  const unavailablePercentage = Math.round((unavailableCars / cars.length) * 100) || 0

  // Get unique categories and their counts
  const categories = {}
  cars.forEach((car) => {
    if (!categories[car.category]) {
      categories[car.category] = 0
    }
    categories[car.category]++
  })

  // Draw donut chart
  useEffect(() => {
    if (!donutChartRef.current || cars.length === 0) return

    const canvas = donutChartRef.current
    const ctx = canvas.getContext("2d")
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw donut chart
    const drawDonutSegment = (startAngle, endAngle, color) => {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.arc(centerX, centerY, radius * 0.6, endAngle, startAngle, true)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }

    // Draw available segment
    const availableEndAngle = Math.PI * 2 * (availablePercentage / 100)
    drawDonutSegment(0, availableEndAngle, "#10b981")

    // Draw unavailable segment
    drawDonutSegment(availableEndAngle, Math.PI * 2, "#ef4444")

    // Draw inner circle (white)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.58, 0, Math.PI * 2)
    ctx.fillStyle = "white"
    ctx.fill()

    // Draw text in the center
    ctx.fillStyle = "#111827"
    ctx.font = "bold 24px Inter"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(cars.length, centerX, centerY - 10)

    ctx.fillStyle = "#6b7280"
    ctx.font = "14px Inter"
    ctx.fillText("Total Cars", centerX, centerY + 15)
  }, [cars, availablePercentage])

  // Draw bar chart
  useEffect(() => {
    if (!barChartRef.current || cars.length === 0) return

    const canvas = barChartRef.current
    const ctx = canvas.getContext("2d")

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get all categories sorted by count
    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1])

    const barWidth = Math.min(40, (canvas.width - 40) / sortedCategories.length - 10)
    const maxCount = Math.max(...sortedCategories.map(([_, count]) => count))
    const barHeightMultiplier = (canvas.height - 80) / maxCount
    const startX = 40

    // Draw Y axis
    ctx.beginPath()
    ctx.moveTo(startX, 20)
    ctx.lineTo(startX, canvas.height - 40)
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw X axis
    ctx.beginPath()
    ctx.moveTo(startX, canvas.height - 40)
    ctx.lineTo(canvas.width - 20, canvas.height - 40)
    ctx.stroke()

    // Draw bars
    sortedCategories.forEach(([category, count], index) => {
      const x = startX + 10 + index * (barWidth + 10)
      const barHeight = count * barHeightMultiplier
      const y = canvas.height - 40 - barHeight

      // Draw bar
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0])
      ctx.fillStyle = getCategoryColor(category)
      ctx.fill()

      // Draw label
      ctx.save()
      ctx.translate(x + barWidth / 2, canvas.height - 35)
      ctx.rotate(-Math.PI / 4)
      ctx.fillStyle = "#6b7280"
      ctx.font = "12px Inter"
      ctx.textAlign = "right"
      ctx.fillText(category, 0, 0)
      ctx.restore()

      // Draw count
      ctx.fillStyle = "#111827"
      ctx.font = "bold 12px Inter"
      ctx.textAlign = "center"
      ctx.fillText(count, x + barWidth / 2, y - 10)
    })

    // Draw Y axis labels
    const ySteps = 5
    for (let i = 0; i <= ySteps; i++) {
      const value = Math.round((maxCount / ySteps) * i)
      const yPos = canvas.height - 40 - (i / ySteps) * (canvas.height - 80)

      ctx.fillStyle = "#9ca3af"
      ctx.font = "10px Inter"
      ctx.textAlign = "right"
      ctx.fillText(value.toString(), startX - 5, yPos + 3)

      // Draw grid line
      ctx.beginPath()
      ctx.moveTo(startX, yPos)
      ctx.lineTo(canvas.width - 20, yPos)
      ctx.strokeStyle = "rgba(229, 231, 235, 0.5)"
      ctx.stroke()
    }
  }, [cars, categories])

  return (
    <div className="cars-statistics">
      <div className="charts-row">
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Fleet Availability</h3>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#10b981" }}></div>
                <span>Available ({availablePercentage}%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#ef4444" }}></div>
                <span>Unavailable ({unavailablePercentage}%)</span>
              </div>
            </div>
          </div>

          <div className="chart-content">
            <div className="donut-chart-container">
              <canvas ref={donutChartRef} className="donut-chart" width="220" height="220"></canvas>
            </div>

            {/* Replace the chart-stats div with direct HTML instead of using CSS for positioning */}
            <div className="stats-card">
              <div className="stats-item">
                <div className="stats-label">Available</div>
                <div className="stats-value available">{availableCars}</div>
              </div>
              <div className="stats-item">
                <div className="stats-label">Unavailable</div>
                <div className="stats-value unavailable">{unavailableCars}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Cars by Category</h3>
          </div>

          <div className="chart-content">
            <canvas ref={barChartRef} width="500" height="300"></canvas>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarStatistics
