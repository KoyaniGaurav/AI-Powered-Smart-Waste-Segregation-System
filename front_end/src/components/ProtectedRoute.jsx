import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="section-shell pt-36">
        <div className="glass-panel p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
          <p className="mt-4 text-sm text-muted">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
