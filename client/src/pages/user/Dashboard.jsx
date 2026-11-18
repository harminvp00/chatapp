import { Loader } from "../../components/common/Elements";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "../../components/user/Navbar.jsx";
import { ChatHeader } from "../../components/chat/chatHeader.jsx";
import chat_bg_image from "../../assets/chatscreen-bg.jpg"

export const Dashboard = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader message="Please waits 2 min while we fetching details" />;
  }

  return (
    <div className="flex">

      {/* chat controls and list  */}
      <div className="w-150">

        {/* top navigation for profile, setting, notification and logout  */}
        <Navbar />
        <div className="w-full">
          <button className="w-full bg-[#f1f1f1] p-2 hover:opacity-80 hover:cursor-pointer text-xl">
            Add new friend
          </button>
        </div>
      </div>

      {/* chat screen part  */}
      <div className="flex-1">
        <ChatHeader />

        <div style={{ backgroundImage: `url(${chat_bg_image})`, height: `calc(100vh - 56px)` }} className={`w-full bg-center bg-no-repeat bg-cover`}>

        </div>
      </div>

    </div>
  );
};
