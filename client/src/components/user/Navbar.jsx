// this is naviagation bar of the quick chat application.

import { useAuth } from "../../context/AuthContext.jsx";
import {
  LogoutSVG,
  NotificationSVG,
  SettingSVG,
} from "../../assets/svgs/SVGs.jsx";
import { replace, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigateTo = useNavigate();
  const handleLogoutUser = async () => {
    const wantLogout = confirm("Are you want to Logout from this device?");

    if (wantLogout) {
      await logout();
      navigateTo("/", replace);
    }
  };

  return (
    <nav className="w-full p-3 flex items-center justify-start gap-2 bg-blue-500 text-white">

      {/* List of the function into the navigation bar  */}
      <SettingSVG fill={"#f5f5f5"} />
      <NotificationSVG fill={"#f5f5f5"} />

      <div className="flex-1 flex items-center justify-end gap-2">
        <button
          onClick={() => {
            navigateTo('/profile')
          }}
          type="button"
          className="hover:opacity-50 cursor-pointer"
          title={user.username}
        >
          <img
            className="w-8 h-8 rounded-full"
            onError={(event) => {
              event.target.src = "/default_avatar.jpeg";
            }}
            src={user.imagePath || "/default_avatar.jpeg"}
            alt={user.username}
            title={user.username}
          />
        </button>

        <button
          type="button"
          className="hover:opacity-50 cursor-pointer"
          title="logout"
          onClick={handleLogoutUser}
        >
          <LogoutSVG fill={"#fff"} />
        </button>
      </div>
    </nav>
  );
};
