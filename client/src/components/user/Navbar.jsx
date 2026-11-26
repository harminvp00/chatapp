// this is naviagation bar of the quick chat application.

import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { user } = useAuth();

  const navigateTo = useNavigate();

   return (
    <nav className="w-full p-3 flex items-center justify-start gap-2 bg-blue-500 text-white">

      <span className="font-bold text-xl"> QuickChat </span>


      <div className="flex-1 flex items-center justify-end gap-2">
        <button
          onClick={() => {
            navigateTo('/profile')
          }}
          type="button"
          className="hover:opacity-50 cursor-pointer"
          title={user?.profile?.username || "User"}
        >
          <img
            className="w-8 h-8 rounded-full"
            onError={(event) => {
              event.target.src = "/default_avatar.jpeg";
            }}
            src={user?.avatars?.image_path || "/default_avatar.jpeg"}
            alt={user?.avatars?.file_name || "User"}
            title={user?.profile?.username || "'User"}
          />
        </button>
      </div>
    </nav>
  );
};
