
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ user }) => {
  const location = useLocation();


  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet/>;
};
