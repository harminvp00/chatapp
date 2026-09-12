
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <h1> Loading... </h1>
      </div>
    );
  }

  if (!user) {
    return <div> No User </div>;
  }

  return children;
};