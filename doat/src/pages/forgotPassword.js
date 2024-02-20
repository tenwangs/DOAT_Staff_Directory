import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    axios.defaults.withCredentials = true;
    const handleSubmit = async (e) => {
        e.preventDefault()

       console.log(email);
       try {
           const response = await fetch("http://localhost:4000/api/user/forgotPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                email: email
            })
           })
           const data = await response.json();
           console.log(data)
           if(data.error){
               alert(data.error)
           }else{
               alert(data.message)
               navigate('/login')
           }
       } catch (error) {
           console.error("Error:", error);
       }
    }

  return (
    <div className="flex items-center pb-8  justify-center h-screen bg-gray-200">
      <form className="login bg-white shadow-md rounded px-8 pt-8 pb-40 mb-4 max-w-md w-full" onSubmit={handleSubmit}>
        <h3 className="block text-gray-700 text-sm font-bold mb-2">Forgot password?</h3>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button  className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Send</button>
                    
        </div>
               
      </form>
    </div>
  );
}

export default ForgotPassword;
