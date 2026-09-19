import axios from "axios";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  AuthButton,
  Loader,
  Title,
} from "../../components/common/Elements.jsx";
import close from "../../assets/app/close.svg";
import quickchat from "/chat.png";
import { ContinueWithButtons } from "../../components/auth/ContinueWithButtons.jsx";

// this is the register.jsx card
export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [response, setResponse] = useState({
    success: null,
    message: "",
  });

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

      setResponse({
        success: _response?.data?.success,
        message: _response?.data?.message,
      });

      if (!_response?.data?.success) return;

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setResponse({
        success: false,
        message: err.message || "something wents wrong",
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
        <div className="text-blue-500 flex items-center gap-2 font-bold text-2xl mb-10 capitalize">
          <img className="w-8 h-8" src={quickchat} alt="" />
          QuickChat
        </div>

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
            className={`pt-1 w-70 text-${response.success ? "green" : "red"}-500`}
          >
            {response.message}
          </div>

          {/* Button component (common for the all auth pages) */}
          <AuthButton btnTitle={"Login"} />
          <ContinueWithButtons/>
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
