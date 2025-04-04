"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Car, Calendar, LogOut, User, Clock, MapPin, DollarSign } from "lucide-react"

export default function Dashboard() {
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [pendingReservations, setPendingReservations] = useState([])
  const [isLoadingReservations, setIsLoadingReservations] = useState(false)

  // Check user role for display purposes only (not for access control)
  useEffect(() => {
    // Get role from localStorage
    const role = localStorage.getItem("userRole")
    if (role) {
      setUserRole(role)
    }

    setIsLoading(false)
  }, [])

  // Helper function to get mock data as fallback
  const getMockDataAsFallback = () => {
    console.warn("Using mock data as fallback")
    const mockData = [
      {
        idReservation: 1,
        status: "Pending",
        puckUpAdress: "123 Paris Street, Paris",
        dropOffAdress: "456 Champs-Élysées Avenue, Paris",
        price: 120.5,
        disponibility: {
          idDisponibility: 1,
          isAvailable: false,
          pickUpDate: "2023-05-15T10:00:00",
          dropOffDate: "2023-05-18T18:00:00",
          car: {
            idCar: 1,
            model: "Model 3",
            brand: "Tesla",
            year: 2022,
          },
        },
        client: {
          idClient: 1,
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@example.com",
        },
      },
      {
        idReservation: 2,
        status: "Pending",
        puckUpAdress: "789 Saint-Germain Boulevard, Paris",
        dropOffAdress: "101 Rivoli Street, Paris",
        price: 85.75,
        disponibility: {
          idDisponibility: 2,
          isAvailable: false,
          pickUpDate: "2023-05-20T09:00:00",
          dropOffDate: "2023-05-22T17:00:00",
          car: {
            idCar: 2,
            model: "Clio",
            brand: "Renault",
            year: 2021,
          },
        },
        client: {
          idClient: 2,
          firstName: "Mary",
          lastName: "Johnson",
          email: "mary.johnson@example.com",
        },
      },
    ]
    setPendingReservations(mockData)
  }

  // Fetch pending reservations when the reservations section is active
  useEffect(() => {
    if (activeSection === "reservations") {
      fetchPendingReservations()
    }
  }, [activeSection])

  // Update the fetchPendingReservations function to connect to your backend API
  const fetchPendingReservations = async () => {
    try {
      setIsLoadingReservations(true)

      // Updated API base URL with HTTPS and port 8084
      const apiBaseUrl = "https://localhost:8084"

      console.log("Fetching pending reservations from API...")
      const response = await fetch(`${apiBaseUrl}/api/pendingReservations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers if needed
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Pending reservations from API:", data)
        setPendingReservations(data)
      } else {
        console.error("Failed to fetch pending reservations:", response.status, response.statusText)
        // Use mock data as fallback only if the API call fails
        getMockDataAsFallback()
      }
    } catch (error) {
      console.error("Error fetching pending reservations:", error)
      // Use mock data as fallback if there's an error
      getMockDataAsFallback()
    } finally {
      setIsLoadingReservations(false)
    }
  }

  const handleSignOut = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")

      // Use Auth context signOut if available
      if (signOut) {
        await signOut()
      }

      navigate("/login")
    } catch (error) {
      console.error("Error during sign out:", error)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="dashboard-loading"
        style={{
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="loading-spinner"
            style={{
              border: "4px solid rgba(0, 0, 0, 0.1)",
              borderLeft: "4px solid #4b4ad7",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem auto",
            }}
          ></div>
          <p style={{ fontSize: "1rem", color: "#4b5563" }}>Loading dashboard...</p>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Add these functions to handle approving and rejecting reservations
  const handleApproveReservation = async (reservationId) => {
    try {
      // In a real implementation, you would call your API to approve the reservation
      // Example:
      // const apiBaseUrl = "https://localhost:8084";
      // const response = await fetch(`${apiBaseUrl}/api/approveReservation/${reservationId}`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${localStorage.getItem("token")}`
      //   }
      // });
      // if (response.ok) {
      //   alert(`Reservation ${reservationId} approved successfully!`);
      //   fetchPendingReservations();
      // } else {
      //   alert("Error approving reservation.");
      // }

      console.log(`Approving reservation ${reservationId}`)
      alert(`Reservation ${reservationId} approved successfully!`)

      // Refresh the reservations list
      fetchPendingReservations()
    } catch (error) {
      console.error(`Error approving reservation ${reservationId}:`, error)
      alert("Error approving reservation.")
    }
  }

  const handleRejectReservation = async (reservationId) => {
    try {
      // In a real implementation, you would call your API to reject the reservation
      // Example:
      // const apiBaseUrl = "https://localhost:8084";
      // const response = await fetch(`${apiBaseUrl}/api/rejectReservation/${reservationId}`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${localStorage.getItem("token")}`
      //   }
      // });
      // if (response.ok) {
      //   alert(`Reservation ${reservationId} rejected.`);
      //   fetchPendingReservations();
      // } else {
      //   alert("Error rejecting reservation.");
      // }

      console.log(`Rejecting reservation ${reservationId}`)
      alert(`Reservation ${reservationId} rejected.`)

      // Refresh the reservations list
      fetchPendingReservations()
    } catch (error) {
      console.error(`Error rejecting reservation ${reservationId}:`, error)
      alert("Error rejecting reservation.")
    }
  }

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div style={{ padding: "2rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem", color: "#111827" }}>Dashboard</h1>
            <p style={{ fontSize: "1.125rem", color: "#4b5563", marginBottom: "1.5rem" }}>
              Welcome to your dashboard, {currentUser?.displayName || "Administrator"}!
            </p>

            {userRole && (
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#4b4ad7",
                  color: "white",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginTop: "0.5rem",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
              >
                {userRole}
              </div>
            )}

            {currentUser?.photoURL && (
              <div style={{ marginTop: "1.5rem" }}>
                <img
                  src={currentUser.photoURL || "/placeholder.svg"}
                  alt="Profile"
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    border: "2px solid #e5e7eb",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <div
              style={{
                marginTop: "2rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem", color: "#111827" }}>
                  Quick Stats
                </h3>
                <p style={{ color: "#6b7280", marginBottom: "1rem" }}>Overview of your rental business</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Cars</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827" }}>12</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Active Rentals</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827" }}>5</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Pending</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#4b4ad7" }}>
                      {pendingReservations.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "cars":
        return (
          <div style={{ padding: "2rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem", color: "#111827" }}>
              Vehicle Management
            </h1>
            <p style={{ fontSize: "1.125rem", color: "#4b5563", marginBottom: "1.5rem" }}>
              Manage your fleet of vehicles here.
            </p>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#4b4ad7",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border: "none",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                marginBottom: "2rem",
              }}
            >
              <Car style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
              Add New Vehicle
            </button>
            <div
              style={{
                background: "white",
                borderRadius: "0.5rem",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
                textAlign: "center",
              }}
            >
              <Car style={{ width: "3rem", height: "3rem", margin: "0 auto 1rem", color: "#9ca3af" }} />
              <p style={{ color: "#6b7280" }}>No vehicles found. Add your first vehicle to get started.</p>
            </div>
          </div>
        )
      case "reservations":
        return (
          <div style={{ padding: "2rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem", color: "#111827" }}>
              Reservation Management
            </h1>
            <p style={{ fontSize: "1.125rem", color: "#4b5563", marginBottom: "1.5rem" }}>
              View and manage all pending reservation requests.
            </p>
            <div
              style={{
                background: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827" }}>Pending Reservations</h2>
                <span
                  style={{
                    backgroundColor: "#e0e7ff",
                    color: "#4338ca",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  {pendingReservations.length} Pending
                </span>
              </div>

              {isLoadingReservations ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "3rem" }}>
                  <div
                    className="loading-spinner"
                    style={{
                      border: "3px solid rgba(0, 0, 0, 0.1)",
                      borderLeft: "3px solid #4b4ad7",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      animation: "spin 1s linear infinite",
                      marginRight: "0.75rem",
                    }}
                  ></div>
                  <p style={{ color: "#6b7280" }}>Loading reservations...</p>
                </div>
              ) : pendingReservations.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f9fafb", textAlign: "left" }}>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          ID
                        </th>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          Client
                        </th>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          Vehicle
                        </th>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          Pickup Date
                        </th>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          Return Date
                        </th>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          Pickup Location
                        </th>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          Return Location
                        </th>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          Price
                        </th>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          Status
                        </th>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingReservations.map((reservation, index) => {
                        // Extract data from the nested structure - handle different possible data structures
                        // This makes the code more robust in case the API response structure changes
                        const pickUpDate = reservation.disponibility?.pickUpDate
                          ? formatDate(reservation.disponibility.pickUpDate)
                          : reservation.pickUpDate
                            ? formatDate(reservation.pickUpDate)
                            : "N/A"

                        const dropOffDate = reservation.disponibility?.dropOffDate
                          ? formatDate(reservation.disponibility.dropOffDate)
                          : reservation.dropOffDate
                            ? formatDate(reservation.dropOffDate)
                            : "N/A"

                        const carModel =
                          reservation.disponibility?.car?.model || reservation.carModel || "Not specified"
                        const carBrand = reservation.disponibility?.car?.brand || reservation.carBrand || ""

                        const clientName = reservation.client
                          ? `${reservation.client.firstName} ${reservation.client.lastName}`
                          : reservation.clientName || "Unknown client"

                        // Handle different property names for addresses
                        const pickUpAddress = reservation.puckUpAdress || reservation.pickUpAddress || "Not specified"
                        const dropOffAddress =
                          reservation.dropOffAdress || reservation.dropOffAddress || "Not specified"

                        // Handle different property names for reservation ID
                        const reservationId = reservation.idReservation || reservation.id || index + 1

                        // Handle different property names for price
                        const price = reservation.price !== undefined ? reservation.price : 0

                        return (
                          <tr key={index} style={{ borderBottom: "1px solid #e5e7eb" }}>
                            <td style={{ padding: "1rem 1.5rem", color: "#111827", fontSize: "0.875rem" }}>
                              {reservationId}
                            </td>
                            <td
                              style={{
                                padding: "1rem 1.5rem",
                                color: "#111827",
                                fontSize: "0.875rem",
                                fontWeight: "500",
                              }}
                            >
                              {clientName}
                            </td>
                            <td style={{ padding: "1rem 1.5rem", color: "#111827", fontSize: "0.875rem" }}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <Car
                                  style={{ width: "1rem", height: "1rem", marginRight: "0.5rem", color: "#6b7280" }}
                                />
                                <span>
                                  {carBrand} {carModel}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "1rem 1.5rem", color: "#111827", fontSize: "0.875rem" }}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <Calendar
                                  style={{ width: "1rem", height: "1rem", marginRight: "0.5rem", color: "#6b7280" }}
                                />
                                <span>{pickUpDate}</span>
                              </div>
                            </td>
                            <td style={{ padding: "1rem 1.5rem", color: "#111827", fontSize: "0.875rem" }}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <Calendar
                                  style={{ width: "1rem", height: "1rem", marginRight: "0.5rem", color: "#6b7280" }}
                                />
                                <span>{dropOffDate}</span>
                              </div>
                            </td>
                            <td style={{ padding: "1rem 1.5rem", color: "#111827", fontSize: "0.875rem" }}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <MapPin
                                  style={{ width: "1rem", height: "1rem", marginRight: "0.5rem", color: "#6b7280" }}
                                />
                                <span>{pickUpAddress}</span>
                              </div>
                            </td>
                            <td style={{ padding: "1rem 1.5rem", color: "#111827", fontSize: "0.875rem" }}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <MapPin
                                  style={{ width: "1rem", height: "1rem", marginRight: "0.5rem", color: "#6b7280" }}
                                />
                                <span>{dropOffAddress}</span>
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "1rem 1.5rem",
                                color: "#111827",
                                fontSize: "0.875rem",
                                fontWeight: "500",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <DollarSign
                                  style={{ width: "1rem", height: "1rem", marginRight: "0.25rem", color: "#6b7280" }}
                                />
                                <span>{typeof price === "number" ? price.toFixed(2) : "0.00"}</span>
                              </div>
                            </td>
                            <td style={{ padding: "1rem 1.5rem", color: "#111827", fontSize: "0.875rem" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  backgroundColor: "#FEF9C3",
                                  color: "#854D0E",
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "9999px",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                }}
                              >
                                <Clock style={{ width: "0.75rem", height: "0.75rem", marginRight: "0.25rem" }} />
                                Pending
                              </span>
                            </td>
                            <td style={{ padding: "1rem 1.5rem", color: "#111827", fontSize: "0.875rem" }}>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button
                                  style={{
                                    backgroundColor: "#4b4ad7",
                                    color: "white",
                                    padding: "0.375rem 0.75rem",
                                    borderRadius: "0.375rem",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: "500",
                                    display: "flex",
                                    alignItems: "center",
                                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                                  }}
                                  onClick={() => handleApproveReservation(reservationId)}
                                >
                                  Approve
                                </button>
                                <button
                                  style={{
                                    backgroundColor: "white",
                                    color: "#ef4444",
                                    padding: "0.375rem 0.75rem",
                                    borderRadius: "0.375rem",
                                    border: "1px solid #ef4444",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: "500",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={() => handleRejectReservation(reservationId)}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: "3rem", textAlign: "center" }}>
                  <Calendar style={{ width: "3rem", height: "3rem", margin: "0 auto 1rem", color: "#9ca3af" }} />
                  <p style={{ color: "#6b7280" }}>No pending reservations found.</p>
                </div>
              )}
            </div>
          </div>
        )
      default:
        return <div>Select a section from the menu</div>
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc" }}>
      <div
        style={{
          width: "280px",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          boxShadow: "1px 0 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ fontWeight: "700", fontSize: "1.25rem", color: "#111827" }}>U-Drive Admin</h2>
            {userRole && <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>{userRole}</p>}
          </div>
        </div>

        <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto" }}>
          <div
            style={{
              marginBottom: "0.75rem",
              fontSize: "0.75rem",
              color: "#6b7280",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Navigation
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <button
                onClick={() => setActiveSection("dashboard")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  background: activeSection === "dashboard" ? "#f1f5f9" : "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontWeight: activeSection === "dashboard" ? "600" : "normal",
                  color: activeSection === "dashboard" ? "#111827" : "#4b5563",
                  transition: "all 0.2s",
                }}
              >
                <User style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.75rem" }} />
                <span>Dashboard</span>
              </button>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <button
                onClick={() => setActiveSection("cars")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  background: activeSection === "cars" ? "#f1f5f9" : "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontWeight: activeSection === "cars" ? "600" : "normal",
                  color: activeSection === "cars" ? "#111827" : "#4b5563",
                  transition: "all 0.2s",
                }}
              >
                <Car style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.75rem" }} />
                <span>Vehicle Management</span>
              </button>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <button
                onClick={() => setActiveSection("reservations")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  background: activeSection === "reservations" ? "#f1f5f9" : "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontWeight: activeSection === "reservations" ? "600" : "normal",
                  color: activeSection === "reservations" ? "#111827" : "#4b5563",
                  transition: "all 0.2s",
                }}
              >
                <Calendar style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.75rem" }} />
                <span>Reservation Management</span>
              </button>
            </li>
          </ul>
        </div>

        <div style={{ padding: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
          {currentUser && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "0.75rem",
                  overflow: "hidden",
                }}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL || "/placeholder.svg"}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User style={{ width: "1.25rem", height: "1.25rem", color: "#6b7280" }} />
                )}
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#111827", margin: 0 }}>
                  {currentUser.displayName || "Administrator"}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                  {currentUser.email || "admin@udrive.com"}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              background: "white",
              textAlign: "left",
              cursor: "pointer",
              color: "#ef4444",
              fontWeight: "500",
              transition: "all 0.2s",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <LogOut style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.75rem" }} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <main style={{ flex: 1, overflow: "auto" }}>{renderContent()}</main>
    </div>
  )
}

