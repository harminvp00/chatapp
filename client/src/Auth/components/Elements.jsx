
export const Title = ({ title, size }) => {
  return <div className={`${size} flex-1 font-bold`}>{title}</div>;
};

export const AuthButton = ({ btnTitle }) => {
  return (
    <button
      type="submit"
      className="bg-blue-500 text-xl w-[90%] text-white font-bold cursor-pointer rounded-xl mt-2 mx-10 p-4 not-even:border-0 outline-0"
    >
      {btnTitle}
    </button>
  );
};

export const SingupProvider = ({icon, provider, onclick}) => {
  return (
    <button type="button" onClick={onclick} className="flex items-center gap-3 p-3 rounded-2xl shadow-xl shadow-black/10  hover:cursor-pointer hover:opacity-50 hover:bg-gray-50 transition-color duration-[.25s]">
      <img className="w-8 h-8" src={icon} alt="" />
      <p>
        continue using <b>{provider}</b>
      </p>
    </button>
  );
};