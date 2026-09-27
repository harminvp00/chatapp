import { Loader } from "../../components/common/Elements";
import { useAuth } from "../../context/AuthContext";

// this is profile page of quickchat service
export const Profile = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1> This is a QuickChat Profile Page! </h1>
      <div className="flex flex-col items-center justify-center">
        {/* profile page  */}
        <img
          className="w-30 h-30 rounded-full my-2"
          src={user.imagePath}
          alt={user.username}
          title={user.username}
        />
        {/* profile username */}
        <h1> {user.username} </h1>
      </div>
    </div>
  );
};
