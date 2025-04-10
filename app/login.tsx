"use client"
import { useState } from "react";
import Link from "next/link";

export default function Login() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleLogin = () => {
      setIsLoggedIn(true);
    };
  
    const handleLogout = () => {
      setIsLoggedIn(false);
      setEmail("");
      setPassword("");
    };
  
    return (
        <div 
          className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center"
          style={{ backgroundImage: `url('/green.jpg')` }}
        >
          <div className="w-full max-w-sm bg-white bg-opacity-80 p-6 rounded-lg shadow-md">
            {isLoggedIn ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4 text-green-800">Welcome!</h2>
                <button 
                  onClick={handleLogout} 
                  className="w-full bg-red-500 text-green-400 py-2 rounded-lg hover:bg-red-600">
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-green-800">Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded mb-2 bg-gray-100 text-black"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded mb-4 bg-gray-100 text-black"
                />
                <button 
                  onClick={handleLogin} 
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Login
                </button>
                <p className="text-center text-sm text-green-800 mt-4">
                  Don't have an account? <Link href="/signin" className="text-blue-500 hover:underline">Sign Up</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      );
}