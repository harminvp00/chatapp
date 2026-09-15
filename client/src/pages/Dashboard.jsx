import { useAuth } from "../context/AuthContext";

export const Dashboard = () => {
  
  const {user, loading, logout} = useAuth();
  return (
    <div className="h-screen flex flex-col justify-center items-center">
    
      <h1 className="text-3xl text-blue-500">Dashboard</h1>
      <p> welcome 
          <b> {user.username} </b>
      </p> 
     
      <button onClick={logout} className="border px-5 py-2 cursor-pointer bg-blue-500 text-white rounded-xl ">
        Logout
      </button>
    </div>
  );
};
