import quickchat from "/chat.png";

const Header = () => {
  return (
    <nav className="px-15 pt-10 pb-5 flex items-center justify-between">
      <h1 className="text-xl font-bold flex items-center justify-center gap-2 text-blue-500">
        <img className="w-8 h-8" src={quickchat} alt="quickchat" />
        QuickChat
      </h1>
    </nav>
  );
};
export default Header;
