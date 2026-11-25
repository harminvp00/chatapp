
import { useAuth } from "../../context/AuthContext"

export const ProfilePicture = () => {
    const { user } = useAuth();
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-4 border-b">
            <img className="w-50 h-50 rounded-full" src={user?.avatars?.image_path} alt="" />
            <h4 className="text-xl font-medium"> {user?.profile?.username} </h4>

            <div className="flex items-center justify-center gap-3">
                {/* for edit profile  */}
                <button className="flex items-center justify-center gap-2 bg-[#E7EAEE] p-2 rounded-xl shadow hover:cursor-pointer hover:brightness-95 transition-brightness duration-75 ease-in  ">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
                    <span> Edit Profile </span>
                </button>

                {/* for view chat  */}
                <button className="flex items-center justify-center gap-2 bg-[#E7EAEE] p-2 rounded-xl shadow hover:cursor-pointer hover:brightness-95 transition-brightness duration-75 ease-in  ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="20px" width="20px" fill="#1f1f1f"><path d="M6,14H18V12H6v2Zm0-3H18V9H6v2ZM6,8H18V6H6V8ZM22,22l-4-4H4q-0.82,0-1.41-0.59T2,16V4Q2,3.17 2.59,2.59T4,2H20q0.83,0 1.41,0.59T22,4V22ZM4,16H18.85L20,17.13V4H4V16Zm0,0V4V16Z" /></svg>
                    <span> View Chats </span>
                </button>
            </div>
        </div>
    )
}