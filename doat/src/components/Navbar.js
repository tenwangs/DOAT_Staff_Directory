import React, { useState, useEffect } from "react";
import logo from "../images/logo.png"; // Replace with your actual logo image path
import { useLogout } from '../hooks/useLogout'
import { Link } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext'
import profile from "../images/profile.jpg";
import Avatar from 'react-avatar'; // Import the Avatar component

function Navbar() {
  const { logout } = useLogout();
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuthContext();

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClick = () => {
    logout();
  };

  return (
    <div>
      <nav className="bg-gray-800 flex items-center justify-between px-4 py-2">
        <div className="pl-8">
          <img src={logo} alt="logo" className="h-24" />
        </div>
        <div className="flex flex-col pb-2 text-gray-300 justify-center items-center">
          <p className="font-bold text-xl pr-2 text-center">༄༅། ། གནམ་གྲུའི་སྐྱེལ་འདྲེན་ལས་ཁུངས། </p>
          <p className="font-semibold pt-1 font-arial text-center"> DEPARTMENT OF AIR TRANSPORT </p>
        </div>
        <div className="flex items-center space-x-4 pr-8">
          {user ? (
            <div className="relative">
              <Avatar
                name={user.email}
                size="48"
                round={true}
                onClick={handleProfileClick}
              />
              {showDropdown && (
                <div className="relative">
                  <nav className={`absolute right-0 mt-2  w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${showDropdown ? 'block' : 'hidden'}`}  onClick={handleProfileClick} >
                    <div className="py-1">
                      <span className="block px-4 py-2 text-sm text-gray-700 font-semibold">{user.email}</span>
                      <button 
                        onClick={handleClick} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 font-bold"
                      >
                        Log out
                      </button>
                    </div>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <img
                src={profile}
                alt="User profile"
                className="w-12 h-12 rounded-full mr-2"
                onClick={handleProfileClick}
              />
              {showDropdown && (
                <div className="relative">
                  <nav className={`absolute right-0 mt-2  w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${showDropdown ? 'block' : 'hidden'}`}  onClick={handleProfileClick} >
                    <div className="py-1">
                      <Link to="/login" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
                      <Link to="/signup" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Signup</Link>
                    </div>
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
