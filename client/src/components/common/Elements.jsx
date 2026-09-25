

import { Link } from "react-router-dom";

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

export const SingupProvider = ({ icon, provider, onclick }) => {
  return (
    <button
      type="button"
      onClick={onclick}
      className="border flex items-center gap-3 p-3 rounded hover:cursor-pointer hover:opacity-50 hover:bg-gray-50 transition-color duration-[.25s]"
    >
      <img className="w-8 h-8" src={icon} alt="" />
      <p>
        continue using <b>{provider}</b>
      </p>
    </button>
  );
};

export const Loader = ({ message, button = false }) => {
  return (
    <div className="fixed z-100 h-screen w-screen flex flex-col items-center justify-center backdrop-blur-[5px]">
      <div className="w-10 h-10 border-6 border-blue-500 rounded-full border-t-white animate-spin duration-[.26s]"></div>
      <br />
      {message || ""}
      {button ? <Link to={'/'} className="text-blue-500 font-bold px-3 py-1 my-2 rounded-xl hover:cursor-pointer hover:opacity-70"> Go Back to Login </Link> : null}
    </div>
  );
};
