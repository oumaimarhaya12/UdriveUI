"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Check user role for display purposes only (not for access control)
  useEffect(() => {
    // Get role from localStorage
    const role = localStorage.getItem("userRole")
    if (role) {
      setUserRole(role)
    }

    setIsLoading(false)
  }, [])

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
      console.error("Erreur lors de la déconnexion:", error)
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
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="loading-spinner"
            style={{
              border: "4px solid rgba(0, 0, 0, 0.1)",
              borderLeft: "4px solid #4b4ad7",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem auto",
            }}
          ></div>
          <p>Chargement du tableau de bord...</p>
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

  return (
    <div className="dashboard-container" style={{ padding: "2rem" }}>
      <h1>Tableau de Bord</h1>
      <p>Bienvenue sur votre tableau de bord, {currentUser?.displayName || "Administrateur"}!</p>

      {userRole && (
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#4b4ad7",
            color: "white",
            padding: "0.25rem 0.5rem",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: "500",
            marginTop: "0.5rem",
          }}
        >
          {userRole}
        </div>
      )}

      {currentUser?.photoURL && (
        <div style={{ marginTop: "1rem" }}>
          <img
            src={currentUser.photoURL || "/placeholder.svg"}
            alt="Profil"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
          />
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={handleSignOut}
          style={{
            backgroundColor: "#4b4ad7",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}

