

export const Title = ({title, size}) => {
  return (
    <div className={`${size} font-bold`}>
        {title}
    </div>
  )
}


export const AuthButton = ({btnTitle}) =>{
  return (
    <button className="bg-blue-500 text-xl w-[90%] text-white font-bold cursor-pointer rounded-xl mt-5 mx-10 p-4 not-even:border-0 outline-0">
      {btnTitle}
    </button>
  )
}