
export function ChatHeader({ setUserInChat, setChatOpen, picture ="default_avatar.jpeg", username="user" }) {

    function handleChatClose() {
        // this method is close the open chat in dashboard 
        setChatOpen(false);
        setUserInChat(null);
    }

    return (
        <header className='flex items-center gap-3 p-3 bg-[#f5f5f5] '>
            
            <svg className="hover:cursor-pointer hover:opacity-75" onClick={handleChatClose} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={"#010101"} ><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>

            <img className='w-8 h-8 rounded-full' src={picture} alt="" />
            <span> {username} </span>
            <div className='flex-1 flex justify-end'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#1f1f1f"><path d="M12,20q-0.82,0-1.41-0.59T10,18t0.59-1.41T12,16t1.41,0.59Q14,17.18 14,18t-0.59,1.41T12,20Zm0-6q-0.82,0-1.41-0.59T10,12t0.59-1.41T12,10t1.41,0.59Q14,11.18 14,12t-0.59,1.41T12,14Zm0-6q-0.82,0-1.41-0.59T10,6t0.59-1.41T12,4t1.41,0.59Q14,5.18 14,6T13.41,7.41T12,8Z" /></svg>
            </div>
        </header>
    )
}