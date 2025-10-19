import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Data() {
  const navigate = useNavigate();
  const [numbers, setNumbers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(""); // Toast message

  function handleData() {
    fetch(`https://anil-s-phone-book.onrender.com/products`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => setNumbers(data))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    handleData();
  }, []);

  const handleButtonClick = () => {
    navigate('/First');
  };

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2500); // Auto-dismiss
  }

  function deletephone(id, name) {
    fetch(`https://anil-s-phone-book.onrender.com/product/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then(() => {
        showToast(`${name} is deleted successfully!`);
        handleData();
      })
      .catch((err) => {
        console.log(err);
        showToast("❌ Something went wrong while deleting.");
      });
  }

  function updateContact(id) {
    const updatedData = { name: editName, age: editPhone };

    fetch(`https://anil-s-phone-book.onrender.com/product/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
      .then(() => {
        showToast(`${editName} is updated successfully!`);
        setEditId(null);
        handleData();
      })
      .catch((err) => {
        console.log(err);
        showToast("❌ Something went wrong while updating.");
      });
  }

  // Enter key triggers updateContact in edit mode
  function handleKeyPressEdit(event, id) {
    if (event.key === 'Enter') {
      updateContact(id);
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center relative px-4 py-6 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">

      {/* Toast Popup */}
      {toast && (
        <div className="absolute z-50 top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 backdrop-blur-[16px] bg-[rgba(17,25,40,0.75)] border border-[rgba(255,255,255,0.125)] rounded-2xl shadow-lg text-white font-medium text-sm sm:text-base animate-fadeInOut">
          {toast}
        </div>
      )}

      <div className="card w-full max-w-4xl h-[85vh] sm:h-[80vh] flex flex-col items-center relative rounded-3xl bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
        <p className="text-3xl sm:text-4xl font-semibold mt-4 mb-2 tracking-wide k-400 cursor-pointer transition-transform duration-300 hover:scale-105 text-center">Phone Book</p>

        <div className="flex items-center w-[92%] sm:w-[85%] lg:w-[70%] mt-5 relative justify-center">
          <input
            className="w-full h-12 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-14"
            type="search"
            placeholder='Search contacts'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 text-gray-600 absolute right-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
        </div>

        <div className="flex-1 w-full max-w-4xl overflow-y-auto px-3 sm:px-4 py-4 space-y-4 mx-auto mt-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {numbers.length === 0 ? (
            <p className='text-center text-3xl mt-30'>No phone numbers found</p>
          ) : (
            numbers
              .filter(data => data.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((data, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 flex justify-between items-center p-4 sm:p-5 rounded-2xl shadow-md hover:bg-white/10 transition duration-300">
                  <div className='flex items-center space-x-4'>
                    <button className="h-12 w-12 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-lg font-bold text-white shadow-md">
                      {data.name.split(' ').slice(0, 2).map(word => word[0]).join('').toUpperCase()}
                    </button>
                    <div>
                      {editId === data._id ? (
                        <div className='flex flex-col'>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => handleKeyPressEdit(e, data._id)}
                            className="border border-white/20 bg-white/10 text-white px-2 py-1 mb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            onKeyDown={(e) => handleKeyPressEdit(e, data._id)}
                            className="border border-white/20 bg-white/10 text-white px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="font-semibold text-base sm:text-lg text-white">{data.name}</p>
                          <p className="text-xs sm:text-sm text-gray-400">{data.age}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    {editId === data._id ? (
                      <button
                        onClick={() => updateContact(data._id)}
                        className="bg-green-500/80 hover:bg-green-600/90 text-white px-4 py-1 rounded-lg backdrop-blur-md shadow-md transition"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditId(data._id);
                          setEditName(data.name);
                          setEditPhone(data.age);
                        }}
                        className="bg-blue-500/80 hover:bg-blue-600/90 text-white px-4 py-1 rounded-lg backdrop-blur-md shadow-md transition"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => deletephone(data._id, data.name)}
                      className="bg-red-500/80 hover:bg-red-600/90 text-white px-4 py-1 rounded-lg backdrop-blur-md shadow-md transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={handleButtonClick}
            className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-[rgba(17,25,40,0.75)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.15)] rounded-full shadow-full text-white text-3xl sm:text-4xl font-bold hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-transform duration-300"
            type="button"
          >
            +
          </button>
        </div>

      </div>
    </div>
  );
}
