import { Loader } from "../components/common/Elements";
import { useAuth } from "../context/AuthContext";
import logout_src from "../assets/app/logout.svg";
import { useState } from "react";
import default_avatar from "/default_avatar.jpeg";

export const Dashboard = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <Loader message="Please waits 2 min while we fetching details" />;
  }

  const [imgSrc, setImgSrc] = useState(user.imagePath);
  console.log(user.imagePath);

  const handleImageError = () => {
    setImgSrc("/default_avatar.jpeg");
  };


  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl text-blue-500">Dashboard</h1>

      <div>
        <img
          className="w-50 h-50 rounded-full"
          onError={handleImageError}
          src={imgSrc || default_avatar}
          alt="profile_picture"
          title={user.username}
        />
        <p> {user.username} </p>
        <p> {user.email} </p>
        <p> {user.role} </p>
      </div>

      <button
        onClick={logout}
        className="border px-5 py-2 flex items-center justify-center gap-2 cursor-pointer bg-blue-500 text-white rounded-xl "
      >
        <img src={logout_src} alt="" />
        Logout
      </button>
    </div>
  );
};
