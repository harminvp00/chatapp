import { Loader } from "../../components/common/Elements";
import { useAuth } from "../../context/AuthContext";
import { ChatList } from "../chat/ChatList";
import { Sidebar } from "../../components/common/Sidebar";
export const Dashboard = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader message="Please waits 2 min while we fetching details" />;
  }

  return (
    <div className="flex flex-col">
      <Sidebar />

      <div className="w-full">
 	      <ChatList/>	
      </div>

    </div>
  );
};
