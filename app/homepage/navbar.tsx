"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="w-full px-6 py-4 bg-green bg-opacity-80 backdrop-blur-md shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Title */}
        <Link href="/" className="text-white font-bold text-xl">
          EcoFootprint
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-white hover:text-green-900">Home</Link>
          <Link href="/dashboard" className="text-white hover:text-green-900">Dashboard</Link>
          <Link href="/goal_settings" className="text-white hover:text-green-900">Goals</Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-white hover:text-green-900 focus:outline-none"
            >
              Profile ⌄
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                >
                  Edit Profile
                </Link>
                <Link
                  href="/logout"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
