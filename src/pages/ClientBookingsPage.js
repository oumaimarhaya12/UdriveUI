"use client"

import { useEffect } from "react"
import Header from "../components/Header"
import ClientBookings from "../components/ClientBookings"
import Footer from "../components/footer"

const ClientBookingsPage = () => {
  useEffect(() => {
    // Set page title
    document.title = "My Rentals | Udrive"

    // Scroll to top on page load
    window.scrollTo(0, 0)

    // Set white background
    document.body.style.backgroundColor = "#ffffff"

    // Cleanup function
    return () => {
      document.body.style.backgroundColor = ""
    }
  }, [])

  return (
    <div className="client-bookings-page" style={{ backgroundColor: "#ffffff" }}>
      <Header />
      <main>
        <ClientBookings />
      </main>
      <Footer />
    </div>
  )
}

export default ClientBookingsPage
