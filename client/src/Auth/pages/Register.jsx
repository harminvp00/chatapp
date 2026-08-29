

// UI elements
import { AuthButton, Title } from "../components/Elements";
import axios from "axios";
import { useState } from "react";
import close from "../../assets/close.svg";
import quickchat from "/chat.png";
import { Link, useNavigate } from "react-router-dom";
// this is the register.jsx card
export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [response, setResponse] = useState({
    success: true,
    message: "fill the above details correctly",
  });

  const navigate = useNavigate();

  function handleOnChange(event) {
    event.preventDefault();
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleOnSubmit(event) {
    event.preventDefault();

    try{
      const uri = `http://localhost:3000/auth/register`;
    const _response = await axios.post(uri, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(!_response.data.success){
      alert("there is an error");
    }

    setResponse({
      success: _response?.data?.success,
      message: _response?.data?.message,
    });

    setTimeout(() => {
      setResponse({
        success: true,
        message: "fill the above details correctly",
      });
    }, 7000);
    }catch(err){
      console.error(err);

    setResponse({
      success: false,
      message: err.response?.data?.message || "Something went wrong",
    });
    }
  }

  return (
    // main container for register component
    <div className="h-screen w-screen flex items-center justify-center bg-black/20">
      {/* card inside register component  */}
      <div className="flex flex-col items-center mx-5 py-10 px-5 rounded-4xl bg-white shadow-2xl">
        {/* header with app logo */}
        <div className="text-blue-500 flex items-center gap-2 font-bold text-2xl mb-10 capitalize">
          <img className="w-8 h-8" src={quickchat} alt="" />
          QuickChat
        </div>

        {/* title component  */}
        <div className="flex w-70 border-b-1 border-black  pb-2">
          <Title title={"SignUp"} size={"text-2xl"} />
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
          {/* file upload input  */}
          <input className="" type="file" name="avatar" hidden />

          {/* Username input field   */}
          <input
            className="bg-black/5 w-[90%] my-1 mx-10 p-4 border-0 outline-0 rounded-xl"
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="off"
            value={formData.username}
            onChange={(e) => handleOnChange(e)}
            required
          />

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

          <div
            className={`pt-1 w-70 ${!response.success ? "text-red-500" : "text-black"}`}
          >
            {response.message}
          </div>

          {/* Button component (common for the all auth pages) */}
          <AuthButton btnTitle={"Create Account"} />
        </form>

        <div className="text-start">
          <Link to={'/'} className="text-blue-500 font-bold underline"> Login </Link>
          If You already have an account
        </div>
      </div>
    </div>
  );
};
