
// the quickchat icon is imported
import quickchat from "/chat.png";

export const Logo = () => {
  return (
    <div className="text-blue-500 flex items-center gap-2 font-bold text-2xl mb-10 capitalize">
      <img className="w-8 h-8" src={quickchat} alt="" />
      QuickChat
    </div>
  );
};
