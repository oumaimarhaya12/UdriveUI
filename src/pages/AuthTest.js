// src/pages/AuthTest.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/UserProfile.css"; // Utilise les styles que nous avons créés

function AuthTest() {
  const { currentUser, signInWithGoogle, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      console.log("Connexion Google réussie!");
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Échec de la connexion: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      console.log("Déconnexion réussie!");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      setError("Échec de la déconnexion: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <div className="user-profile-header">
          <h2>Test d'authentification Google</h2>
          <p>Utilisez cette page pour tester la connexion Google</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: "rgba(244, 67, 54, 0.1)", 
            color: "#f44336", 
            padding: "10px", 
            borderRadius: "8px", 
            marginBottom: "20px" 
          }}>
            {error}
          </div>
        )}

        {currentUser ? (
          <div>
            <div className="user-profile-header">
              <img 
                src={currentUser.photoURL || "/placeholder.svg"} 
                alt="Avatar" 
                className="user-avatar" 
              />
              <h2>{currentUser.displayName || "Utilisateur"}</h2>
              <p>{currentUser.email}</p>
            </div>

            <div className="user-profile-details">
              <div className="detail-item">
                <span className="detail-label">ID Utilisateur:</span>
                <span className="detail-value user-id">{currentUser.uid}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email vérifié:</span>
                <span className="detail-value">
                  {currentUser.emailVerified ? "Oui ✓" : "Non ✗"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Méthode de connexion:</span>
                <span className="detail-value">Google</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Dernière connexion:</span>
                <span className="detail-value">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>

            <div className="user-actions">
              <button 
                onClick={handleSignOut} 
                disabled={loading}
                className="user-action-button danger"
              >
                {loading ? "Déconnexion..." : "Se déconnecter"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p>Vous n'êtes pas connecté</p>
            <button 
              onClick={handleGoogleSignIn} 
              disabled={loading}
              className="user-action-button primary"
              style={{ margin: "20px auto", display: "flex", justifyContent: "center" }}
            >
              {loading ? "Connexion..." : "Se connecter avec Google"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthTest;