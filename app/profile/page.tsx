"use client";
import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [profilePic, setProfilePic] = useState("/profile.png");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    console.log("Saving profile...");
    // TODO: Save name, email, and profile pic to backend later
  };

  return (
    <div className="min-h-screen bg-green-50 text-green-900 p-6 flex justify-center items-start pt-24">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

        {/* Profile Pic */}
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

        {/* Form */}
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
              onChange={(e) => setEmail(e.target.value)}
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
