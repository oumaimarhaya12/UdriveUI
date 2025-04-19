"use client"

import { useState } from "react"

export function useTokenFormats() {
  const [tokenFormats, setTokenFormats] = useState({
    raw: "",
    withBearer: "",
    withoutBearer: "",
  })

  // Update token formats
  const updateTokenFormats = () => {
    const token = localStorage.getItem("token")
    if (token) {
      const withBearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`
      const withoutBearer = token.startsWith("Bearer ") ? token.substring(7) : token

      setTokenFormats({
        raw: token,
        withBearer,
        withoutBearer,
      })
    }
  }

  // Try different token formats for API calls
  const tryDifferentTokenFormats = async (url, method = "GET", body = null) => {
    // Get the raw token
    const rawToken = localStorage.getItem("token")
    if (!rawToken) {
      return {
        success: false,
        results: [{ format: "No token", status: "Error", error: "No token found in localStorage" }],
      }
    }

    // Create different format versions
    const formats = [
      {
        name: "With Bearer prefix",
        token: `Bearer ${rawToken}`,
      },
      {
        name: "Without Bearer prefix",
        token: rawToken,
      },
      {
        name: "Raw token",
        token: rawToken,
      },
    ]

    const results = []

    for (const format of formats) {
      try {
        console.log(`Trying ${format.name}:`, format.token.substring(0, 20) + "...")

        const fetchOptions = {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: format.token,
          },
          credentials: "include",
        }

        // Add body if provided
        if (body) {
          fetchOptions.body = JSON.stringify(body)
        }

        const response = await fetch(url, fetchOptions)

        // Log the full response for debugging
        console.log(`Response for ${format.name}:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries([...response.headers.entries()]),
        })

        let responseData
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json()
        } else {
          responseData = await response.text()
        }

        const result = {
          format: format.name,
          status: response.status,
          success: response.ok,
          data: responseData,
        }

        results.push(result)
        console.log(`Result for ${format.name}:`, result)

        if (response.ok) {
          console.log(`Success with ${format.name}!`)
          // Save the successful format to localStorage for future use
          localStorage.setItem("tokenFormat", format.name === "With Bearer prefix" ? "withBearer" : "withoutBearer")
          return { success: true, format: format.name, data: result.data }
        }
      } catch (error) {
        console.error(`Error with ${format.name}:`, error)
        results.push({
          format: format.name,
          status: "Error",
          success: false,
          error: error.message,
        })
      }
    }

    return { success: false, results }
  }

  // Test API connection with different token formats
  const testApiConnection = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        return { success: false, error: "No token found. Please log in again." }
      }

      const apiBaseUrl = "https://localhost:8084"
      const url = `${apiBaseUrl}/api/auth/test`

      console.log("Testing API connection with different token formats...")

      // Try different token formats
      const result = await tryDifferentTokenFormats(url)

      if (result.success) {
        console.log("API Connection Successful", `Connected with format: ${result.format}`)
        return { success: true, message: `Connected with format: ${result.format}` }
      } else {
        console.error("All token formats failed:", result.results)

        // Create a detailed error message
        const errorDetails = result.results.map((r) => `${r.format}: ${r.status} - ${r.error || r.data}`).join("\n")
        return { success: false, error: `API test failed with all token formats. Details:\n${errorDetails}` }
      }
    } catch (error) {
      console.error("API test error:", error)
      return { success: false, error: `API test failed: ${error.message}` }
    }
  }

  // Function to decode JWT token
  const testTokenValidity = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      return { success: false, error: "No token found. Please log in again." }
    }

    try {
      // Remove Bearer prefix if present
      const actualToken = token.startsWith("Bearer ") ? token.substring(7) : token

      // Split the token into parts
      const parts = actualToken.split(".")
      if (parts.length !== 3) {
        return { success: false, error: "Invalid token format. Not a valid JWT token." }
      }

      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]))
      console.log("Decoded token payload:", payload)

      // Check for role information
      const role = payload.role || payload.authorities || payload.scope || "Not found"

      // Check if token is expired
      let expirationMessage = ""
      if (payload.exp) {
        const expirationDate = new Date(payload.exp * 1000)
        const now = new Date()
        if (expirationDate < now) {
          expirationMessage = " (EXPIRED!)"
          return { success: false, error: "Token has expired", payload }
        }
      }

      return {
        success: true,
        message: `Subject: ${payload.sub || "N/A"} | Role: ${role} | Expiration: ${
          payload.exp ? new Date(payload.exp * 1000).toLocaleString() : "N/A"
        }${expirationMessage}`,
        payload,
      }
    } catch (error) {
      console.error("Error decoding JWT:", error)
      return { success: false, error: `Error decoding token: ${error.message}` }
    }
  }

  return {
    tokenFormats,
    updateTokenFormats,
    tryDifferentTokenFormats,
    testApiConnection,
    testTokenValidity,
  }
}
