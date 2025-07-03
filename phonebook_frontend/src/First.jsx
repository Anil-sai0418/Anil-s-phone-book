import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function First() {
  const [data , setData] = useState()
  const navigate = useNavigate()

    function handleInput(event){
        // console.log("handle")
        // console.log(event.target.value)
        setData((prev)=>{
            return {
                ...prev , [event.target.name] : event.target.value
            }
        })
    }

    function hadleSubmit(){
        // console.log("okk")
        // console.log(data)
        fetch("http://localhost:8000/product",{
            method : "POST",
            headers : {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res=>res.json())
        .then((data)=> {
            if (data.success) {
                navigate("/data")
                console.log(data.message)
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }

  

  return (
    <div className="w-full h-screen flex justify-center items-center bg-amber-50 flex-col  ">
      <p className="text-4xl mb-6  ">Phone Book</p>
   
      <div className="w-[35%] h-[550px] rounded-2xl bg-white shadow-lg border border-[#ccc] pt-8 px-6 flex flex-col items-center motion-blur-in-md ">
        <p className="text-2xl pt-[8%] mb-6">Add New Contact</p>

        <div className="w-full flex flex-col pt-[14%] gap-6">
          <input
            onChange={handleInput}
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            type="text"
            required
            placeholder="Name"
            name='name'
          />
          <input
          onChange={handleInput}
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            type="text"
            required
            placeholder="Phone Number"
            name='age'
          />
        </div>

        <div className="flex flex-row w-full gap-2 mt-[3.5%]">
          <button
          onClick={hadleSubmit}
            className="mt-6 w-[50%] h-12 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Contact
          </button>
          <button
  onClick={() => navigate("/data")}
  className="mt-6 w-[50%] h-12 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  </svg>
  Contacts
</button>
        </div>
        
      </div>
      
    </div>
    
  );
}