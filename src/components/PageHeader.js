import "../styles/PageHeader.css"
import { Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
const PageHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    // Update greeting based on time of day
    const updateGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) {
        setGreeting('Good Morning')
      } else if (hour < 18) {
        setGreeting('Good Afternoon')
      } else {
        setGreeting('Good Evening')
      }
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      updateGreeting()
    }, 60000)

    // Initial greeting
    updateGreeting()

    return () => clearInterval(timer)
  }, [])

  // Format date as "Monday, January 1, 2023"
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="page-header">
      <div className="header-content">
        <div className="greeting-container">
          <h1 className="greeting">{greeting}, <span className="admin-name">Administrator</span></h1>
          <p className="welcome-message">Welcome to your dashboard. Here's what's happening today.</p>
        </div>
        <div className="date-time">
          <Clock className="clock-icon" />
          <span>{formattedDate}</span>
        </div>
      </div>
      <div className="header-divider"></div>
    </div>
  )
}

export default PageHeader

