

import { useAuth } from "../../context/AuthContext";

export const ProfileDetails = () => {
    const { user } = useAuth();

    console.log(user?.profile)
    return (
        <div className="w-screen bg-red-500 flex flex-col items-center">
            {/* Personal Details  */}
            <div className="w-100 border mx-auto bg-yellow-400">
                <h3 className="text-xl font-bold mb-3"> Personal Info </h3>

                <div className="grid grid-cols-2 gap-x-20 items-center justify-center">
                    <p className="text-xl font-bold"> username </p>
                    <p className="text-[16px]"> {user?.profile?.username} </p>

                    <p className="text-xl font-bold"> bio </p>
                    <p className="text-[16px]"> {user?.profile?.bio ? user?.profile?.bio : 'Not Set'} </p>

                    <p className="text-xl font-bold"> birthday </p>
                    <p className="text-[16px]"> {user?.profile?.birthday ? user?.profile?.birthday : 'Not Set'} </p>

                    <p className="text-xl font-bold"> gender </p>
                    <p className="text-[16px]"> {user?.profile?.gender ? user?.profile?.gender : 'Not Set'} </p>

                    <p className="text-xl font-bold"> home address </p>
                    <p className="text-[16px]"> {user?.profile?.home_address ? user?.profile?.home_address : 'Not Set'} </p>

                    <p className="text-xl font-bold"> phone </p>
                    <p className="text-[16px]"> {user?.profile?.phone ? user?.profile?.phone : 'Not Set'} </p>

                    <p className="text-xl font-bold"> phone </p>
                    <p className="text-[16px]"> {user?.profile?.phone ? user?.profile?.phone : 'Not Set'} </p>
                    
                    <p className="text-xl font-bold"> prefer_language </p>
                    <p className="text-[16px]"> {user?.profile?.prefer_language ? user?.profile?.prefer_language : 'Not Set'} </p>
                </div>
            </div>
        </div>
    )
}