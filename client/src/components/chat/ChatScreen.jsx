
import { ChatScreenHeader } from "./ChatScreenHeader.jsx";
import chat_bg_image from '../../assets/chatscreen-bg.png'
import { useDashboard } from "../../context/DashboardContext.jsx";

export const ChatScreen = () => {

    const { chatOpen } = useDashboard();

    return (
        <div className="flex-1 border-l">
            {
                !chatOpen ?
                    <div className="h-screen bg-[#F7F5F3] opacity-90 flex flex-col items-center justify-center">
                        <img className="w-50 h-50 " src="chat.png" />
                        <h1 className="text-2xl font-bold"> QuickChat </h1>
                        <p> Connect with your friend and start communicate from today.</p>
                    </div>
                    :
                    <>
                        <ChatScreenHeader />
                        <div style={{ backgroundImage: `url(${chat_bg_image})`, height: `calc(100vh - 56px)` }} className={`w-full bg-center bg-no-repeat bg-cover`}>
                        </div>
                    </>
            }
        </div>
    )
} 