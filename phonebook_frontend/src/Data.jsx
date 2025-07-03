import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Data() {
  const navigate = useNavigate();
  const [numbers, setNumbers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  function handleData() {
    fetch(`http://localhost:8000/products`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setNumbers(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    handleData();
  }, []);

  const handleButtonClick = () => {
    navigate('/First');
  };

  function deletephone(id) {
    fetch(`http://localhost:8000/product/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        handleData();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function updateContact(id) {
    const updatedData = {
      name: editName,
      age: editPhone,
    };

    fetch(`http://localhost:8000/product/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Updated:', data);
        setEditId(null);
        handleData();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className='h-screen w-full bg-amber-50 flex justify-center items-center relative'>
      <div className='h-[70%] w-[50%] bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col items-center'>
        <p className='text-3xl flex mt-5 justify-center pt-3'>Phone Book</p>

        <div className="flex items-center w-[70%] h-[10%] mt-5 relative justify-center">
          <input
            className='w-full h-full px-4 py-2 border-2 border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-14'
            type="search"
            placeholder='Enter your name'
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

        <div className='flex-1 w-full overflow-y-auto px-6 py-4 space-y-4 mx-auto mt-4'>
          {numbers.length === 0 ? (
            <p className='text-center text-3xl mt-30'>No phone numbers found</p>
          ) : (
            numbers
              .filter(data => data.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((data, index) => (
              <div key={index} className='bg-gray-100 flex justify-between items-center p-4 rounded shadow'>
                <div className='flex items-center space-x-4'>
                  <button className='h-12 w-12 bg-blue-400 rounded-[50%] text-xl text-white'>
                    {data.name.split(' ').slice(0, 2).map(word => word[0]).join('').toUpperCase()}
                  </button>
                  <div>
                    {editId === data._id ? (
                      <div className='flex flex-col'>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className='border px-2 py-1 mb-2 rounded'
                        />
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className='border px-2 py-1 rounded'
                        />
                      </div>
                    ) : (
                      <>
                        <p className='font-semibold'>{data.name}</p>
                        <p className='text-sm text-gray-600'>{data.age}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className='flex space-x-20'>
                  {editId === data._id ? (
                    <button
                      onClick={() => updateContact(data._id)}
                      className='bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded'
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
                      className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded'
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deletephone(data._id)}
                    className='bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        className="w-[55px] h-[55px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-2xl shadow-xl hover:shadow-2xl absolute ml-[60%] mt-[33%]"
        type="button"
        onClick={handleButtonClick}
      >
        +
      </button>
    </div>
  );
}