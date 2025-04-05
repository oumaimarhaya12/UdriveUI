"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase" // Importez auth au lieu de app

// Créer le contexte d'authentification
const AuthContext = createContext()

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  return useContext(AuthContext)
}

// Fournisseur du contexte d'authentification
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Function to login with username/password via API
  async function login(userData) {
    // Store user data in state
    setCurrentUser(userData)
    return userData
  }

  // Fonction pour se connecter avec Google
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      return result
    } catch (error) {
      console.error("Erreur de connexion Google:", error)
      throw error
    }
  }

  // Fonction pour se déconnecter
  async function signOut() {
    try {
      // Clear user data from state
      setCurrentUser(null)

      // If using Firebase auth, also sign out there
      if (auth) {
        await firebaseSignOut(auth)
      }
    } catch (error) {
      console.error("Erreur de déconnexion:", error)
      throw error
    }
  }

  // Effet pour surveiller l'état d'authentification
  useEffect(() => {
    // Check for existing auth data in localStorage on initial load
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")

    if (token && userRole) {
      // Create user data based on token and role
      const userData = {
        token: token,
        role: userRole,
        // Add other user data as needed
      }
      setCurrentUser(userData)
    }

    // If using Firebase auth, also listen for auth state changes
    let unsubscribe = () => {}
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser((prev) => prev || user)
        }
        setLoading(false)
      })
    } else {
      setLoading(false)
    }

    // Nettoyer l'écouteur lors du démontage
    return unsubscribe
  }, [])

  // Valeur du contexte
  const value = {
    currentUser,
    login,
    signInWithGoogle,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

// Export par défaut du Provider pour ceux qui préfèrent l'importer ainsi
export default AuthProvider

