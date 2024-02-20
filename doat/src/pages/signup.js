import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(email, password)
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
    <form className="bg-white shadow-md rounded px-8 pt-8 pb-40 mb-4 max-w-md w-full" onSubmit={handleSubmit}>
  <h3 className="block text-gray-700 text-sm pl-40 font-bold mb-2">Sign Up</h3>
  
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email address:</label>
    <input 
      type="email" 
      id="email"
      placeholder="user@gmail.com"
      onChange={(e) => setEmail(e.target.value)} 
      value={email} 
      className="shadow appearance-none hover:border-gray-400 border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-gray-200 focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-6 ">
    <label className="block text-gray-700 hover:border-gray-400 text-sm font-semibold mb-2" htmlFor="password">Password:</label>
    <input 
      type="password" 
      id="password"
      placeholder="********"
      onChange={(e) => setPassword(e.target.value)} 
      value={password} 
      className="shadow  hover:bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="flex items-center justify-between">
    <button disabled={isLoading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign Up</button>
  </div>

  {error && <div className="error text-red-500 text-xs italic">{error}</div>}
</form>
</div>

  )
}

export default Signup