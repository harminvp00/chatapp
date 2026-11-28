

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';
import api from '../../api/api.js';

export const ProfileEdit = () => {
    const { user } = useAuth();
    console.log(user?.profile)
    const { setProfileEditMode } = useProfile();
    const [profileData, setProfileData] = useState(user?.profile);
    const [messageLine, setMessageLine] = useState({ visible: false, content: "" });
    const [buttonDisable, setButtonDisable] = useState(true);

    const handleOnChangeProfile = (event) => {

        setProfileData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));

        // ===================================================
        // replace this condition with the zod condition soon
        // temporaray condition to make feature work without zod validation
        // ===================================================
        
        if (profileData.bio && profileData.birthday
            && profileData.gender && profileData.phone) {
            setButtonDisable(false);
        }
    }


    const handleUpdateProfile = async () => {
        const response = await api.put('/profile/update', profileData);


        if (response.status === 200) {
            setMessageLine({
                visible: true, content: response?.data?.message
            })
        }

        setTimeout(() => {
            setMessageLine({ visible: false, content: "" })
        }, 5000);
    }

    function autoAdjustTextarea(textarea) {
        if (200 >= textarea.scrollHeight) {
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }


    return (
        <div className='w-full'>

            {
                messageLine?.visible ?
                    <div className='bg-[#c6c61a9c] flex gap-2 items-center px-5 py-2'>
                        {/* close icon  */}
                        <svg onClick={() => setMessageLine({
                            visible: false, content: ""
                        })} className='border border-transparent hover:cursor-pointer hover:border-black transition-colors duration-100 ease-out' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#1f1f1f"><path d="M6.4,19L5,17.6L10.6,12L5,6.4L6.4,5L12,10.6L17.6,5L19,6.4L13.4,12L19,17.6L17.6,19L12,13.4L6.4,19Z" /></svg>

                        {/* message  */}
                        <p> {messageLine.content} </p>
                    </div>
                    : null
            }

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
                    {/* Cancel button  */}
                    <button onClick={() => setProfileEditMode(false)} className='bg-[#f5f5f5] px-4 py-2 rounded-xl font-semibold brightness-90 hover:cursor-pointer hover:brightness-80'> cancel </button>
                    {/* Save button  */}
                    <button onClick={() => handleUpdateProfile()} disabled={buttonDisable} className='bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold hover:brightness-90 hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'> save </button>
                </div>
            </div>
        </div>
    )
}