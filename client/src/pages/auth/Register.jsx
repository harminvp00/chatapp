

import api from "../../api/api.js";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// UI elements
import { Logo } from "../../components/common/Logo.jsx";
import {
  AuthButton,
  Loader,
  Title,
} from "../../components/common/Elements.jsx";

// Context
import { useAuth } from "../../context/AuthContext.jsx";

export const Register = () => {

  const { getCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null); // store response success and message come from api
  const [showLoader, setShowLoader] = useState(false); // enable loader or off it
  const [profileImage, setProfileImage] = useState(null); // store profle image temporary
  const [profilePreview, setProfilePreview] = useState(undefined); // enable the image preview on the react
  const [passwordshow, setPasswordShow] = useState(false); // false -> hide, true -> show


  // store refrence of the image input element
  const Imagefile = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleOnChange(event) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  function handleImageUpload(event) {
    const image = event.target.files[0];
    if (image) {
      setProfileImage(image);
      const localURL = URL.createObjectURL(image);
      setProfilePreview(localURL);
    }
  }

  async function handleOnSubmit(event) {
    event.preventDefault();

    try {
      setShowLoader(true);
      const data = new FormData();

      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const response = await api.post("/auth/register", data, {
        withCredentials: true,
      });


      if (!response?.data?.success) {
        setMessage({
          success: response?.data?.success,
          message: response?.data?.message,
        });
      }

      getCurrentUser();
      navigate('/', { replace: true });
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.code === "OAUTH_EXIST") {
        navigate("/oauth-exists", {
          state: {
            message:
              "The email found as an already registered, you can login through such option",
          },
          replace: true,
        });
      }

      setMessage({
        success: false,
        content: err?.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setShowLoader(false);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
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
          {/* this is a hidden input element to get the file input from the user   */}
          <input
            type="file"
            ref={Imagefile}
            id="profileImage"
            onChange={(e) => handleImageUpload(e)}
            name="profileImage"
            accept="image/*"
            hidden
          />

          {/* file upload input  */}
          <label
            htmlFor={`${!profilePreview ? "profileImage" : ""}`}
            className="relative flex items-center justify-center w-30 h-30 mb-3 rounded-full bg-black/5 cursor-pointer hover:opacity-80"
          >
            {profilePreview ?
              <img className="w-full h-full border-2 border-blue-500 object-cover rounded-full" src={profilePreview} /> :
              <svg className={`rounded-full`} xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#1f1f1f"><path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z" /></svg>
            }


            {/* Enables the edit when the profile button added */}
            {profilePreview ? (
              <>
                {/* button for edit the current image in form  */}
                <button
                  type="button"
                  onClick={() => Imagefile.current.click()}
                  className="absolute z-10 top-20 right-0 bg-white rounded-full p-1 border hover:border-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
                </button>

                {/* button for remove current image in form */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileImage(null);
                    setProfilePreview(null);
                  }}
                  className="absolute z-10 top-12 -right-3 bg-white rounded-full p-1 border hover:border-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                </button>
              </>
            ) : null}
          </label>

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
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff0000"><path d="M508.5-291.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5ZM440-440h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
              {message.content}
            </div>
          ) : null}

          {/* Button component (common for the all auth pages) */}
          <AuthButton btnTitle={"create new account"} />
        </form>

        <div className="text-start flex gap-1">
          <Link to={"/"} className="text-blue-500 font-bold underline">
            Login?
          </Link>
          If You already have an account
        </div>
      </div>
    </div>
  );
};
