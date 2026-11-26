
import { Navbar } from "./Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { FindFriends } from "../chat/FindFriends.jsx";
import { Friend } from "../chat/Friend.jsx";
import { SearchUser } from "../chat/SearchUser.jsx";
import { UserList } from "./UserList.jsx";
import { useDashboard } from "../../context/DashboardContext.jsx";

export const Sidebar = () => {
    const { user } = useAuth();

    const {enableUserListView } = useDashboard();

    return (
        <div className="w-90">
            {/* top navigation for profile, setting, notification and logout  */}
            <Navbar/>
            <SearchUser/>

            {!enableUserListView ?
                <div className="">
                    {user?.friends.length === 0 ?
                        <FindFriends/> :
                        <> {
                            user?.friends.map((ele, index) => {
                                return (
                                    // One User info
                                    <Friend
                                        key={`friends-${ele?.users?.id}`}
                                        user_id={ele?.users?.id}
                                        username={ele?.users?.profile?.username}
                                        image_path={ele?.users?.avatars?.image_path}
                                    />
                                )
                            })
                        } </>}
                </div> : <UserList />
            }
        </div>
    )
}