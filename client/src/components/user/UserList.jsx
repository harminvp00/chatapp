import { useAuth } from "../../context/AuthContext"
import { useState } from "react";

export const UserList = (
    userListAfterSearch,
) => {

    const { user } = useAuth()
    const [friendsIDs, _friendsIDs] = useState(user.friends.map(ele => ele.users.id));

    return (
        <div className='w-90'>
            {/* Container for the input and its result list of user */}
            <div style={{ height: `calc(100vh - 56px)` }}
                className='w-full flex flex-col'>   
                    <div>
                        {userListAfterSearch.userListAfterSearch.length == 0 ?
                            <p className='px-1 py-4 text-center'> No records are found, <br /> who contain "{swUsername}" in username </p> :
                            <>{userListAfterSearch.userListAfterSearch.map((ele, index) => {

                                if(ele?.users?.id === user?.id){
                                    return null;
                                }
                                return (
                                    // detail of one user 
                                    <div
                                        onClick={() => {
                                            handleOpenChat(ele?.username, ele?.users?.avatars?.image_path)
                                        }}
                                        className='flex items-center gap-2 px-5 py-4 hover:bg-[#f5f5f5] hover:cursor-pointer'
                                        key={`user-${index}`}>

                                        {/* profile image  */}
                                        <img
                                            className='w-10 h-10 rounded-full bg-cover shadow'
                                            onError={(event) => {
                                                event.target.src = "/default_avatar.jpeg";
                                            }}
                                            src={ele.users?.avatars?.image_path || "/default_avatar.jpeg"}
                                            alt={ele.users?.profile?.username} />

                                        {/* username  */}
                                        <span> {ele.username} </span>

                                        <div className='flex-1 flex items-center justify-end'>
                                            {friendsIDs.includes(ele?.users?.id) ?
                                                <svg onClick={() => { }} className='hover:bg-[#0000003a] p-1 rounded-full' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="32px" width="32px" fill="#1f1f1f"><path d="M6,14q-0.82,0-1.41-0.59T4,12t0.59-1.41T6,10q0.83,0 1.41,0.59Q8,11.18 8,12T7.41,13.41T6,14Zm6,0q-0.82,0-1.41-0.59T10,12t0.59-1.41T12,10t1.41,0.59Q14,11.18 14,12t-0.59,1.41T12,14Zm6,0q-0.82,0-1.41-0.59T16,12t0.59-1.41T18,10t1.41,0.59Q20,11.18 20,12t-0.59,1.41T18,14Z" /></svg>
                                                : <svg onClick={() => { createConversation(user?.id, ele?.users?.id) }} className='hover:bg-[#0000003a] p-1 rounded-full' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="32px" width="32px" fill="#1f1f1f"><path d="M11,17h2V13h4V11H13V7H11v4H7v2h4v4Zm1,5q-2.07,0-3.9-0.79q-1.82-0.79-3.17-2.14Q3.58,17.73 2.79,15.9T2,12Q2,9.92 2.79,8.1Q3.58,6.27 4.93,4.93Q6.28,3.57 8.1,2.79Q9.93,2 12,2t3.9,0.79t3.17,2.14q1.35,1.35 2.14,3.17Q22,9.92 22,12t-0.79,3.9t-2.14,3.17q-1.35,1.35-3.17,2.14T12,22Zm0-2q3.35,0 5.68-2.32T20,12T17.68,6.32T12,4T6.33,6.32T4,12t2.33,5.68T12,20Zm0-8Z" /></svg>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                            }
                            </>
                        }
                    </div>
            </div>
        </div>
    )
}