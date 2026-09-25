import { Link, useLocation } from "react-router-dom";
import { ContinueWithButtons } from "../../components/auth/ContinueWithButtons";
import google from "/google.png";
import github from "/github.png";
import gmail from "/gmail.png";
import { Logo } from "../../components/common/Logo";

export const OAtuhExist = () => {

  const location = useLocation()
  const message = location.state?.message || "You have to verify using such options "
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black/20">
      <div className="bg-white h-fit flex flex-col items-center justify-center rounded-2xl p-5 m-10">
        <Logo />
        <div className="text-xl text-center w-150">
          <p> {message} </p>
        </div>
        <br />
        <ContinueWithButtons
          providerIcon={google}
          provider={"Google"}
          endPoint={"/google/login"}
        />
        <ContinueWithButtons
          providerIcon={github}
          provider={"GitHub"}
          endPoint={"/github/login"}
        />

        <button
          className="w-[90%] cursor-pointer rounded-xl mt-2 mx-10 p-2 not-even:border-0 outline-0 flex items-center justify-center gap-3 bg-black/5 hover:opacity-75"
          type="button"
        >
          <img className="w-8 h-8 capitalize" src={gmail} alt="google_image" />
          <span> Continue with Email </span>
        </button>
      </div>
    </div>
  );
};
