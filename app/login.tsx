"use client";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); 

  const handleLogin = async () => {
    // Step 1: Login with Supabase
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      alert(loginError.message);
      return;
    }

    const user = loginData.user;

    if (!user) {
      alert("Login failed. Try again.");
      return;
    }

    // Step 2: Check if profile exists
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Profile lookup error:", profileError);
      alert("Something went wrong checking profile.");
      return;
    }

    if (!profileData) {
      // Step 2b: Create profile if not found
      const { error: createProfileError } = await supabase.from("profiles").insert([
        {
          user_id: user.id,
          name: "",
          avatar_url: "",
        },
      ]);

      if (createProfileError) {
        console.error("Profile creation error:", createProfileError);
        alert("Failed to create user profile.");
        return;
      }
    }

    // ✅ Step 3: Confirm session is stored (fixes image upload + auth persistence)
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      console.error("Failed to get session after login:", sessionError);
      alert("Login succeeded, but session could not be established.");
      return;
    }

    console.log("SESSION OK:", sessionData.session);

    alert("Login successful!");
    router.push("/homepage");
  };

  // Optional: log session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("SESSION ON LOAD:", data.session);
    });
  }, []);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: `url('/green.jpg')` }}
    >
      <div className="w-full max-w-sm bg-white bg-opacity-80 p-6 rounded-lg shadow-md">
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
      </div>
    </div>
  );
}
