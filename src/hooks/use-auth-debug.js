"use client"

export function useAuthDebug() {
  // Debug authentication issues
  const debugAuthenticationIssue = async () => {
    try {
      // Get the token
      const token = localStorage.getItem("token")
      if (!token) {
        console.log("No Token Found", "Please log in again")
        return { success: false, error: "No token found" }
      }

      // Display token information
      const tokenInfo = {
        length: token.length,
        preview: token.substring(0, 30) + "...",
        startsWithBearer: token.startsWith("Bearer "),
      }

      console.log("Token information:", tokenInfo)

      // Try to decode the token
      try {
        // Remove Bearer prefix if present
        const actualToken = token.startsWith("Bearer ") ? token.substring(7) : token

        // Split the token into parts
        const parts = actualToken.split(".")
        if (parts.length !== 3) {
          console.error("Not a valid JWT token format")
          return { success: false, error: "Token is not in valid JWT format" }
        }

        // Decode the payload (middle part)
        const payload = JSON.parse(atob(parts[1]))
        console.log("Decoded token payload:", payload)

        // Check expiration
        if (payload.exp) {
          const expirationDate = new Date(payload.exp * 1000)
          const now = new Date()
          if (expirationDate < now) {
            console.error("Token has expired")
            return { success: false, error: `Token expired on ${expirationDate.toLocaleString()}` }
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error)
        return { success: false, error: `Error decoding token: ${error.message}` }
      }

      // Test a simple OPTIONS request to check CORS
      const apiBaseUrl = "https://localhost:8084"
      const corsTestUrl = `${apiBaseUrl}/api/auth/test`

      console.log("Testing CORS with OPTIONS request...")

      const corsResponse = await fetch(corsTestUrl, {
        method: "OPTIONS",
        headers: {
          Origin: window.location.origin,
        },
      })

      console.log("CORS test response:", {
        status: corsResponse.status,
        statusText: corsResponse.statusText,
        headers: Object.fromEntries([...corsResponse.headers.entries()]),
      })

      // Check if the server is accepting our origin
      const allowOrigin = corsResponse.headers.get("Access-Control-Allow-Origin")
      if (!allowOrigin) {
        console.error("CORS issue: No Access-Control-Allow-Origin header")
        return { success: false, error: "CORS Issue: Server is not allowing requests from this origin" }
      } else {
        console.log("Server allows requests from:", allowOrigin)
      }

      return { success: true, message: "Authentication debugging complete. Check console for details." }
    } catch (error) {
      console.error("Error during authentication debugging:", error)
      return { success: false, error: `Debugging error: ${error.message}` }
    }
  }

  // Get debug info
  const getDebugInfo = () => {
    const token = localStorage.getItem("token")
    const expiration = localStorage.getItem("tokenExpiration")
    const role = localStorage.getItem("userRole")
    const lastLoginResponse = localStorage.getItem("lastLoginResponse")
    const email = localStorage.getItem("userEmail")

    return {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 15)}...` : "None",
      tokenLength: token ? token.length : 0,
      expiration: expiration ? new Date(Number.parseInt(expiration)).toLocaleString() : "None",
      role: role || "None",
      email: email || "None",
      lastLoginResponse: lastLoginResponse || "None",
    }
  }

  return {
    debugAuthenticationIssue,
    getDebugInfo,
  }
}
