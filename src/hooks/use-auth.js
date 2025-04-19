"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"

export const useAuthentication = () => {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication - memoized to prevent unnecessary re-renders
  const checkAuthentication = useCallback(() => {
    // Get token from localStorage
    const token = localStorage.getItem("token")
    const expiration = localStorage.getItem("tokenExpiration")
    const role = localStorage.getItem("userRole")

    // Check if we have a token
    if (!token) {
      return false
    }

    // Get role from localStorage
    if (role) {
      setUserRole(role)
    }

    // Check token expiration
    if (expiration) {
      const expirationTime = Number.parseInt(expiration, 10)
      const currentTime = new Date().getTime()

      if (currentTime > expirationTime) {
        console.warn("Token has expired, redirecting to login")
        // Clear expired token
        localStorage.removeItem("token")
        localStorage.removeItem("tokenExpiration")
        return false
      }
    }

    return true
  }, [])

  // Handle sign out - memoized to prevent unnecessary re-renders
  const handleSignOut = useCallback(async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("tokenExpiration")
      localStorage.removeItem("userRole")
      localStorage.removeItem("lastLoginResponse")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("tokenFormat")

      setIsAuthenticated(false)
      navigate("/login")
      return { success: true }
    } catch (error) {
      console.error("Error during sign out:", error)
      return { success: false, error: error.message }
    }
  }, [navigate])

  // Check authentication on mount
  useEffect(() => {
    setIsLoading(true)
    const isAuth = checkAuthentication()
    setIsAuthenticated(isAuth)

    if (!isAuth) {
      navigate("/login")
    }
    setIsLoading(false)
  }, [checkAuthentication, navigate])

  return {
    isAuthenticated,
    userRole,
    handleSignOut,
    checkAuthentication,
    isLoading,
  }
}
