
import { Loader } from "../../components/common/Elements";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { Sidebar } from '../../components/user/Sidebar.jsx';
import { ChatScreen } from '../../components/chat/ChatScreen.jsx';
import { useDashboard } from "../../context/DashboardContext.jsx";


export const Dashboard = () => {

  const { loading, user } = useAuth();
  const { connectToSocket } = useDashboard();
  
  // loader condition if user not load
  if (loading) {
    return <Loader message="Please waits 2 min while we fetching details" />;
  }

  useEffect(() => {
    connectToSocket();
  }, []);

  return (
    <div className="flex">
        <Sidebar />
        <ChatScreen />
    </div>
  );
};
