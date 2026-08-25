// UI elements
import { AuthButton, Title } from "../../components/Elements";

import { Link } from "react-router-dom";

// this is the register.jsx card
export const Register = () => {
  return (
    // main container for register component
    <div className="h-screen w-screen flex items-center justify-center bg-black/20">
      {/* card inside register component  */}
      <div className="flex flex-col items-center py-10 px-10 rounded-4xl bg-white shadow-2xl">
        {/* title component  */}
        <Title title={"Create a New account"} size={"text-2xl"} />

        {/* sign up form to fill details  */}
        <form
          action=""
          className="p-5 flex items-center justify-center flex-col border"
        >
          {/* file upload input  */}
          <input className="" type="file" name="avatar" hidden />

          {/* Username input field   */}
          <input
            className="bg-black/5 w-[90%] my-1 mx-10 p-4 border-0 outline-0 rounded-xl"
            type="text"
            name="username"
            placeholder="Username"
          />

          {/* Email address input field  */}
          <input
            className="bg-black/5 w-[90%] my-1 mx-10 p-4 border-0 outline-0 rounded-xl"
            type="email"
            name="email"
            placeholder="Email Address"
          />

          {/* this is the password input field  */}
          <input
            className="bg-black/5 w-[90%] my-1 mx-10 p-4 border-0 outline-0 rounded-xl"
            type="password"
            name="password"
            placeholder="Password"
          />

          {/* Button component (common for the all auth pages) */}
          <AuthButton btnTitle={"Create Account"} />
        </form>

        <div className="text-start">
          I already have an account
        </div>
      </div>
    </div>
  );
};
