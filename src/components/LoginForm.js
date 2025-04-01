"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "../styles/LoginForm.css"

const LoginForm = () => {
  const navigate = useNavigate()
  const { signInWithGoogle, setCurrentUser } = useAuth() // Add setCurrentUser if available
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [redirectCountdown, setRedirectCountdown] = useState(0)

  // Function to decode JWT token and extract user info
  const decodeToken = (token) => {
    try {
      // JWT tokens are split into three parts: header.payload.signature
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )

      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("Error decoding token:", error)
      return null
    }
  }

  // Function to get user role from token or API
  const getUserRole = async (token) => {
    try {
      // Option 1: Decode the JWT token if it contains role information
      const decodedToken = decodeToken(token)
      if (decodedToken && decodedToken.role) {
        return decodedToken.role
      }

      // For testing purposes - assign ADMIN role to specific test emails
      if (email === "admin@example.com") {
        console.log("Test admin email detected")
        return "ADMIN"
      }

      return "CLIENT" // Default to CLIENT role if unable to determine
    } catch (error) {
      console.error("Error getting user role:", error)
      return "CLIENT" // Default to CLIENT role if unable to determine
    }
  }

  // Handle countdown for redirect after successful login
  useEffect(() => {
    if (redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (redirectCountdown === 0 && successMessage) {
      // Check if there's a stored redirect destination
      const redirectPath = sessionStorage.getItem("redirectAfterLogin")

      if (redirectPath) {
        // Clear the stored redirect path
        sessionStorage.removeItem("redirectAfterLogin")
        console.log("Redirecting to:", redirectPath)
        navigate(redirectPath)
      } else {
        // Default navigation based on role if no specific redirect path
        const role = localStorage.getItem("userRole")
        if (role === "ADMIN") {
          console.log("Redirecting to dashboard")
          navigate("/dashboard")
        } else {
          console.log("Redirecting to home")
          navigate("/")
        }
      }
    }
  }, [redirectCountdown, navigate, successMessage])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      // Call the login API endpoint
      const response = await fetch("https://localhost:8084/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      console.log("Response status:", response.status)

      // Check if the response status is 403 (Forbidden)
      if (response.status === 403) {
        throw new Error("Invalid email or password")
      }

      if (!response.ok) {
        throw new Error("Login failed. Please try again.")
      }

      // Get the token from the response
      const token = await response.text()
      console.log("Login successful, token:", token)

      // Store the token in localStorage
      localStorage.setItem("token", token)

      // Get user role
      const role = await getUserRole(token)
      console.log("User role determined:", role)

      // Store user role in localStorage for use in other components
      localStorage.setItem("userRole", role)

      // Create a user object for AuthContext if possible
      if (setCurrentUser) {
        const userObj = {
          email: email,
          role: role,
          // Add other properties as needed
        }
        setCurrentUser(userObj)
      }

      // Check if there's a redirect path
      const redirectPath = sessionStorage.getItem("redirectAfterLogin")

      // Set success message and start countdown
      if (redirectPath) {
        setSuccessMessage(`Login successful! Redirecting you back...`)
      } else {
        const destination = role === "ADMIN" ? "dashboard" : "home page"
        setSuccessMessage(`Login successful! Redirecting to ${destination}...`)
      }

      setRedirectCountdown(2)
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Invalid email or password. Please try again.")
      setIsLoading(false) // Make sure loading state is reset on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithGoogle()

      // For Google Sign-In, you might need to handle role determination differently
      if (result && result.user) {
        // Check if the user is an admin (you might have this info in your database)
        const adminEmails = ["admin@example.com", "admin@yourdomain.com"]
        const role = adminEmails.includes(result.user.email) ? "ADMIN" : "CLIENT"

        localStorage.setItem("userRole", role)

        console.log("Google sign-in successful, role:", role)

        // Check if there's a redirect path
        const redirectPath = sessionStorage.getItem("redirectAfterLogin")

        if (redirectPath) {
          // Clear the stored redirect path
          sessionStorage.removeItem("redirectAfterLogin")
          console.log("Redirecting to:", redirectPath)
          navigate(redirectPath)
        } else {
          // Navigate based on role
          if (role === "ADMIN") {
            navigate("/dashboard")
          } else {
            navigate("/")
          }
        }
      }
    } catch (error) {
      setError("Google authentication failed. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-form-container">
      <div className="login-form-wrapper">
        <div className="form-header">
          <h1>Welcome to Udrive</h1>
          <p>Log in to access your account</p>
        </div>

        {/* Error Message - Display before success message */}
        {error && <div className="error-message">{error}</div>}

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <div className="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="success-content">
              <p className="success-title">Success!</p>
              <p className="success-text">{successMessage}</p>
              <div className="countdown-wrapper">
                <div className="countdown-timer">
                  <div className="countdown-number">{redirectCountdown}</div>
                  <svg className="countdown-svg" width="30" height="30" viewBox="0 0 30 30">
                    <circle className="countdown-circle" cx="15" cy="15" r="14" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <span className="input-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z"></path>
                    <path d="M22 6l-10 7L2 6"></path>
                  </svg>
                </span>
              </div>
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <span className="input-icon clickable" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                      <line x1="2" x2="22" y1="2" y2="22"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </span>
              </div>
              {/* Moved forgot password link here */}
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className={`login-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : "Sign in"}
            </button>

            <div className="social-login">
              <div className="divider">
                <span>OR</span>
              </div>

              <div className="social-buttons">
                <button
                  type="button"
                  className="social-button google"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>

            <div className="create-account">
              <span>Don't have an account?</span>
              <Link to="/signup" className="create-account-link">
                Create Account
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginForm