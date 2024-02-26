import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const [agree, setAgree] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      alert("You must agree to the terms and conditions before logging in.");
      return;
    }
    await login(email, password);
  };

  return (
    <div className="flex items-center pb-8 mt-18 justify-center h-screen bg-white rounded">
      <form
        className="login bg-gray-100 border-2 shadow-md rounded px-8 pt-8 pb-40 mb-4 max-w-md w-full "
        onSubmit={handleSubmit}
      >
        <h3 className="block text-gray-700 text-sm font-bold mb-2 ml-20 pl-14">
          Welcome back
        </h3>
        <p className="mb-4 text-gray-600 pl-20 pb-2">
          Please Login to your account
        </p>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
            className="shadow appearance-none hover:bg-gray-200 hover:border-gray-400 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="shadow appearance-none  hover:bg-gray-200  hover:border-gray-400 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            disabled={isLoading}
            className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log in
          </button>
          <Link
            to="/forgot-password"
            className="text-blue-500 underline inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Forgot password?
          </Link>
        </div>
        <div className="mt-8 " href="./termsAndCondition.js">
          <input
            type="checkbox"
            id="agree"
            onChange={(e) => setAgree(e.target.checked)}
            checked={agree}
          />
          <Link to="/terms" className="text-blue-500 ml-4 underline">
            I agree to the terms and conditions
          </Link>
        </div>
        {error && (
          <div className="error text-red-500 text-xs italic">{error}</div>
        )}
      </form>
    </div>
  );
};

export default Login;
