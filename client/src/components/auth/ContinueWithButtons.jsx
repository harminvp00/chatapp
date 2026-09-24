import React from "react";
export const ContinueWithButtons = ({providerIcon, provider, endPoint}) => {
  return (
    <button
      className="w-[90%] cursor-pointer rounded-xl mt-2 mx-10 p-2 not-even:border-0 outline-0 flex items-center justify-center gap-3 bg-black/5"
      type="button"
      onClick={() => {
        window.location.href = `${import.meta.env.VITE_SERVER_URI}/auth${endPoint}`;
      }}
    >
      <img className="w-8 h-8 capitalize" src={providerIcon} alt="google_image" />
      <span> Continue with {provider} </span>
    </button>
  );
};
