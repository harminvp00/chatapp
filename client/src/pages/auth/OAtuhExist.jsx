import { Link } from "react-router-dom";
import { ContinueWithButtons } from "../../components/auth/ContinueWithButtons";
import google from "/google.png";
import github from "/github.png";
import { Logo } from "../../components/common/Logo";

export const OAtuhExist = ({ state }) => {

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black/20">
      <div className="bg-white h-fit flex flex-col items-center justify-center rounded-2xl p-5 m-10">
        <Logo />
        <div className="text-xl text-center">
          <p> Verify Email Address using Google, Github Etc</p>
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

        <Link to="/" replace={true} className="text-blue-500 font-bold my-4">
          Login?
        </Link>
      </div>
    </div>
  );
};
