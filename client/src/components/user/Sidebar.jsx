
import { Navbar } from "./Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { FindFriends } from "../chat/FindFriends.jsx";
import { Friend } from "../chat/Friend.jsx";
import { useState } from "react";
export const Sidebar = ({
    swUsername,
    setSWUsername,
    searchUserWindow,
    OpenSearchUsersWindow,
    userListAfterSearch,
    setUserListAfterSearch,
    enableUserListView,
    setEnableUserListView,
    handleFetchUserList,
    handleOpenChat
}) => {
    const { user } = useAuth();
    const [friendsIDs, _friendsIDs] = useState(user.friends.map(ele => ele.users.id));

    function handleSetSWUsername(event) {
        setSWUsername(event.target.value);
    }

    function resetStates() {
        setSWUsername("");
        OpenSearchUsersWindow(false);
        setUserListAfterSearch([]);
        setEnableUserListView(false);
    }


    return (
        <>
            {!searchUserWindow ?
                <div className="w-90">
                    {/* top navigation for profile, setting, notification and logout  */}
                    <Navbar
                        setSWUsername={setSWUsername}
                        searchUserWindow={searchUserWindow}
                        OpenSearchUsersWindow={OpenSearchUsersWindow}
                        setUserListAfterSearch={setUserListAfterSearch}
                        setEnableUserListView={setEnableUserListView}
                    />

                    <div className="">
                        {user?.friends.length === 0 ?
                            <FindFriends
                                searchUserWindow={searchUserWindow}
                                OpenSearchUsersWindow={OpenSearchUsersWindow}
                            /> :
                            <> {
                                user?.friends.map((ele, index) => {
                                    return (
                                        // One User info
                                        <Friend
                                            key={`friends-${ele?.users?.id}`}
                                            user_id={ele?.users?.id}
                                            username={ele?.users?.profile?.username}
                                            image_path={ele?.users?.avatars?.image_path}
                                            handleOpenChat={handleOpenChat}
                                        />
                                    )
                                })
                            } </>}
                    </div>
                </div>
                :
                <div className='w-90'>

                    <Navbar
                        setSWUsername={setSWUsername}
                        searchUserWindow={searchUserWindow}
                        OpenSearchUsersWindow={OpenSearchUsersWindow}
                        setUserListAfterSearch={setUserListAfterSearch}
                        setEnableUserListView={setEnableUserListView}
                    />


                    {/* Container for the input and its result list of user */}
                    <div style={{ height: `calc(100vh - 56px)` }}
                        className='w-full flex flex-col'>

                        <div className='w-full flex items-center bg-[#f5f5f5] shadow px-2'>

                            <button onClick={() => {
                                OpenSearchUsersWindow(false)
                                resetStates()
                            }} className='rounded-full hover:cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f" ><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                            </button>

                            {/* input element that takes username */}
                            <input
                                type="text"
                                placeholder='Search User by name'
                                className='flex-1 px-2 py-1 outline-0 text-xl'
                                value={swUsername}
                                onChange={(event) => handleSetSWUsername(event)}
                            />

                            <button className='p-2 rounded-full hover:cursor-pointer' onClick={handleFetchUserList}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="32px" width="32px" fill="#1f1f1f"><path d="M19.6,21l-6.3-6.3q-0.75,0.6-1.72,0.95T9.5,16q-2.72,0-4.61-1.89Q3,12.23 3,9.5Q3,6.77 4.89,4.89T9.5,3t4.61,1.89T16,9.5q0,1.1-0.35,2.07T14.7,13.3L21,19.6L19.6,21ZM9.5,14q1.88,0 3.19-1.31T14,9.5T12.69,6.31T9.5,5T6.31,6.31T5,9.5t1.31,3.19T9.5,14Z" /></svg>
                            </button>
                        </div>

                        {enableUserListView ?
                            <div>
                                {userListAfterSearch.length == 0 ?
                                    <p className='px-1 py-4 text-center'> No records are found, <br /> who contain "{swUsername}" in username </p> :
                                    <>{userListAfterSearch.map((ele, index) => {
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
                            : <> </>
                        }
                    </div>
                </div>
            }
        </>
    )
}