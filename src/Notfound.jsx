import { useNavigate } from "react-router-dom"

export default function Notfound(){
    const navigate= useNavigate()
    return(
        <div className="h-screen w-[100%] bg-gray-200 flex flex-col justify-center items-center pb-[10%] gap-4 ">
            <p className="text-9xl">404</p>
            <p className=" text-4xl">Oops! Page not found.</p>
            <button onClick={()=>navigate("/First")} className="w-[10%] h-10 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-[2%]" >home</button>
        </div>
    )
}