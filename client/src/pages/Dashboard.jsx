import { Loader } from "../components/common/Elements";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
export const Dashboard = () => {
  const { user, loading, logout } = useAuth();

  const [imageSrc, setImageSrc] = useState(user.imagePath);
  if (loading) {
    return <Loader message="Please waits 2 min while we fetching details" />;
  }

  const handleImageError = () => {
    setTimeout(() => {
      setImageSrc(`${imageSrc}?retry=${Date.now()}`);
    }, 1000);
  };
  // alert(JSON.stringify(user))
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl text-blue-500">Dashboard</h1>

      <div>
        {/* http://localhost:3000/auth/avatar/4ebc5513-294c-4877-94e5-3e6cad18f63a.jpeg */}
        <img onError={handleImageError} src={imageSrc} />
        <p> {user.username} </p>
        <p> {user.email} </p>
        <p> {user.role} </p>
      </div>

      <button
        onClick={logout}
        className="border px-5 py-2 cursor-pointer bg-blue-500 text-white rounded-xl "
      >
        Logout
      </button>
    </div>
  );
};
