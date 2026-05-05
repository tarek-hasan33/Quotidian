import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-600"
          aria-label="Loading"
          role="status"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
