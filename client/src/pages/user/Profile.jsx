import { Loader } from "../../components/common/Elements";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// this is profile page of quickchat service
export const Profile = () => {
  const { user, loading, logout } = useAuth();
  console.log(user)
  const navigateTo = useNavigate();

  if (loading) {
    return <Loader />;
  }

  async function handleLogout() {
    const user_logout = confirm("Are you want to logout from this account?");

    if (user_logout) {
      await logout();
      navigateTo("/", { replace: true });
    }
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1> This is a QuickChat Profile Page! </h1>
      <div className="flex flex-col items-center justify-center">
        {/* profile page  */}
        <img
          className="w-70 h-70 rounded-full my-2"
          onError={(event)=> {
            event.target.src = "/default_avatar.jpeg";
          }}
          src={user?.avatars?.image_path || "/default_avatar.jpeg"}
          alt={ user?.avatars?.file_name || "User"}
          title={user?.profile?.username}
        />
        {/* profile username */}
        <h1 className="font-bold text-4xl capitalize mb-4"> {user?.profile?.username || "User"} </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-3 outline-0 rounded-2xl cursor-pointer hover:opacity-60"
        >logout</button>
      </div>
    </div>
  );
};
