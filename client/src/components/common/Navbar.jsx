// this is naviagation bar of the quick chat application.

import { useAuth } from "../../context/AuthContext";
import {
  ChatSVG,
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
    <nav className="w-fit h-screen py-5 px-4 flex flex-col items-center justify-start gap-2 bg-blue-500 text-white">
      {/* Chat Icon */}
      <button type="button" className="hover:opacity-50" onClick={null}>
        <ChatSVG fill={"#f5f5f5"} />

        {/* Notifications */}
      </button>
      <button type="button" className="hover:opacity-50" onClick={null}>
        <NotificationSVG fill={"#f5f5f5"} />
      </button>

      {/* Account */}
      <button type="button" className="hover:opacity-50" onClick={null}>
        <SettingSVG fill={"#f5f5f5"} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-end gap-2">
        <button
          type="button"
          className="hover:opacity-50 cursor-pointer"
          title="logout"
          onClick={handleLogoutUser}
        >
          <LogoutSVG fill={"#fff"} />
        </button>
        <button
          type="button"
          className="hover:opacity-50 cursor-pointer"
          title={user.username}
        >
          <img className="w-8 h-8 rounded-full" src={user.imagePath} alt="" />
        </button>
      </div>
    </nav>
  );
};
