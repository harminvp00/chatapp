
import { io } from 'socket.io-client';
import api from "../../api/api.js";
import { Loader } from "../../components/common/Elements";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from 'react';
import { Sidebar } from '../../components/user/Sidebar.jsx';
import { ChatScreen } from '../../components/chat/ChatScreen.jsx';
export const Dashboard = () => {

  const socket = useMemo(() => io("http://localhost:3000"), [])

  const { user, loading } = useAuth();
  // states
  const [socketID, setSocketID] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [userInChat, setUserInChat] = useState(null);
  const [swUsername, setSWUsername] = useState("")
  const [searchUserWindow, OpenSearchUsersWindow] = useState(false);
  const [userListAfterSearch, setUserListAfterSearch] = useState([]);
  const [enableUserListView, setEnableUserListView] = useState(false);

  // effects 
  useEffect(() => {
    connectToSocket();
  }, []);

  async function handleFetchUserList() {
    const response = await api.get(`/chat/user/search/${swUsername}`);
    setEnableUserListView(true);
    setUserListAfterSearch(response?.data?.results);
  }

  async function createConversation(member1, member2) {
    const response = await api.post(`/chat/user/conversation/create`, {
      member1, member2, conversations_ids: user?.conversation_members.map(ele => ele.conversation_id)
    });

    console.log(response?.data)
    _friendsIDs(user.friends.map(ele => ele.users.id));
  }
  function connectToSocket() {
    socket.on('conenction', () => {
      setSocketID(socket.id);
      console.log("Connected:: " + socketID)
    });

    socket.emit("welcome", "hello from harmin")
  }

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
      <Sidebar
        swUsername={swUsername}
        setSWUsername={setSWUsername}
        searchUserWindow={searchUserWindow}
        OpenSearchUsersWindow={OpenSearchUsersWindow}
        userListAfterSearch={userListAfterSearch}
        setUserListAfterSearch={setUserListAfterSearch}
        enableUserListView={enableUserListView}
        setEnableUserListView={setEnableUserListView}
        handleFetchUserList={handleFetchUserList}
        handleOpenChat={handleOpenChat}
      />

      <ChatScreen
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        userInChat={userInChat}
        setUserInChat={setUserInChat}
      />
      
    </div>
  );
};
