
export const Friend = ({
    username, image_path, handleOpenChat
}) => {

    return (
        <li onClick={() => { handleOpenChat(username, image_path) }}
            className="border-b flex items-center gap-5 px-10 py-2 hover:cursor-pointer">
            <img
                className="w-12 h-12 border rounded-full shadow bg-cover"
                onError={(event) => {
                    event.target.src = "/default_avatar.jpeg";
                }}
                src={image_path || "/default_avatar.jpeg"}
                alt={username} />

            <span> {username} </span>
        </li>
    )
}