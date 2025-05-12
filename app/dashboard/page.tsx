"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

const CO2_LOOKUP: Record<string, number> = {
  "Used Public Transport": 2.5,
  "Biked to Work": 3.2,
  "Ate Vegetarian Meal": 1.5,
  "Recycled Paper": 0.8,
  "Recycled Plastic": 1.0,
  "Planted a Tree": 20.0,
  "Took Cold Shower": 0.5,
  "Avoided Disposable Cutlery": 0.3,
  "Composted Organic Waste": 1.1,
  "Air Dried Clothes": 1.4,
  "Reduced Home Heating": 2.2,
  "Carpooled with Friends": 3.0,
  "Used Reusable Bags": 0.6,
  "Donated Old Clothes": 0.9,
  "Avoided Fast Fashion": 1.2,
};

const DEFAULT_ACTIVITIES = [
  "Used Public Transport",
  "Biked to Work",
  "Ate Vegetarian Meal",
  "Planted a Tree",
  "Recycled Plastic",
];

const EXTRA_ACTIVITIES = Object.keys(CO2_LOOKUP).filter(
  (act) => !DEFAULT_ACTIVITIES.includes(act)
);

export default function Dashboard() {
  const [activities, setActivities] = useState<string[]>([]);
  const [news, setNews] = useState<{ title: string; source: string; source_url?: string }[]>([]);

  const [customActivity, setCustomActivity] = useState("");
  const [customEmission, setCustomEmission] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [customEmissions, setCustomEmissions] = useState<Record<string, number>>({});
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) router.push("/");
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      const uid = userData.user.id;
      setUserId(uid);

      const { data: activityData } = await supabase
        .from("activities")
        .select("activity")
        .eq("user_id", uid);
      setActivities(activityData?.map((row) => row.activity) || []);

      const { data: emissionData } = await supabase
        .from("custom_emissions")
        .select("*")
        .eq("user_id", uid);
      const map: Record<string, number> = {};
      emissionData?.forEach((row) => (map[row.activity] = row.co2_value));
      setCustomEmissions(map);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
    };
    fetchNews();
  }, []);

  const handleLog = async (activity: string, customCO2?: number) => {
    if (!userId) return;
    const { error } = await supabase.from("activities").insert([
      { activity, user_id: userId, date: new Date().toISOString() },
    ]);
    if (error) return console.error("Failed to log:", error.message);
    if (customCO2 !== undefined) {
      await supabase
        .from("custom_emissions")
        .upsert([{ activity, user_id: userId, co2_value: customCO2 }], {
          onConflict: "activity, user_id",
        });
      setCustomEmissions((prev) => ({ ...prev, [activity]: customCO2 }));
    }
    setActivities((prev) => [...prev, activity]);
  };

  const getCO2ForActivity = (act: string): number =>
    CO2_LOOKUP[act] ?? customEmissions[act] ?? 0;

  const totalCO2Saved = activities.reduce(
    (sum, act) => sum + getCO2ForActivity(act),
    0
  );

  return (
    <div className="min-h-screen w-full bg-[url('/green.jpg')] bg-cover bg-center bg-no-repeat text-green-900 p-6">
      <div className="flex items-center space-x-4 mb-6">
        <img src="/profile.png" alt="Profile" className="w-12 h-12 rounded-full border-2 border-green-700" />
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">Welcome Back!</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Logger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-green-900">🌱 Log Your Activity</h3>

          <div className="flex flex-col gap-2 mb-4">
            <input
              type="text"
              placeholder="e.g. Planted a tree"
              value={customActivity}
              onChange={(e) => setCustomActivity(e.target.value)}
              className="p-2 border rounded bg-gray-100 text-black"
            />
            {customActivity &&
              !(CO2_LOOKUP[customActivity] || customEmissions[customActivity]) && (
                <input
                  type="number"
                  placeholder="Enter CO₂ saved (kg)"
                  value={customEmission}
                  onChange={(e) => setCustomEmission(e.target.value)}
                  className="p-2 border rounded bg-gray-100 text-black"
                />
              )}
            <button
              onClick={() => {
                if (!customActivity.trim()) return;
                const co2 = customEmission ? parseFloat(customEmission) : undefined;
                handleLog(customActivity.trim(), co2);
                setCustomActivity("");
                setCustomEmission("");
              }}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>

          {[...DEFAULT_ACTIVITIES, ...(showMore ? EXTRA_ACTIVITIES : [])].map((act) => (
            <button
              key={act}
              onClick={() => handleLog(act)}
              className="w-full mb-2 bg-green-100 text-green-800 border border-green-300 py-2 px-4 rounded hover:bg-green-200 transition text-left"
            >
              {act}
            </button>
          ))}

          <button
            className="mt-2 text-sm text-blue-600 hover:underline"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show Less" : "Show More"}
          </button>

          <div className="mt-6">
            <h4 className="font-semibold mb-2 text-green-800">Your Logs</h4>
            <ul className="list-disc pl-6 text-sm text-green-800 space-y-1">
              {activities.length === 0 ? (
                <li>No logs yet.</li>
              ) : (
                activities.map((act, idx) => <li key={idx}>{act}</li>)
              )}
            </ul>
            <p className="mt-4 text-green-900 font-medium">
              Estimated CO₂ Saved: <span className="font-bold">{totalCO2Saved.toFixed(1)} kg</span>
            </p>
          </div>
        </motion.div>

        {/* News */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-green-900">🌍 Environmental News</h3>
          <ul className="space-y-4">
            {news.length === 0 ? (
              <p className="text-sm text-gray-500">Loading news...</p>
            ) : (
              news.map((article, index) => (
                <li key={index} className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-green-800">{article.title}</p>
                  <p className="text-sm text-gray-500">Source: {article.source_url}</p>
                </li>
              ))
            )}
          </ul>
        </motion.div>

        {/* Achievements CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-6 col-span-1 md:col-span-2"
        >
          <div className="flex justify-center">
            <Link href="/achievements">
              <button className="px-6 py-3 rounded-lg text-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition">
                View My Achievements
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
