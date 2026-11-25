  // this is naviagation bar of the quick chat application.

  import { useAuth } from "../../context/AuthContext.jsx";
  import { useNavigate } from "react-router-dom";

  export const Navbar = ({
    setSWUsername,
    searchUserWindow,
    OpenSearchUsersWindow,
    setUserListAfterSearch,
    setEnableUserListView }) => {
    const { user, logout } = useAuth();

    const navigateTo = useNavigate();

    const handleLogoutUser = async () => {
      const wantLogout = confirm("Are you want to Logout from this device?");

      if (wantLogout) {
        await logout();
        navigateTo("/", { replace: true });
      }
    };


    return (
      <nav className="w-full p-3 flex items-center justify-start gap-2 bg-blue-500 text-white">

        <span className="font-bold text-xl"> QuickChat </span>
   

        <div className="flex-1 flex items-center justify-end gap-2">
          <svg
            onClick={() => {
              searchUserWindow === false ? OpenSearchUsersWindow(true) : OpenSearchUsersWindow(false)
              setSWUsername("");
              setEnableUserListView(false);
              setUserListAfterSearch([]);
            }}
            // onClick={ !searchUserWindow ? OpenSearchUsersWindow(true) : OpenSearchUsersWindow(false)}
            className="hover:opacity-80 hover:cursor-pointer"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="28px" width="28px" fill="#f5f5f5"><path d="M19.6,21l-6.3-6.3q-0.75,0.6-1.72,0.95T9.5,16q-2.72,0-4.61-1.89Q3,12.23 3,9.5Q3,6.77 4.89,4.89T9.5,3t4.61,1.89T16,9.5q0,1.1-0.35,2.07T14.7,13.3L21,19.6L19.6,21ZM9.5,14q1.88,0 3.19-1.31T14,9.5T12.69,6.31T9.5,5T6.31,6.31T5,9.5t1.31,3.19T9.5,14Z" /></svg>
          
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
