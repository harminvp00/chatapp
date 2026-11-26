import api from "../../api/api.js";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from "/google.png";
import {
  AuthButton,
  Loader,
  Title,
} from "../../components/common/Elements.jsx";
import { ContinueWithButtons } from "../../components/auth/ContinueWithButtons.jsx";
import { useEffect } from "react";
import { Logo } from "../../components/common/Logo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

// this is the register.jsx card
export const Login = () => {
  const { getCurrentUser } = useAuth();
  // the navigate variable
  const navigate = useNavigate();

  // show the loader
  const [showLoader, setShowLoader] = useState(false);
  const [passwordshow, setPasswordShow] = useState(false); // false -> hide, true -> show
  // the form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // the response state, this show the message on the screen
  const [message, setMessage] = useState(null);

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

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const code = param.get("code");
    const email = param.get("email");
    const name = param.get("name");
    const image = param.get("image");

    if (code) {
      if (code === "VERIFY_PASSWORD") {
        navigate("/password-verify", {
          state: { email, name, image },
          replace: true,
        });
      }
    }
  }, []);

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
      await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      await getCurrentUser();
      navigate("/", { replace: true });
    } catch (err) {
      /**  this block not only catch error but it also redirect user to authenticate thier mail,
       * some error provider the rediret instruction through codes, and provide data within to that page
       */

      // extracting the data state from the err.response
      const data = err?.response?.data;

      if (data?.code === "OAUTH_EXIST") {
        // if data code is Oauth Exist then this page redirect to the that page
        navigate("/oauth-exists", { replace: true });
      }

      // this is show error that uncatch by the server login-service
      setMessage({
        success: false,
        content: err?.response?.data?.message || "Something went wrong!",
      });
    } finally {
      // this is the finally block where we make the loaded false because the API response is done
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
          {/* card title  */}
          <Title title={"SignIn"} size={"text-2xl"} />
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

          <div className="bg-black/5 w-[90%] my-1 mx-10 p-4 border-0 outline-0 rounded-xl flex items-center">

            {/* this is the password input field  */}
            <input
              className="flex-1 border-0 outline-0"
              type={passwordshow ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleOnChange(e)}
              required
            />

            {
              passwordshow ?
                <svg className="hover:cursor-pointer" onClick={() => setPasswordShow(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#1f1f1f"><path d="M16.1,13.3l-1.45-1.45q0.22-1.18-0.67-2.2q-0.9-1.02-2.33-0.8L10.2,7.4q0.42-0.2 0.86-0.3T12,7q1.88,0 3.19,1.31T16.5,11.5q0,0.5-0.1,0.94T16.1,13.3Zm3.2,3.15l-1.45-1.4q0.95-0.72 1.69-1.59T20.8,11.5q-1.25-2.53-3.59-4.01T12,6q-0.72,0-1.42,0.1T9.2,6.4L7.65,4.85q1.03-0.43 2.1-0.64T12,4q3.78,0 6.73,2.09T23,11.5q-0.57,1.47-1.51,2.74T19.3,16.45Zm0.5,6.15l-4.2-4.15q-0.88,0.28-1.76,0.41T12,19q-3.78,0-6.73-2.09T1,11.5q0.53-1.33 1.33-2.46T4.15,7L1.4,4.2L2.8,2.8L21.2,21.2l-1.4,1.4ZM5.55,8.4Q4.83,9.05 4.23,9.82T3.2,11.5q1.25,2.52 3.59,4.01T12,17q0.5,0 0.98-0.06t0.97-0.14l-0.9-0.95q-0.28,0.07-0.53,0.11T12,16q-1.88,0-3.19-1.31T7.5,11.5q0-0.28 0.04-0.53t0.11-0.53L5.55,8.4Zm7.98,2.33ZM9.75,12.6Z" /></svg>
                : <svg className="hover:cursor-pointer" onClick={() => setPasswordShow(true)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z" /></svg>

            }

          </div>

          {/* Showing the server response into form before the submit button */}
          {message ? (
            <div className={`pt-1 w-70 text-red-500 flex items-center gap-2`}>

              {message.content}
            </div>
          ) : null}

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
            create one?
          </Link>
        </div>
      </div>
    </div>
  );
};
