import { useLocation, Link } from "react-router-dom";
import { ContinueWithButtons } from "../../components/auth/ContinueWithButtons";
import google from "/google.png";
import github from "/github.png";
import { Logo } from "../../components/common/Logo";
import { useState } from "react";

export const PasswordVerification = ({ state }) => {
  const location = useLocation();

  const email = location.state?.email;
  const [password, setPassword] = useState("");

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black/20">
      <div className="bg-white h-fit w-100 flex flex-col items-center justify-center rounded-2xl p-5 m-10">
        <Logo />
        <div className="text-xl text-center">
          <p> Verify {email} using Google, Github Etc</p>
        </div>

        <form action="" className="p-5 flex items-center justify-center">
          <input
            className="bg-black/5 flex-1 my-1 mx-2 p-4 border-0 outline-0 rounded-xl shadow"
            type="password"
            name="password"
            value={password}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="bg-blue-500 text-white px-5 py-4 rounded-xl"
            type="submit"
          >
            verify
          </button>
        </form>

        <div>
          <span> Want to back at </span>
          <Link to="/" replace={true} className="text-blue-500 font-bold my-4">
            Login?
          </Link>
        </div>
      </div>
    </div>
  );
};
