
import { useAuth } from "../../context/AuthContext";
import { Chat } from "../../components/user/Chat.jsx";

export const ChatList = () => {
  const { user } = useAuth();
  return (
    <div>
      <Chat />
    </div>
  );
};
