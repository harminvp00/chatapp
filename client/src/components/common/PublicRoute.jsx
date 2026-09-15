
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = ({ user }) => {

    if (user) {
        return <Navigate to="/dashboard" replace />;
    } 
    
    return <Outlet />;
};
