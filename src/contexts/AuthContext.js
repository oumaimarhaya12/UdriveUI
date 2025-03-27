import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "../firebase"; // Importez auth au lieu de app

// Créer le contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  return useContext(AuthContext);
}

// Fournisseur du contexte d'authentification
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour se connecter avec Google
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      console.error("Erreur de connexion Google:", error);
      throw error;
    }
  }

  // Fonction pour se déconnecter
  async function signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      throw error;
    }
  }

  // Effet pour surveiller l'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Nettoyer l'écouteur lors du démontage
    return unsubscribe;
  }, []);

  // Valeur du contexte
  const value = {
    currentUser,
    signInWithGoogle,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Export par défaut du Provider pour ceux qui préfèrent l'importer ainsi
export default AuthProvider;