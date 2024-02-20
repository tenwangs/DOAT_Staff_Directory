// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from "./hooks/useAuthContext.js";

import Login from "./pages/login.js";
import Details from "./pages/details.js";
import Navbar from "./components/Navbar.js";
import Home from "./pages/home.js";
import Signup from "./pages/signup.js";
import TermsAndConditions from "./pages/termsAndCondition.js";
import ForgotPassword from "./pages/forgotPassword.js";
import Footer from "./components/footer.js";


function App() {
  const { user } = useAuthContext();
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to='/' />} />
            <Route path="/" element={user ? <Home /> : <Navigate to='/login' />} />
            <Route path="/:id" element={user ? <Details /> : <Navigate to='/login' />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to='/login' />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </div>
        
      </div>
      <Footer />
    </Router>
  );
}

export default App;
