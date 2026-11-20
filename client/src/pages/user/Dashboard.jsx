
import { io } from 'socket.io-client';
import api from "../../api/api.js";
import { Loader } from "../../components/common/Elements";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "../../components/user/Navbar.jsx";
import { ChatHeader } from "../../components/chat/chatHeader.jsx";
import chat_bg_image from "../../assets/chatscreen-bg.jpg"
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from 'react';

export const Dashboard = () => {

  const socket = useMemo(() => io("http://localhost:3000"), [])
  // states
  const { user, loading } = useAuth();
  const [socketID, setSocketID] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [userInChat, setUserInChat] = useState(null);
  const [friends, setFriends] = useState([]);



  function connectToSocket() {
    socket.on('conenction', () => {
      setSocketID(socket.id);
      console.log("Connected:: " + socketID)
    });

    socket.emit("welcome", "hello from harmin")
  }

  // effects 
  useEffect(() => {
    // this is for handle fetching friends from users
    handleFetchFriend();
    connectToSocket();
  }, []);

  // loader condition
  if (loading) {
    return <Loader message="Please waits 2 min while we fetching details" />;
  }

  // handle open chat  
  const handleOpenChat = (uname, image) => {
    setUserInChat(null); // set the user null
    setChatOpen(true)
    setUserInChat({
      uname,
      image
    })
  }

 

  // handle fetch friends
  const handleFetchFriend = async () => {
    const _friends = await api.get("/chat/user/list");
    setFriends(_friends?.data?.users);
  }

  // this functional component return this XML code 
  return (
    <div className="flex">
      {/* chat controls and list  */}
      <div className="w-90">
        {/* top navigation for profile, setting, notification and logout  */}
        <Navbar />

        <div className="">
          {
            friends.length === 0 ?
              <div className='flex flex-col items-center justify-center h-50 bg-[#f5f5f5]'>
               
                {/* user intruction  */}
                <p className="text-center"> You did not have any friends yet </p>

                {/* button for the find friends  */}
                <button
                  onClick={null}
                  className='bg-blue-500 text-white py-2 px-4 rounded-2xl my-2  hover:cursor-pointer'
                  onMouseEnter={ele => {
                    ele.target.style.filter = "brightness(90%)";
                    ele.target.style.fontWeight = 'bold';
                  }}
                  onMouseLeave={ele => {
                    ele.target.style.filter = "brightness(100%)"
                    ele.target.style.fontWeight = 'normal';
                  }}
                > find friends? </button>
              </div> :
              <>
                {
                  friends.map((obj, index) => {
                    if (obj.id === user.user_id) {
                      return null;
                    }
                    return (
                      <li onClick={() => { handleOpenChat(obj?.profile?.username, obj?.avatars?.image_path) }} key={`friend-${index}`} className="border-b flex items-center gap-5 px-10 py-2 hover:cursor-pointer">
                        <img className="w-12 h-12 border rounded-full shadow bg-cover" src={`${obj?.avatars?.image_path}`} alt={`avatar-${index}`} />
                        <span> {obj?.profile?.username} </span>
                      </li>
                    )
                  })
                }
              </>
          }
        </div>
      </div>

      {/* chat screen part  */}
      <div className="flex-1 border -l">
        {
          !chatOpen ?
            <div className="h-screen bg-[#f5f5f5] opacity-90 flex flex-col items-center justify-center">
              <img className="w-50 h-50 " src="chat.png" />
              <h1 className="text-2xl font-bold"> QuickChat </h1>
              <p> Connect with your friend and start communicate from today.</p>
            </div>
            :
            <>
              <ChatHeader setUserInChat={setUserInChat} setChatOpen={setChatOpen} picture={userInChat?.image} username={userInChat?.uname} />
              <div style={{ backgroundImage: `url(${chat_bg_image})`, height: `calc(100vh - 56px)` }} className={`w-full bg-center bg-no-repeat bg-cover`}>
              </div>
            </>
        }
      </div>
    </div>
  );
};
