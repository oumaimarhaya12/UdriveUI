// components/PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Si l'authentification est en cours de chargement, afficher un indicateur de chargement
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, afficher le contenu protégé
  return children;
};

export default PrivateRoute;