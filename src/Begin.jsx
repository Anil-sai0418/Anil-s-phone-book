import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider"

export default function Anil() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/First'); // Navigate to the First component (your contact adding page)
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col justify-center items-center px-6">
     <div className="fixed top-0 left-0 w-full z-50">
       <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
     
    </ThemeProvider>
       <nav className="h-[70px] w-full ">
        <div className='h-full w-[20%] flex justify-center items-center font-bold text-2xl text-white'>Phone Book</div>
         <ThemeProvider/>
         
       </nav>
     </div>
      <img src="/main.jpg" alt="Contact Illustration" className="w-full max-w-[500px] h-auto mx-auto mb-6 motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md" />
      <div className="max-w-2xl mb-20 text-center motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md">
        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
          Welcome to <span className="text-blue-500">My Phone Book</span>
        </h1>
        <p className="text-lg text-gray-200 mb-8">
          Manage all your contacts in one place. Fast, secure, and beautifully organized.
        </p>
   <button
          onClick={handleButtonClick}
          className="px-6 py-3 backdrop-blur-md bg-white/20 border border-white/30 text-white text-lg font-medium rounded-xl shadow-lg hover:bg-white/30 transition duration-300"
        >
          Click Here To Start
        </button>
      </div>
    </div>
  );
}