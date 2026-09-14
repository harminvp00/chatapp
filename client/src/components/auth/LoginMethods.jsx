// components
import { SingupProvider } from "../common/Elements.jsx";
import { useNavigate, Link } from "react-router-dom";
// icons
import google from "/google.png";
import github from "/github.png";
import email from "/arroba.png";
import Header from "../common/Header.jsx";

export const LoginMethods = () => {
  return (
    <div className="bg-black/20 w-screen h-screen flex items-center justify-center text-xl flex-col">
      <Header />
      <AuthCard />
    </div>
  );
};

const AuthCard = () => {
  const providers = {
    Google: google,
    Github: github,
    Email: email,
  };

  const navigate = useNavigate();

  const onclicks = [
    () => alert("hello, are you want to gogole login?"),
    () => alert("hello, are you want to github login?"),
    () => navigate("/register"),
  ];

  return (
    <div className="flex items-center flex-col justify-center p-8 mx-3 text-xl  bg-white rounded-2xl border-2 border-black shadow">
      <h2 className="font-bold text-2xl text-blue-500 mb-5 border-b border-black">
        Continue With
      </h2>

      <div className="flex flex-col bg-black/5">
        {Object.entries(providers).map(([provider, icon], index) => (
          <SingupProvider
            key={provider}
            icon={icon}
            provider={provider}
            onclick={onclicks[index]}
          />
        ))}
      </div>

      <div className="w-full px-1 pt-2 flex gap-1 text-lg">
        already have an account?
        <Link to="/" className="text-blue-500 font-bold">
          login
        </Link>
      </div>
    </div>
  );
};
