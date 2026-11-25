import { Loader } from "../../components/common/Elements";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Profile Components 

import { ProfileHeader } from "../../components/user/ProfileHeader.jsx";
import { ProfilePicture } from "../../components/user/ProfilePicture.jsx";

// this is profile page of quickchat service
export const Profile = () => {
  const { user, loading, logout } = useAuth();

  console.log(user)
  const navigateTo = useNavigate();

  if (loading) {
    return <Loader message={"Loading your profile details"} />;
  }

  async function handleLogout() {
    const user_logout = confirm("Are you want to logout from this account?");

    if (user_logout) {
      await logout();
      navigateTo("/", { replace: true });
    }
  }

  return (
    <div className="h-screen bg-[#FFFFFF]">
      <ProfileHeader />
      <ProfilePicture />
    </div>
  );
};
