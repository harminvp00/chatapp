

import { Loader } from "../../components/common/Elements";
import { useAuth } from "../../context/AuthContext";

// Profile Components 
import { ProfileHeader } from "../../components/user/ProfileHeader.jsx";
import { ProfilePicture } from "../../components/user/ProfilePicture.jsx";
import { ProfileDetails } from "../../components/user/ProfileDetails.jsx";
import { ProfileEdit } from "../../components/user/ProfileEdit.jsx";

import { useProfile } from "../../context/ProfileContext.jsx";

// Profile page 
export const Profile = () => {
  const { loading } = useAuth();
  const { profileEditMode } = useProfile();
  if (loading) {
    return <Loader message={"Loading your profile details"} />;
  }

  return (
    <div className="w-full h-screen bg-[#FFFFFF]">
      <ProfileHeader />
      {
        !profileEditMode ?
          <>
            <ProfilePicture />
            <ProfileDetails />
          </> :
          <ProfileEdit />
      }
    </div>
  );
};
