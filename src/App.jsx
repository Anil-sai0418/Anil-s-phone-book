import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Data from './Data'
import First from './First'
import Notfound from './Notfound';
import Begin from './Begin'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
       <Route path="/" element={<Begin/>} />
       <Route path='/begin' element ={<Begin/>}/>
       <Route path='*' element={<Notfound/>}/>
      <Route path="/First" element={<First />} />
      <Route path="/Data" element={<Data />} />

      </Routes>
      </BrowserRouter>
 
    </>
  )
}

export default App
