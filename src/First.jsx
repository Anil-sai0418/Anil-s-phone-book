import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FadeContent from './Fadecontent';

export default function First() {
  const [data, setData] = useState({});
  const [toast, setToast] = useState(""); // For showing success message
  const navigate = useNavigate();

  function handleInput(event) {
    setData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  // Keyboard shortcuts: Enter, Cmd/Ctrl+Enter, Shift+Enter
  function handleKeyPress(event) {
    // CMD/CTRL + Enter → Add Contact
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      handleSubmit();
    }
    // Shift + Enter → Go to Contacts Page
    else if (event.shiftKey && event.key === 'Enter') {
      navigate("/data");
    }
    // Enter → Default Add Contact
    else if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  const handleSubmit = useCallback(() => {
    // Optional: ensure both fields are filled
    if (!data.name || !data.age) {
      setToast("⚠️ Please enter both Name and Phone Number");
      setTimeout(() => setToast(""), 2500);
      return;
    }

    fetch("https://anil-s-phone-book.onrender.com/product", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Show toast
          setToast(`${data.name || "Contact"} is created successfully!`);
          setTimeout(() => {
            setToast(""); // Hide after 2.5s
            navigate("/data"); // Navigate after toast disappears
          }, 2500);
        } else {
          setToast("⚠️ Failed to create contact. Please try again.");
          setTimeout(() => setToast(""), 2500);
        }
      })
      .catch((err) => {
        console.log(err);
        setToast("❌ Something went wrong. Please try again.");
        setTimeout(() => setToast(""), 2500);
      });
  }, [data, navigate, setToast]);

  useEffect(() => {
    const handleGlobalKeyPress = (event) => {
      // Cmd/Ctrl + Enter → Add Contact
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        handleSubmit();
      }
      // Shift + Enter → Go to Contacts Page
      else if (event.shiftKey && event.key === 'Enter') {
        navigate("/data");
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, [handleSubmit, navigate]);

  return (
    <FadeContent duration={1000} easing="ease-out">
      <div className="w-full min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-12 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1124&q=100')] bg-center bg-cover text-center relative">

        {/* Glass UI Toast */}
        {toast && (
          <div className="absolute z-50 top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 backdrop-blur-[16px] bg-[rgba(17,25,40,0.75)] border border-[rgba(255,255,255,0.125)] rounded-2xl shadow-lg text-white font-medium text-sm sm:text-base animate-fadeInOut">
            {toast}
          </div>
        )}

        {/* Back Arrow Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 p-3 backdrop-blur-[16px] bg-[rgba(17,25,40,0.75)] border border-[rgba(255,255,255,0.125)] rounded-xl shadow-lg text-white hover:bg-[rgba(17,25,40,0.9)] transition-all duration-300 hover:scale-110"
          title="Back to Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        

        <div className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(17,25,40,0.75)] border border-[rgba(255,255,255,0.125)] rounded-2xl shadow-2xl px-6 sm:px-10 py-8 flex flex-col justify-center gap-8 w-full max-w-lg sm:max-w-xl min-h-[500px] sm:min-h-[550px] mt-[-60px] sm:mt-[-80px] hover:scale-[1.02] transition-transform duration-300">
          <div className="flex flex-col flex-grow justify-center gap-6">
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-lg select-none -mt-6 sm:-mt-10">Phone Book</p>
            <p className="text-lg sm:text-xl font-medium text-white tracking-tight drop-shadow-lg select-none">Add New Contact</p>
            <div className="flex flex-col gap-5">
              <input
                onChange={handleInput}
                onKeyDown={handleKeyPress}
                className="w-full h-11 sm:h-12 px-4 sm:px-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/20 text-white text-sm sm:text-base placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                type="text"
                required
                placeholder="Name"
                name="name"
                spellCheck="false"
                autoComplete="off"
              />
              <input
                onChange={handleInput}
                onKeyDown={handleKeyPress}
                className="w-full h-11 sm:h-12 px-4 sm:px-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/20 text-white text-sm sm:text-base placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                type="text"
                required
                placeholder="Phone Number"
                name="age"
                spellCheck="false"
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 px-2 sm:px-0">
              <div className="flex-1 group relative">
                <button
                  onClick={handleSubmit}
                  className="w-full h-14 bg-blue-600 backdrop-blur-md rounded-xl border-2 border-blue-400/30 text-white text-lg font-bold tracking-tight hover:bg-blue-700 hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:transform active:scale-95 transition-all duration-300 shadow-lg"
                  type="button"
                >
                  Add Contact
                </button>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-2 bg-gray-900/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-100 transition-all duration-200 shadow-xl pointer-events-none">
                  <span className="px-1.5 py-0.5 bg-gray-800 rounded text-xs font-mono">{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</span>
                  <span>+</span>
                  <span className="px-1.5 py-0.5 bg-gray-800 rounded text-xs font-mono">↵</span>
                </div>
              </div>
              <div className="flex-1 group relative">
                <button
                  onClick={() => navigate("/data")}
                  className="w-full h-14 bg-white/20 backdrop-blur-md rounded-xl border-2 border-white/30 text-white text-lg font-bold tracking-tight hover:bg-white/30 hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:transform active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-2 bg-gray-900/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-100 transition-all duration-200 shadow-xl whitespace-nowrap pointer-events-none">
                  <span className="px-1.5 py-0.5 bg-gray-800 rounded text-xs font-mono">⇧</span>
                  <span>+</span>
                  <span className="px-1.5 py-0.5 bg-gray-800 rounded text-xs font-mono">↵</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeContent>
  );
}
