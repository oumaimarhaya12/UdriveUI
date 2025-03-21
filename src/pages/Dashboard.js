import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div className="dashboard-container" style={{ padding: "2rem" }}>
      <h1>Tableau de Bord</h1>
      <p>Bienvenue sur votre tableau de bord, {currentUser?.displayName || "Utilisateur"}!</p>
      
      {currentUser?.photoURL && (
        <div style={{ marginTop: "1rem" }}>
          <img 
            src={currentUser.photoURL || "/placeholder.svg"} 
            alt="Photo de profil" 
            style={{ 
              width: "50px", 
              height: "50px", 
              borderRadius: "50%" 
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
            cursor: "pointer"
          }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}