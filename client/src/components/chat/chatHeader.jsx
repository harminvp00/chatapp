

import { CloseSVG, SettingSVG } from '../../assets/svgs/SVGs.jsx';

export function ChatHeader({ setUserInChat, setChatOpen, picture ="default_avatar.jpeg", username="user" }) {

    function handleChatClose() {
        // this method is close the open chat in dashboard 
        setChatOpen(false);
        setUserInChat(null);
    }


    return (
        <header className='flex items-center gap-3 p-3 bg-[#f5f5f5] '>
            <CloseSVG fill={"#000"} callMethod={handleChatClose} />
            <img className='w-8 h-8 rounded-full' src={picture} alt="" />
            <span> {username} </span>
            <div className='flex-1 flex justify-end'>
                <SettingSVG/>
            </div>
        </header>
    )
}