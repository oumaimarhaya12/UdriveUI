"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { currentUser } = useAuth()

  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("userRole")

  console.log("PrivateRoute - AuthContext user:", currentUser ? "exists" : "null")
  console.log("PrivateRoute - localStorage token:", token ? "exists" : "null")
  console.log("PrivateRoute - localStorage role:", userRole)

  if (adminOnly && userRole !== "ADMIN") {
    console.log("PrivateRoute - Admin access required but user is not admin")
    return <Navigate to="/login" />
  }

  if (currentUser || token) {
    console.log("PrivateRoute - Authentication successful, rendering protected route")
    return children
  }

  console.log("PrivateRoute - No authentication found, redirecting to login")
  return <Navigate to="/login" />
}

export default PrivateRoute

