
export const FindFriends = ({
    searchUserWindow,
    OpenSearchUsersWindow
}) => {
    return (
        <div className='flex flex-col items-center justify-center h-50 bg-[#f5f5f5]'>

            {/* user intruction  */}
            <p className="text-center"> You did not have any friends yet </p>

            {/* button for the find friends  */}
            <button
                onClick={() => {
                    searchUserWindow == false ? OpenSearchUsersWindow(true) : OpenSearchUsersWindow(false)
                }}
                className='bg-blue-500 text-white py-2 px-4 rounded-2xl my-2  hover:cursor-pointer'
                onMouseEnter={ele => {
                    ele.target.style.filter = "brightness(90%)";
                    ele.target.style.fontWeight = 'bold';
                }}
                onMouseLeave={ele => {
                    ele.target.style.filter = "brightness(100%)"
                    ele.target.style.fontWeight = 'normal';
                }}
            > find friends? </button>

        </div>
    )
}