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

  // Add keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); // Prevent default browser behavior
        document.getElementById('search-contacts')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  async function handleData() {
    try {
      const response = await fetch(`https://anil-s-phone-book.onrender.com/products`, { method: "GET" });
      const data = await response.json();
      
      // Process and validate each contact's data
      const cleanedData = data.map(contact => {
        // Log each contact's data for debugging
        console.log('Processing contact:', {
          id: contact._id,
          name: contact.name,
          hasImage: !!contact.profileImage
        });

        return contact;
      });
      
      // Update state with validated data
      setNumbers(cleanedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      showToast("❌ Error loading contacts");
    }
  }

  useEffect(() => {
    handleData();
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

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
    if (!editName.trim() || !editPhone.trim()) {
      showToast("❌ Name and phone number are required");
      return;
    }

    const updatedData = {
      name: editName.trim(),
      age: editPhone.trim()
    };

    console.log('Updating contact:', {
      id,
      name: updatedData.name
    });

    showToast("Updating contact...");
    console.log('Sending update with data:', updatedData);
    // Validate image data before sending
    if (updatedData.profileImage) {
      if (!updatedData.profileImage.startsWith('data:image')) {
        console.error('Invalid image format:', updatedData.profileImage.slice(0, 50) + '...');
        showToast("❌ Invalid image format");
        return;
      }
      
      if (updatedData.profileImage.length > 1024 * 1024) {
        showToast("❌ Image is too large. Please choose a smaller image.");
        return;
      }
    }

    // Ensure the image data is properly formatted
    const dataToSend = {
      ...updatedData,
      profileImage: updatedData.profileImage || null // Send null if no image
    };

    fetch(`https://anil-s-phone-book.onrender.com/product/${id}`, {
      method: "PUT",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(dataToSend),
      credentials: 'omit'
    })
      .then(async response => {
        const text = await response.text();
        console.log('Server response:', text);
        
        if (!response.ok) {
          if (response.status === 413) {
            throw new Error('Image size is too large. Please choose a smaller image.');
          }
          throw new Error(`Server error: ${response.status} - ${text}`);
        }
        
        try {
          return text ? JSON.parse(text) : {};
        } catch (e) {
          console.log('Response parsing error:', e);
          return {};
        }
      })
      .then((data) => {
        console.log('Update successful:', data);
        
        // Update the local state immediately with the response data
        if (data.data) {
          setNumbers(prevNumbers => 
            prevNumbers.map(contact => 
              contact._id === id 
                ? { 
                    ...contact, 
                    name: editName, 
                    age: editPhone
                  }
                : contact
            )
          );
        }
        
        // Reset edit state
        setEditId(null);
        setEditName('');
        setEditPhone('');
        
        showToast(`✅ ${editName} is updated successfully!`);
        
        // Refresh data from server to ensure sync
        setTimeout(() => handleData(), 500);
      })
      .catch((err) => {
        console.error("Update error:", err);
        showToast("❌ Something went wrong while updating. Please try again.");
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
        <div className="fixed z-[9999] top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-black/90 border border-white/20 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-white font-medium text-base sm:text-lg animate-fadeInOut">
          {toast}
        </div>
      )}

      <div className="card w-full max-w-4xl h-[85vh] sm:h-[80vh] flex flex-col items-center relative rounded-3xl bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
        <p className="text-3xl sm:text-4xl font-semibold mt-4 mb-2 tracking-wide k-400 cursor-pointer transition-transform duration-300 hover:scale-105 text-center">Phone Book</p>

        <div className="flex items-center w-[92%] sm:w-[85%] lg:w-[70%] mt-5 relative justify-center group">
          <input
            className="w-full h-12 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-14"
            type="search"
            placeholder='Search contacts'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="search-contacts"
          />
          <div className="absolute right-3 flex items-center gap-2">
            <kbd className="hidden sm:flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium opacity-100 text-gray-400">
              <span className="text-xs">{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</span>K
            </kbd>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 w-full max-w-4xl overflow-y-auto px-3 sm:px-4 py-4 space-y-4 mx-auto mt-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {numbers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className='text-center text-3xl mt-30'>No contacts found</p>
              {/* <button
                onClick={() => navigate('/First')}
                className="mt-4 px-6 py-2 bg-indigo-500/80 hover:bg-indigo-600/90 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Contact
              </button> */}
            </div>
          ) : numbers.filter(data => data.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-300 mb-2">No matching contacts</p>
                <p className="text-gray-400">No contacts found matching "{searchTerm}"</p>
              </div>
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear Search
              </button>
            </div>
          ) : (
            numbers
              .filter(data => data.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((data, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 rounded-2xl shadow-md hover:bg-white/10 transition duration-300 gap-4">
                  <div className='flex items-center space-x-4 w-full sm:w-auto'>
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      {editId === data._id ? (
                        <div className='flex flex-col space-y-2 w-full max-w-xs'>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => handleKeyPressEdit(e, data._id)}
                            className="border border-white/20 bg-white/10 text-white px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            onKeyDown={(e) => handleKeyPressEdit(e, data._id)}
                            className="border border-white/20 bg-white/10 text-white px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                            placeholder="Phone"
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
                  <div className="flex flex-row justify-end space-x-2 w-full sm:w-auto">
                    {editId === data._id ? (
                      <button
                        onClick={() => updateContact(data._id)}
                        className="bg-green-500/80 hover:bg-green-600/90 text-white px-6 py-2 rounded-lg backdrop-blur-md shadow-md transition flex-1 sm:flex-none text-sm sm:text-base"
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
                        className="bg-blue-500/80 hover:bg-blue-600/90 text-white px-6 py-2 rounded-lg backdrop-blur-md shadow-md transition flex-1 sm:flex-none text-sm sm:text-base"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => deletephone(data._id, data.name)}
                      className="bg-red-500/80 hover:bg-red-600/90 text-white px-6 py-2 rounded-lg backdrop-blur-md shadow-md transition flex-1 sm:flex-none text-sm sm:text-base"
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
