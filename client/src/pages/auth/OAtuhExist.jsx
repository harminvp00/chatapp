import { useLocation } from "react-router-dom";
import { ContinueWithButtons } from "../../components/auth/ContinueWithButtons";
import google from "/google.png";
import github from "/github.png";
import { Logo } from "../../components/common/Logo";

export const OAtuhExist = ({ state }) => {
  const location = useLocation();
  const message = location.state?.message;
  const provider = location.state?.provider;

  const redirectUrl = provider === "GOOGLE" ? "/google/login" : "/github/login";

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black/20">
      <div className="bg-white p-5 h-100 flex flex-col items-center justify-center rounded-2xl mx-10">
        <Logo />
        <div className="text-xl text-center"> This mail is not valid for register new account, Please try to login using Google, Github Etc </div>
        <br />
        <ContinueWithButtons
          providerIcon={provider === "GOOGLE" ? google : github}
          provider={provider === 'GOOGLE' ? "Google": "GitHub"}
          endPoint={redirectUrl}
        />
      </div>
    </div>
  );
};
