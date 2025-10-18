import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FadeContent from './FadeContent';

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

  // Keyboard Enter key submission
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  function handleSubmit() {
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
  }

  return (
    <FadeContent duration={1000} easing="ease-out">
      <div className="w-full min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-12 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1124&q=100')] bg-center bg-cover text-center relative">

        {/* Glass UI Toast */}
        {toast && (
          <div className="absolute z-50 top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 backdrop-blur-[16px] bg-[rgba(17,25,40,0.75)] border border-[rgba(255,255,255,0.125)] rounded-2xl shadow-lg text-white font-medium text-sm sm:text-base animate-fadeInOut">
            {toast}
          </div>
        )}

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
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSubmit}
                className="flex-1 h-12 sm:h-14 bg-blue-500/80 backdrop-blur-md rounded-xl border border-white/20 text-white text-base sm:text-lg font-semibold tracking-tight hover:bg-blue-600/90 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 shadow-sm"
                type="button"
              >
                Add Contact
              </button>
              <button
                onClick={() => navigate("/data")}
                className="flex-1 h-12 sm:h-14 bg-white/15 backdrop-blur-md rounded-xl border border-white/20 text-white text-base sm:text-lg font-semibold tracking-tight hover:bg-white/25 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
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
            </div>
          </div>
        </div>
      </div>
    </FadeContent>
  );
}
