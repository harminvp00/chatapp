
import { Logo } from "../components/common/Logo"
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigateTo = useNavigate();

  return (
    <div className='text-[18px] h-screen flex flex-col justify-center items-center text-center'>
      <Logo />
      <h1 className="font-bold text-8xl mb-5"> 404 </h1>

      <p>
        It Like you are try to access a webpage that is never exists, <br /> please check out your url.
      </p>

      <button
        className="bg-blue-500 px-3 py-2 mt-4 text-white rounded-3xl hover:brightness-130 transition-brightness duration-75 ease-in hover:cursor-pointer"
        onClick={() => navigateTo('/dashboard') }
      >
        Go back
      </button>
    </div>
  )
}
