
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


  // state for searchUserWindow 
  const [swUsername, setSWUsername] = useState("")
  const [searchUserWindow, OpenSearchUsersWindow] = useState(false);
  const [userListAfterSearch, setUserListAfterSearch] = useState([]);
  const [enableUserListView, setEnableUserListView] = useState(false);
  
  function handleSetSWUsername(event) {
    setSWUsername(event.target.value);
  }

  function resetStates() {
    setSWUsername("");
    OpenSearchUsersWindow(false);
    setUserListAfterSearch([]);
    setEnableUserListView(false);
  }


  async function getAllFriends() {
    const response = await api.get('/chat/user/friends');
    setFriends(response?.data?.users)
  }

  async function handleFetchUserList() {
    const response = await api.get(`/chat/user/search/${swUsername}`);

    console.log(response?.data?.results)
    setEnableUserListView(true);
    setUserListAfterSearch(response?.data?.results);
  }

  function connectToSocket() {
    socket.on('conenction', () => {
      setSocketID(socket.id);
      console.log("Connected:: " + socketID)
    });

    socket.emit("welcome", "hello from harmin")
  }

  // effects 
  useEffect(() => {
    connectToSocket();
    getAllFriends();
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
  
  // this functional component return this XML code 
  return (
    <div className="flex">
      {/* chat controls and list  */}
      {
        !searchUserWindow ?
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
                      onClick={() => {
                        searchUserWindow == false ? OpenSearchUsersWindow(true) : OpenSearchUsersWindow(false)
                      }}
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
                        console.log(
                          obj.users?.id,
                          obj?.users?.profile?.username,
                          obj?.users?.avatars?.image_path
                        )
                        return (
                          <li onClick={() => { handleOpenChat(obj?.users?.profile?.username, obj?.users?.avatars?.image_path) }} key={`friend-${index}`} className="border-b flex items-center gap-5 px-10 py-2 hover:cursor-pointer">
                            <img className="w-12 h-12 border rounded-full shadow bg-cover" src={`${obj?.users?.avatars?.image_path}`} alt={`avatar-${index}`} />
                            <span> {obj?.users?.profile?.username} </span>
                          </li>
                        )
                      })
                    }
                  </>
              }
            </div>
          </div>
          :
          <div className='w-90'>
            <Navbar />
            {/* Container for the input and its result list of user */}
            <div style={{ height: `calc(100vh - 56px)` }}
              className='w-full flex flex-col'>

              <div className='w-full flex items-center bg-[#f5f5f5] shadow px-2'>

                <button onClick={() => {
                  OpenSearchUsersWindow(false)
                  resetStates()
                }} className='rounded-full hover:cursor-pointer'>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f" ><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                </button>

                {/* input element that takes username */}
                <input
                  type="text"
                  placeholder='Search User by name'
                  className='flex-1 px-2 py-1 outline-0 text-xl'
                  value={swUsername}
                  onChange={(event) => handleSetSWUsername(event)}
                />

                <button className='p-2 rounded-full hover:cursor-pointer' onClick={handleFetchUserList}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="32px" width="32px" fill="#1f1f1f"><path d="M19.6,21l-6.3-6.3q-0.75,0.6-1.72,0.95T9.5,16q-2.72,0-4.61-1.89Q3,12.23 3,9.5Q3,6.77 4.89,4.89T9.5,3t4.61,1.89T16,9.5q0,1.1-0.35,2.07T14.7,13.3L21,19.6L19.6,21ZM9.5,14q1.88,0 3.19-1.31T14,9.5T12.69,6.31T9.5,5T6.31,6.31T5,9.5t1.31,3.19T9.5,14Z" /></svg>
                </button>
              </div>

              {
                enableUserListView ?
                  <div>
                    {
                      userListAfterSearch.length == 0 ?
                        <p className='px-1 py-4 text-center'> No records are found, <br/> who contain "{swUsername}" in username </p> :
                        <>
                          {
                            userListAfterSearch.map((ele, index) => {
                              return <div onClick={() => {
                                handleOpenChat(ele?.username, ele?.users?.avatars?.image_path)
                              }} className='flex items-center gap-2 px-5 py-4 hover:bg-[#f5f5f5] hover:cursor-pointer' key={`user-${index}`}>
                                <img className='w-10 h-10 rounded-full bg-cover shadow' src={ele.users.avatars.image_path} alt="" />
                                <span> {ele.username} <b> {user.user_id == ele.users.id ? "(You)" : ""}</b>  </span>
                              </div>
                            })
                          }                         
                        </>
                    }
                  </div>
                  : <> </>
              }
            </div>
          </div>
      }

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
