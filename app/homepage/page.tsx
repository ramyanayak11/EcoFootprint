"use client";
import Navbar from "./navbar";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url('/green.jpg')` }}
    >
      <Navbar />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-green-900/40 z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80 }}
          className="text-center backdrop-blur-lg bg-white/10 border border-white/20 p-10 rounded-2xl shadow-lg max-w-2xl mt-24"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-extrabold mb-3"
          >
            Track Your Carbon Footprint
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg mb-6 text-white/90"
          >
            EcoFootprint helps you monitor your daily habits, understand your
            environmental impact, and take action toward a greener lifestyle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid gap-3 text-sm text-left mb-8 text-white/80"
          >
            <p>✅ Calculate your carbon emissions from travel, food, and energy</p>
            <p>✅ Set personal reduction goals and track progress</p>
            <p>✅ Get eco tips and challenges tailored to you</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center space-x-6"
          >
            <Link href="/signin">
              <button className="px-6 py-3 rounded-lg text-lg font-semibold bg-green-600 hover:bg-green-700 transition">
                Get Started
              </button>
            </Link>
            <Link href="/">
              <button className="px-6 py-3 rounded-lg text-lg font-semibold bg-white text-green-700 hover:bg-gray-100 transition">
                Login
              </button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-xs text-white/60 italic"
          >
            Together, we can lower emissions — one step at a time. 🌍
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
