
import { useAuth } from "../../context/AuthContext"
import { useProfile } from "../../context/ProfileContext";

export const ProfilePicture = ({ handleLogout }) => {
    const { user, logout } = useAuth();
    const { setProfileEditMode } = useProfile();

    async function handleLogout() {
        const user_logout = confirm("Are you want to logout from this account?");
        if (user_logout) {
            await logout();
            navigateTo("/", { replace: true });
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-4 sm:mb-5">
            <img className="w-50 h-50 rounded-full" src={user?.avatars?.image_path} alt="" />
            <h4 className="text-xl font-medium"> {user?.profile?.username} </h4>

            <div className="">

                <div className={`mb-4 flex ${(user?.profile?.bio) ? "" : "justify-center"}`}>
                    {
                        user?.profile?.bio ?

                            // show bio when user have it   
                            <p className="p-2"> user?.profile?.bio </p>
                            :
                            // add bio button appear when user have no bio
                            <div className="border border-dashed rounded-2xl px-2 py-1 flex items-center gap-1 w-fit hover:cursor-pointer bg-white hover:brightness-90">
                                <svg className="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#1f1f1f"><path d="M11,17h2V13h4V11H13V7H11v4H7v2h4v4Zm1,5q-2.07,0-3.9-0.79q-1.82-0.79-3.17-2.14Q3.58,17.73 2.79,15.9T2,12Q2,9.92 2.79,8.1Q3.58,6.27 4.93,4.93Q6.28,3.57 8.1,2.79Q9.93,2 12,2t3.9,0.79t3.17,2.14q1.35,1.35 2.14,3.17Q22,9.92 22,12t-0.79,3.9t-2.14,3.17q-1.35,1.35-3.17,2.14T12,22Zm0-2q3.35,0 5.68-2.32T20,12T17.68,6.32T12,4T6.33,6.32T4,12t2.33,5.68T12,20Zm0-8Z" /></svg>
                                <span> Add Bio </span>
                            </div>
                    }
                </div>

                <div className="flex items-center justify-center gap-3">
                    {/* for edit profile  */}
                    <button
                        onClick={() => setProfileEditMode(true)}
                        className="flex items-center justify-center gap-2 bg-[#E7EAEE] p-3 rounded-xl shadow hover:cursor-pointer hover:brightness-95 transition-brightness duration-75 ease-in">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
                        <span> Edit Profile </span>
                    </button>

                    {/* for view chat  */}
                    <button onClick={() => handleLogout()} className="flex items-center justify-center gap-2 text-white bg-red-500 p-3 rounded-xl shadow hover:cursor-pointer hover:brightness-80 transition-brightness duration-75 ease-in">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#fff"><path d="M5,21q-0.83,0-1.41-0.59T3,19V5Q3,4.17 3.59,3.59T5,3h7V5H5V19h7v2H5Zm11-4l-1.38-1.45L17.18,13H9V11h8.18L14.63,8.45L16,7l5,5l-5,5Z" /></svg>
                        <span> Logout </span>
                    </button>
                </div>
            </div>
        </div>
    )
}