"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleLogin = async () => {
    setLoading(true);
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      toast.error(loginError.message);
      setLoading(false);
      return;
    }

    const user = loginData.user;

    if (!user) {
      toast.error("Login failed. Try again.");
      setLoading(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Profile lookup error:", profileError);
      toast.error("Something went wrong checking profile.");
      setLoading(false);
      return;
    }

    if (!profileData) {
      const { error: createProfileError } = await supabase.from("profiles").insert([
        { user_id: user.id, name: "", avatar_url: "" }
      ]);

      if (createProfileError) {
        toast.error("Failed to create user profile.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    toast.success("Login successful!");
    router.push("/homepage");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") handleLogin();
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("SESSION ON LOAD:", data.session);
    });
  }, []);

  return (
    <motion.div
      onKeyDown={handleKeyPress}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: `url('/green.jpg')` }}
    >
      <Toaster />
      <div className="w-full max-w-sm bg-white bg-opacity-80 p-6 rounded-lg shadow-md">
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
          disabled={loading}
          className={`w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex justify-center items-center transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : null}
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-green-800 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signin" className="text-blue-500 hover:underline">Sign Up</Link>
        </p>
      </div>
    </motion.div>
  );
}
