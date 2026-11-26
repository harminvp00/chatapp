import { Loader } from "../../components/common/Elements";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Profile Components 

import { ProfileHeader } from "../../components/user/ProfileHeader.jsx";
import { ProfilePicture } from "../../components/user/ProfilePicture.jsx";
import { ProfileDetails } from "../../components/user/ProfileDetails.jsx";

export const Profile = () => {
  const { loading } = useAuth();
  if (loading) {
    return <Loader message={"Loading your profile details"} />;
  }

 

  return (
    <div className="w-full h-screen bg-[#FFFFFF]">
      <ProfileHeader />
      <ProfilePicture />
      <ProfileDetails/>
    </div>
  );
};
