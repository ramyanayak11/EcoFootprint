"use client";
import Navbar from "./navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-cover bg-center text-white" style={{ backgroundImage: `url('/green.jpg')` }}>
      <Navbar />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-green-900/40 z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center backdrop-blur-lg bg-white/10 border border-white/20 p-10 rounded-2xl shadow-lg max-w-2xl mt-24">
          <h1 className="text-4xl font-extrabold mb-3">Track Your Carbon Footprint</h1>
          <p className="text-lg mb-6 text-white/90">
            EcoFootprint helps you monitor your daily habits, understand your environmental impact, and take action toward a greener lifestyle.
          </p>

          <div className="grid gap-3 text-sm text-left mb-8 text-white/80">
            <p>✅ Calculate your carbon emissions from travel, food, and energy</p>
            <p>✅ Set personal reduction goals and track progress</p>
            <p>✅ Get eco tips and challenges tailored to you</p>
          </div>

          <div className="flex justify-center space-x-6">
            <Link href="/signin">
              <button className="px-6 py-3 rounded-lg text-lg font-semibold bg-green-600 hover:bg-green-700 transition">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="px-6 py-3 rounded-lg text-lg font-semibold bg-white text-green-700 hover:bg-gray-100 transition">
                Login
              </button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-white/60 italic">
            Together, we can lower emissions — one step at a time. 🌍
          </p>
        </div>
      </div>
    </div>
  );
}
