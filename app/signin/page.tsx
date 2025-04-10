"use client"
import { useState } from "react";
import Link from "next/link";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const handleSignUp = () => {
      // Handle sign up logic later
      console.log("Signing up...");
    };
  
    return (
        <div 
          className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center"
          style={{ backgroundImage: `url('/green.jpg')` }}
        >
          <div className="w-full max-w-sm bg-white bg-opacity-80 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Sign Up</h2>
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
              className="w-full p-2 border rounded mb-2 bg-gray-100 text-black"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4 bg-gray-100 text-black"
            />
            <button 
              onClick={handleSignUp} 
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Sign Up
            </button>
            <p className="text-center text-sm text-green-800 mt-4">
              Already have an account? <Link href="/" className="text-blue-500 hover:underline">Login</Link>
            </p>
          </div>
        </div>
      );
}