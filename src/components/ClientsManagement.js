"use client"

import { useState, useEffect, useMemo } from "react"
import { Users, Search, UserCheck, Flag, Trash2, Calendar, MapPin, Award } from "lucide-react"
import "../styles/ClientsManagement.css"

const ClientsManagement = ({ darkMode }) => {
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteError, setDeleteError] = useState(null)
  const [deleteSuccess, setDeleteSuccess] = useState(null)
  const itemsPerPage = 8

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:8084/api"

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Making the request to the correct getAllUsers endpoint
      const response = await fetch(`${API_BASE_URL}/user/getAllUsers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error fetching clients: ${response.statusText}`)
      }

      const clientsData = await response.json()
      console.log("Clients data received:", clientsData)

      if (Array.isArray(clientsData) && clientsData.length > 0) {
        setClients(clientsData)
      } else {
        console.log("No clients found or data is not in expected format", clientsData)
        setClients([])
      }
    } catch (error) {
      console.error("Error in fetchClients:", error)
      setClients([])
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const totalClients = clients.length
    // Count clients with valid driver's license
    const withLicense = clients.filter(client => client.driverLicense).length

    // Calculate average age
    const totalAge = clients.reduce((sum, client) => sum + (client.age || 0), 0)
    const avgAge = totalClients > 0 ? Math.round(totalAge / totalClients) : 0

    // Count nationalities
    const nationalitiesCount = clients.reduce((acc, client) => {
      const nationality = client.nationality || "Unknown"
      acc[nationality] = (acc[nationality] || 0) + 1
      return acc
    }, {})

    // Get most common nationality
    let mostCommonNationality = "None"
    let maxCount = 0
    Object.entries(nationalitiesCount).forEach(([nationality, count]) => {
      if (count > maxCount) {
        mostCommonNationality = nationality
        maxCount = count
      }
    })

    return {
      total: totalClients,
      withLicense,
      avgAge,
      mostCommonNationality,
    }
  }, [clients])

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    let filtered = clients

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (client) =>
          client.firstName?.toLowerCase().includes(term) ||
          client.lastName?.toLowerCase().includes(term) ||
          client.email?.toLowerCase().includes(term) ||
          client.phoneNumber?.toLowerCase().includes(term) ||
          client.nationality?.toLowerCase().includes(term),
      )
    }

    return filtered
  }, [clients, searchTerm])

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
  const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleDeleteClient = async (id) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Connect to the backend delete endpoint as defined in UserController
      const response = await fetch(`${API_BASE_URL}/user/deleteUser/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error deleting client: ${response.statusText}`)
      }

      // If delete was successful, update the client list
      setClients(clients.filter((client) => client.idUser !== id))
      setDeleteSuccess("Client deleted successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setDeleteSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Error deleting client:", error)
      setDeleteError(error.message || "Failed to delete client. Please try again.")

      // Clear error message after 3 seconds
      setTimeout(() => {
        setDeleteError(null)
      }, 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading clients data...</p>
      </div>
    )
  }

  return (
    <div className="clients-management">
      <div className="clients-header">
        <h1 className="section-title">Clients</h1>
      </div>

      <div className="clients-stats">
        <div className="stat-card glass-card">
          <div className="stat-icon total">
            <Users size={20} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Total Clients</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon age">
            <Calendar size={20} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Average Age</h3>
            <p className="stat-value">{stats.avgAge}</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon nationality">
            <MapPin size={20} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Top Nationality</h3>
            <p className="stat-value">{stats.mostCommonNationality}</p>
          </div>
        </div>
      </div>

      <div className="clients-actions glass-card">
        <div className="filter-buttons">
          <button className="filter-button active">All Clients</button>
        </div>

        <div className="search-container">
          <div className="search-icon-wrapper">
            <Search size={18} className="search-icon" />
          </div>
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm("")} aria-label="Clear search">
              &times;
            </button>
          )}
        </div>
      </div>

      {deleteError && (
        <div className="error-message">
          <UserCheck size={18} />
          <p>{deleteError}</p>
        </div>
      )}

      {deleteSuccess && (
        <div className="success-message">
          <UserCheck size={18} />
          <p>{deleteSuccess}</p>
        </div>
      )}

      {filteredClients.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-icon">
            <Users size={64} />
          </div>
          <p>No clients found</p>
          <p className="empty-state-subtitle">
            {searchTerm ? "Try adjusting your search criteria." : "There are no clients in the system yet."}
          </p>
          <button className="refresh-button" onClick={fetchClients}>
            Refresh Data
          </button>
        </div>
      ) : (
        <div className="table-container glass-card">
          <div className="table-responsive">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Age</th>
                  <th>Contact</th>
                  <th>Nationality</th>
                  <th>Driver's License</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr key={client.idUser} className="table-row">
                    <td>
                      <div className="client-info">
                        <div className="client-avatar">
                          {client.firstName?.charAt(0)}
                          {client.lastName?.charAt(0)}
                        </div>
                        <div className="client-name">
                          <div className="name">
                            {client.firstName} {client.lastName}
                          </div>
                          <div className="client-id">ID: {client.idUser}</div>
                        </div>
                      </div>
                    </td>
                    <td>{client.age}</td>
                    <td>
                      <div className="contact-info">
                        <div className="email">
                          <svg
                            className="simple-icon"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"
                              fill="#8e8dff"
                            />
                          </svg>
                          {client.email}
                        </div>
                        <div className="phone">
                          <svg
                            className="simple-icon"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
                              fill="#8e8dff"
                            />
                          </svg>
                          {client.phoneNumber || "Not provided"}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="nationality">
                        <Flag size={18} className="nationality-icon" />
                        {client.nationality || "Not specified"}
                      </div>
                    </td>
                    <td>
                      <span className={`license-badge ${client.driverLicense ? "has-license" : "no-license"}`}>
                        <Award size={16} className="license-icon" />
                        {client.driverLicense ? "Valid" : "Not Available"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteClient(client.idUser)}
                          title="Delete client"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-button ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  )
}

export default ClientsManagement