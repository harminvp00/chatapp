

import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export const ProfileEdit = () => {

    const { user } = useAuth();

    const handleUpdateProfile = async () => {

    }
    return (
        <div className='w-full h-screen'>

            {/* inner layer container that handle responsive width  */}
            <div className='w-[90%] mx-auto'>
                {/* profile pic and username */}
                <div className='flex flex-col items-center justify-center mt-5'>
                    <img className='w-40 h-40 rounded-full' src={user?.avatars?.image_path} alt="" />
                    <p> {user?.profile?.username} </p>
                </div>


                {/* edit form container  */}
                <div className='bg-yellow-300'>
                    Hello
                </div>

                {/* button to save details  */}
                <div className='flex items-center justify-center mt-5 gap-2'>
                    <button className='bg-[#f5f5f5] px-2 py-1 rounded-xl font-semibold brightness-90 hover:cursor-pointer hover:brightness-80'> cancel </button>
                    <button className='bg-blue-500 text-white px-2 py-1 rounded-xl font-semibold hover:brightness-90 hover:cursor-pointer'> save </button>
                </div>
            </div>
        </div>
    )
}