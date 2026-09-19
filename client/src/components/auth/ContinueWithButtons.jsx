import React from "react";
import googleIcon from "../../assets/bussiness/google.png";
export const ContinueWithButtons = () => {
  return (
    <button
      className="w-[90%] font-bold cursor-pointer rounded-xl mt-2 mx-10 p-2 not-even:border-0 outline-0 flex items-center justify-center gap-3 bg-black/5"
      type="button"
      onClick={() => {
        window.location.href = `${import.meta.env.VITE_SERVER_URI}/auth/google/login`;
      }}
    >
      <img className="w-8 h-8" src={googleIcon} alt="google_image" />
      <span> Continue with Google </span>
    </button>
  );
};
