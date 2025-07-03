import { useNavigate } from 'react-router-dom';

export default function Anil() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/First'); // Navigate to the First component (your contact adding page)
  };

  return (
   
    <div className="h-screen w-full bg-[#f9fafb] flex justify-center items-center px-6">
      <div className="max-w-2xl text-center motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md ">
        <h1 className="text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Welcome to <span className="text-blue-500">My Phone Book</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage all your contacts in one place. Fast, secure, and beautifully organized.
        </p>
        <button
          onClick={handleButtonClick}
          className="px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          Add Contact
        </button>
      </div>
    </div>
    
  );
}