import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export const Dashboard = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  if(!user){
    return null;
  }
  
  return (
    <div>
      <h1 className="text-3xl text-blue-500">Dashboard</h1>
      <p> welcome {user.username} </p>
    </div>
  );
};
