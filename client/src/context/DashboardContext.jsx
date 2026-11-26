
import { createContext, useContext } from "react"
import { useState, useMemo } from "react";
import { io } from 'socket.io-client';
import api from "../api/api.js";
import { useAuth } from "./AuthContext.jsx";

const DashboardContext = createContext();

export default function DashboardProvider({ children }) {
    const socket = useMemo(() => io("http://localhost:3000"), [])

    const { user } = useAuth();
    // states
    const [socketID, setSocketID] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [userInChat, setUserInChat] = useState(null);
    const [swUsername, setSWUsername] = useState("")
    const [userListAfterSearch, setUserListAfterSearch] = useState([]);
    const [enableUserListView, setEnableUserListView] = useState(false);


    async function handleFetchUserList() {
        const response = await api.get(`/chat/user/search/${swUsername}`);
        setEnableUserListView(true);
        setUserListAfterSearch(response?.data?.results);
    }

    async function createConversation(member1, member2) {
        const response = await api.post(`/chat/user/conversation/create`, {
            member1, member2, conversations_ids: user?.conversation_members.map(ele => ele.conversation_id)
        });
    }

    function connectToSocket() {
        socket.on('conenction', () => {
            setSocketID(socket.id);
            console.log("Connected:: " + socketID)
        });

        socket.emit("welcome", "hello from harmin")
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

    function handleChatClose() {
        // this method is close the open chat in dashboard 
        setChatOpen(false);
        setUserInChat(null);
    }

    function resetStates() {
        setSWUsername("");
        OpenSearchUsersWindow(false);
        setUserListAfterSearch([]);
        setEnableUserListView(false);
    }

    return (
        <DashboardContext.Provider
            value={{
                socketID, chatOpen, userInChat, swUsername, setSWUsername, userListAfterSearch, enableUserListView,
                handleFetchUserList, connectToSocket, createConversation, handleOpenChat, handleChatClose, resetStates,
            }}>

            {children}

        </DashboardContext.Provider>
    )
}

export const useDashboard = () => {
    const dashboard_context = useContext(DashboardContext);

    if (!dashboard_context) {
        throw new Error("useDashboard must be used inside AuthProvider")
    }

    return dashboard_context;
}