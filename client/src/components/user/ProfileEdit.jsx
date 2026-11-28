

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';

export const ProfileEdit = () => {
    const { user } = useAuth();
    const { setProfileEditMode } = useProfile();
    const [profileData, setProfileData] = useState(user?.profile);

    const handleOnChangeProfile = (event) => {
        setProfileData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    const handleUpdateProfile = async () => {

    }

    function autoAdjustTextarea(textarea) {
        if (200 >= textarea.scrollHeight) {
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }


    return (
        <div className='w-full'>
            {/* inner layer container that handle responsive width  */}
            <div className='w-[90%] sm:w-[80%] lg:w-[60%] mx-auto'>
                {/* profile pic and username */}
                <div className='flex flex-col items-center justify-center mt-5'>
                    <img className='w-40 h-40 rounded-full' src={user?.avatars?.image_path} alt="" />
                    <p> {user?.profile?.username} </p>
                </div>


                {/* edit form container  */}
                <div className=''>
                    <form className='h-auto flex flex-col mx-10 gap-2 my-5'>

                        {/* username */}
                        <label className='mt-2' htmlFor="username"> Username </label>
                        <input
                            type="text"
                            id='username'
                            name='username'
                            value={profileData?.username || ""}
                            onChange={(event) => {
                                handleOnChangeProfile(event);
                            }}
                            className='bg-[#f5f5f5] border rounded px-2 py-1 text-[16px] resize-none'
                        />

                        {/* bio */}
                        <label className='mt-2' htmlFor="bio"> Bio </label>
                        <textarea id='bio' className='bg-[#f5f5f5] border rounded h-20 px-2 py-1 max-h-50 text-[16px] resize-none'
                            type="text" name='bio'
                            value={profileData?.bio || ""}
                            onChange={(event) => {
                                handleOnChangeProfile(event);
                                autoAdjustTextarea(document.getElementById("bio"))
                            }}></textarea>


                        {/* birthday */}
                        <label className='mt-2' htmlFor="birthday"> Birthday </label>
                        <input id="birthday" name='birthday' value={profileData?.birthday || ""} className='bg-[#f5f5f5] border rounded px-2 py-1 text-[16px] border-box hover:cursor-pointer' type="date" onChange={(event) => { handleOnChangeProfile(event) }}
                        />

                        {/* home_address */}

                        {/* gender  */}
                        <label className='mt-2' htmlFor="gender"> Gender </label>
                        <select
                            id="gender"
                            name="gender"
                            value={profileData?.gender || "Female"}
                            className="bg-[#f5f5f5] border rounded px-2 py-1 text-[16px] border-box hover:cursor-pointer"
                            onChange={(event) => { handleOnChangeProfile(event) }}
                        >
                            <option> Male </option>
                            <option> Female </option>
                            <option> Other </option>
                        </select>

                        {/* phone */}
                        <label className='mt-2' htmlFor="phone"> Mobile No. </label>
                        <input
                            type="text"
                            id='phone'
                            name="phone"
                            value={profileData?.phone || ""}
                            className="bg-[#f5f5f5] border rounded px-2 py-1 text-[16px] border-box hover:cursor-pointer"
                            onChange={(event) => { handleOnChangeProfile(event) }}
                            maxLength={10}
                        />

                        {/* prefer_language  */}
                    </form>
                </div>

                {/* button to save details  */}
                <div className='flex items-center justify-center mt-5 gap-2'>
                    <button onClick={() => setProfileEditMode(false)} className='bg-[#f5f5f5] px-2 py-1 rounded-xl font-semibold brightness-90 hover:cursor-pointer hover:brightness-80'> cancel </button>
                    <button className='bg-blue-500 text-white px-2 py-1 rounded-xl font-semibold hover:brightness-90 hover:cursor-pointer'> save </button>
                </div>
            </div>
        </div>
    )
}