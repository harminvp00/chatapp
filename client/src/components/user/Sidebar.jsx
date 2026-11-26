
import { Navbar } from "./Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { FindFriends } from "../chat/FindFriends.jsx";
import { Friend } from "../chat/Friend.jsx";
import { SearchUser } from "../chat/SearchUser.jsx";
import { UserList } from "./UserList.jsx";

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
        <div className="w-90">
            {/* top navigation for profile, setting, notification and logout  */}
            <Navbar
                setSWUsername={setSWUsername}
                searchUserWindow={searchUserWindow}
                OpenSearchUsersWindow={OpenSearchUsersWindow}
                setUserListAfterSearch={setUserListAfterSearch}
                setEnableUserListView={setEnableUserListView}
            />

            <SearchUser
                swUsername={swUsername}
                OpenSearchUsersWindow={OpenSearchUsersWindow}
                resetStates={resetStates}
                handleSetSWUsername={handleSetSWUsername}
                handleFetchUserList={handleFetchUserList}
            />

            {!enableUserListView ?
                <div className="">
                    {user?.friends.length === 0 ?
                        <FindFriends
                            searchUserWindow={searchUserWindow}
                            OpenSearchUsersWindow={OpenSearchUsersWindow} /> :
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
                </div> : <UserList userListAfterSearch={userListAfterSearch} />
            }
        </div>
    )
}