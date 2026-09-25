import { Link, replace, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../../components/common/Logo";
import visibility from "../../assets/crud/visibility.svg";
import { useState } from "react";
import { Loader } from "../../components/common/Elements";
import api from "../../api/api.js";

export const PasswordVerification = () => {
  const navigate = useNavigate();
  const [InputType, setInputType] = useState("password");
  const location = useLocation();
  const [state, setState] = useState(location.state || null);
  const [password, setPassword] = useState("");

  if (!state) {
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 15000);

    return (
      <Loader
        message={
          "Please wait for a second, QuickChat is retriving your info from the server"
        }
        button={true}
      />
    );
  }

  const handlePasswordVerification = async (event) => {
    // this is prevent some form submissing unneccessary reload issues, that might clear our state by refresh or reload the react page
    event.preventDefault();

    try {
      const payload = { email: state?.email, password };
      const response = await api.post("/auth/linked-google-oauth", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response?.success) {
        console.log(
          "the oauth account is not linked within the password account.",
        );
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log(
        "there is error, we will catch it earlier as soon as possible.",
      );
    }
  };

  return (
    // the most outer container of this page
    <div className="h-screen w-screen flex items-center justify-center bg-black/20">
      {/* the first inner container  */}
      <div className="bg-white p-10 m-5 flex flex-col items-center justify-center rounded-2xl">
        <Logo />

        {/* the inner container */}
        <div className="w-100 h-fit px-10">
          {/* Show founded User identity */}
          <p className="mb-1">
            Are you{" "}
            <span className="text-blue-500 font-bold">{state?.name}</span>?
          </p>

          <div className="px-5 py-2 bg-black/8 rounded-2xl flex items-center gap-2">
            <img
              className="w-10 h-10 rounded-full"
              src={state.image || "./default_avatar.jpeg"}
              alt={`${state.name}'s avatar`}
              title={state.name}
            />
            <span>{state.email}</span>
          </div>
        </div>

        <div className="w-100 h-fit px-10 mt-5 mb-2">
          <p> Enter your password here for verification </p>
        </div>

        <form
          className="w-80 h-fit flex flex-col"
          onSubmit={(event) => handlePasswordVerification(event)}
        >
          <label
            htmlFor=""
            className="bg-black/8 py-2 text-[18px] border-0 outline-0 rounded-2xl flex items-center"
          >
            <input
              className="flex-1 px-5 border-0 outline-0"
              type={InputType}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
            <button
              type="button"
              onClick={() =>
                setInputType(InputType === "password" ? "text" : "password")
              }
            >
              <img className="me-4 opacity-60" src={visibility} alt="" />
            </button>
          </label>

          {/* the verify button call the handleVefification method for the form   */}
          <button className="bg-blue-500 text-white p-1 mt-2 rounded">
            Verify Password
          </button>
        </form>

        <div className="w-100 h-fit px-10 mt-2 text-center">
          <Link to={"/"} replace={true} className="font-bold text-blue-500">
            {" "}
            Return to Login{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};
