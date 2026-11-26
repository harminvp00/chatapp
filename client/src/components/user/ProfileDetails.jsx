

import { useAuth } from "../../context/AuthContext";

export const ProfileDetails = () => {
    const { user } = useAuth();

    console.log(user?.profile)
    return (
        <div className="w-screen flex flex-col items-center ">
            {/* Personal Details  */}
            <div className="w-full sm:w-150 sm:px-5 sm:py-3 rounded-xl px-5 mx-auto bg-[#f8f8f8] shadow-xl ">
                <h3 className="text-xl font-bold mb-3 sm:px-6 border-b pb-1"> Personal Info </h3>

                <div className="grid grid-cols-2 gap-x-1 gap-y-2 sm:px-6">
                    <p className="text-xl font-bold"> username </p>
                    <p className="text-gray-500 text-[16px]"> {user?.profile?.username} </p>

                    <p className="text-xl font-bold"> bio </p>
                    <p className="text-gray-500 text-[16px]"> {user?.profile?.bio ? user?.profile?.bio : 'Not Set'} </p>

                    <p className="text-xl font-bold"> birthday </p>
                    <p className="text-gray-500 text-[16px]"> {user?.profile?.birthday ? user?.profile?.birthday : 'Not Set'} </p>

                    <p className="text-xl font-bold"> gender </p>
                    <p className="text-gray-500 text-[16px]"> {user?.profile?.gender ? user?.profile?.gender : 'Not Set'} </p>

                    <p className="text-xl font-bold"> home address </p>
                    <p className="text-gray-500 text-[16px]"> {user?.profile?.home_address ? user?.profile?.home_address : 'Not Set'} </p>

                    <p className="text-xl font-bold"> phone </p>
                    <p className="text-gray-500 text-[16px]"> {user?.profile?.phone ? user?.profile?.phone : 'Not Set'} </p>

                    <p className="text-xl font-bold"> phone </p>
                    <p className="text-gray-500 text-[16px]"> {user?.profile?.phone ? user?.profile?.phone : 'Not Set'} </p>
                    
                    <p className="text-xl font-bold"> language </p>
                    <p className="text-gray-500 text-[16px]"> {user?.profile?.prefer_language ? user?.profile?.prefer_language : 'Not Set'} </p>
                </div>
            </div>
        </div>
    )
}