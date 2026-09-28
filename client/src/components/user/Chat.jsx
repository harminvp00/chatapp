
export const Chat = ({
  senderProfileImage,
  senderName,
  lastChat,
  lastChatTime,
}) => {
  return (
    <div className="flex">
      <img src={senderProfileImage} alt="" />
      <div className="flex flex-col items-start">
        <p> {senderName} </p>
        <div className="flex items-center justify-start">
          <p> {lastChat} </p>
          <p> {lastChatTime} </p>
        </div>
      </div>
    </div>
  );
};
