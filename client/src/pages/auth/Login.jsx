import axios from "axios";
import { useState, useRef } from "react";
import { Link, replace, useNavigate } from "react-router-dom";
import googleIcon from "../../assets/bussiness/google.png";
import {
  AuthButton,
  Loader,
  Title,
} from "../../components/common/Elements.jsx";
import close from "../../assets/app/close.svg";
import { ContinueWithButtons } from "../../components/auth/ContinueWithButtons.jsx";
import { useEffect } from "react";
import { Logo } from "../../components/common/Logo.jsx";

// this is the register.jsx card
export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [response, setResponse] = useState({
    success: false,
    message: "",
  });

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const message = param.get("message");

    if (message) {
      setResponse({
        success: false,
        message,
      });

      const timer = setTimeout(() => {
        setResponse({
          success: null,
          message: "",
        });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const [showLoader, setShowLoader] = useState(false);

  const navigate = useNavigate();

  function handleOnChange(event) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleOnSubmit(event) {
    event.preventDefault();

    try {
      setShowLoader(true);

      const uri = `${import.meta.env.VITE_SERVER_URI}/auth/login`;
      const _response = await axios.post(uri, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.success) {
        setResponse({
          success: _response?.data?.success,
          message: _response?.data?.message,
        });
        return;
      }

      if (response.success) navigate("/dashboard", { replace: true });
    } catch (err) {
      const data = err?.response?.data;
      if (data?.code === "GOOGLE_OAUTH_EXIST") {
        navigate(
          "/",
          {
            state: { provider: data?.provider, message: data?.message },
          },
          replace,
        );
      }
      setResponse({
        success: false,
        message: "something wents wrong",
      });
    } finally {
      setShowLoader(false);
    }
  }

  return (
    // main container for register component
    <div className="h-screen w-screen flex items-center justify-center bg-black/20">
      {showLoader ? <Loader /> : ""}
      {/* card inside register component  */}
      <div className="flex flex-col items-center mx-5 py-10 px-5 rounded-4xl bg-white shadow-2xl">
        {/* header with app logo */}
        <Logo />

        {/* title component  */}
        <div className="flex w-70 border-b border-black  pb-2">
          <Title title={"SignIn"} size={"text-2xl"} />
          <img
            type="button"
            onClick={() => {
              navigate("/");
            }}
            className="cursor-pointer"
            src={close}
            alt=""
          />
        </div>

        {/* sign up form to fill details  */}
        <form
          onSubmit={(e) => handleOnSubmit(e)}
          className="p-5 flex items-center justify-center flex-col"
        >
          {/* Email address input field  */}
          <input
            className="bg-black/5 w-[90%] my-1 mx-10 p-4 border-0 outline-0 rounded-xl"
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => handleOnChange(e)}
            required
          />

          {/* this is the password input field  */}
          <input
            className="bg-black/5 w-[90%] my-1 mx-10 p-4 border-0 outline-0 rounded-xl"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleOnChange(e)}
            required
          />

          {/* Showing the server response into form before the submit button */}
          <div
            className={`pt-1 w-70 text-${response.success === false ? "red" : "black"}-500`}
          >
            {response.message}
          </div>

          {/* Button component (common for the all auth pages) */}
          <AuthButton btnTitle={"Login"} />

          {/* OAuth Button Links */}
          <ContinueWithButtons
            providerIcon={googleIcon}
            provider={"Google"}
            endPoint={"/google/login"}
          />
        </form>

        {/* this is botttom message link for those who may do not have any account created yet! */}
        <div className="text-start flex gap-1">
          I dont have any account,
          <Link to={"/register"} className="text-blue-500 font-bold underline">
            create one
          </Link>
        </div>
      </div>
    </div>
  );
};
