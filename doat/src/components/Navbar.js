import React, { useState } from "react";
import profile from "../images/profile.jpg"; // Replace with your actual profile image path
import logo from "../images/logo.jpg"; // Replace with your actual logo image path
import {useLogout} from '../hooks/useLogout'
import { Link } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext'

function Navbar() {
  const {logout} = useLogout()
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuthContext()

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClick = () => {
    logout()
  } 
  

  return (
    <div>
    <nav className="bg-gray-800 flex items-center justify-between px-4 py-2 pb-4 pt-4">
      <div className="pl-8">
        <img src={logo} className="w-20 h-20 rounded-full" />
      </div>
      <div className="flex flex-col pb-2 pl-60 text-gray-300 justify-between items-center">
  <p className="font-bold text-xl font-serif pr-2">༄༅། ། གནམ་གྲུའི་སྐྱེལ་འདྲེན་ལས་ཁུངས། </p>
  <p className="font-semibold pt-1 font-serif"> DEPARTMENT OF AIR TRANSPORT </p>
</div>

      
      <div className="flex items-center space-x-4 pr-8">
        <input
          type="text"
          placeholder="Search..."
          className="mx-auto px-3 py-2 rounded-md border border-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
        />
        <div className="relative">
          <a href="#" className="flex items-center" onClick={handleProfileClick}>
            <img
              src={profile}
              alt="User profile"
              className="w-10 h-10 rounded-full mr-2"
            />
           
          </a>
          {showDropdown && (
  <div className="relative">
    
    <nav className={`absolute right-0 mt-2  w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${showDropdown ? 'block' : 'hidden'}`}  onClick={handleProfileClick} >
      {user && (
        <div className="py-1">
          <span className="block px-4 py-2 text-sm text-gray-700 font-semibold">{user.email}</span>
          <button 
            onClick={handleClick} 
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 font-bold"
          >
            Log out
          </button>
        </div>
      )}
      {!user && (
        <div className="py-1">
          <Link to="/login" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
          <Link to="/signup" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Signup</Link>
        </div>
      )}
    </nav>
  </div>
)}


        
         
        </div>
      </div>
    </nav>
   
   </div>
  );
}

export default Navbar;
