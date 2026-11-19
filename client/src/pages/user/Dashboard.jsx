
import api from "../../api/api.js";
import { Loader } from "../../components/common/Elements";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "../../components/user/Navbar.jsx";
import { ChatHeader } from "../../components/chat/chatHeader.jsx";
import chat_bg_image from "../../assets/chatscreen-bg.jpg"
import { useState } from "react";
import { useEffect } from "react";
export const Dashboard = () => {
  const { user, loading } = useAuth();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    handleFetchFriend();
  }, []);


  if (loading) {
    return <Loader message="Please waits 2 min while we fetching details" />;
  }

  const handleConversation = async () => {
    const response = await api.post('chat/conversation/create', {
      sender_id: user.user_id
    });

    const data = response?.data;

    if (!response.success) {
      console.log(data.message)
    }
  }

  const handleFetchFriend = async () => {
    const _friends = await api.get("/chat/user/list");
    setFriends(_friends?.data?.users);
  }
  return (
    <div className="flex">

      {/* chat controls and list  */}
      <div className="w-150">

        {/* top navigation for profile, setting, notification and logout  */}
        <Navbar />
        <div className="w-full">
          <button type="button" onClick={handleConversation} className="w-full bg-[#f1f1f1] p-2 hover:opacity-80 hover:cursor-pointer text-xl">
            Add new friend
          </button>
        </div>

        <div className="text-xl">
          {
            friends.length === 0 ?
              <span className="text-center"> You did not have any friends yet </span> :
              <>
                {
                  friends.map((obj, index) => {
                    if (obj.id === user.user_id) {
                      return null;
                    }
                    return (
                      <li key={`friend-${index}`} className="border-b flex items-center gap-3 px-10 py-2">
                        <img className="w-12 h-12 border rounded-full shadow bg-cover" src={`${obj?.avatars?.image_path}`} alt={`avatar-${index}`} />
                        <span> {obj?.profile?.username} </span>
                        <button type="button" className="ms-auto bg-blue-400 text-white rounded-2xl p-2 hover:cursor-pointer" onClick={handleConversation}> send </button>
                      </li>
                    )
                  })
                }

              </>
          }
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
