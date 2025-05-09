"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("/profile.png");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // 🚨 Route guard
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/");
      }
    };
    checkAuth();
  }, [router]);

  // Fetch profile info
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        return;
      }

      const currentUser = userData.user;
      setUser(currentUser);

      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .single();

      if (profileError) {
        console.error("Profile fetch failed:", profileError.message);
        return;
      }

      setName(profiles.name || "");
      setEmail(currentUser.email || "");
      if (profiles.avatar_url) setProfilePic(profiles.avatar_url);
    };

    fetchProfile();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert("User not logged in.");
      return;
    }

    let avatarUrl = profilePic;

    if (selectedFile) {
      const ext = selectedFile.name.split(".").pop();
      const fileName = `${user.id}.${ext}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, selectedFile, { upsert: true });

      if (uploadError) {
        console.error("Image upload failed:", uploadError.message);
        alert("Image upload failed.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      avatarUrl = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        name,
        avatar_url: avatarUrl,
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Update failed:", updateError.message);
      alert("Failed to update profile.");
      return;
    }

    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-green-50 text-green-900 p-6 flex justify-center items-start pt-24">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src={profilePic}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full border-2 border-green-600 object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-3 text-sm"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded bg-gray-100 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-2 border rounded bg-gray-100 text-black"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
