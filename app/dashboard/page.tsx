"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [activities, setActivities] = useState<string[]>([]);
  const [news, setNews] = useState<{ title: string; source: string }[]>([]);
  const [customActivity, setCustomActivity] = useState("");


  const handleLog = async (activity: string) => {
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity }),
      });
      const data = await res.json();
      if (data.success) {
        setActivities((prev) => [...prev, activity]); // Only update local UI
      }
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  };

  
  /** 
  // 🔥 Fetch real news from your API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data); // expects array of { title, source }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
    };

    fetchNews();
  }, []);
  
*/

  return (
    <div className="min-h-screen bg-green-50 text-green-900 p-6">
      {/* Profile section */}
      <div className="flex items-center space-x-4 mb-6">
        <img 
          src="/profile.png" 
          alt="Profile" 
          className="w-12 h-12 rounded-full border-2 border-green-700"
        />
        <h2 className="text-2xl font-bold">Welcome Back!</h2>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Carbon Tracker */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Log Your Activity</h3>

            {/* Custom input log */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g. Planted a tree"
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                className="flex-1 p-2 border rounded bg-gray-100 text-black"
              />
              <button
                onClick={() => {
                  if (customActivity.trim()) {
                    handleLog(customActivity.trim());
                    setCustomActivity(""); // clear input
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Add
              </button>
            </div>

            {/* Quick log buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => handleLog("Used Public Transport")}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              >
                I took public transport
              </button>
              <button 
                onClick={() => handleLog("Biked to Work")}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              >
                I biked to work
              </button>
              <button 
                onClick={() => handleLog("Ate Vegetarian Meal")}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              >
                I ate a vegetarian meal
              </button>
            </div>

            {/* Activity log */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Your Logs</h4>
              <ul className="list-disc pl-6 text-sm text-green-800 space-y-1">
                {activities.length === 0 ? (
                  <li>No logs yet. Start by recording one!</li>
                ) : (
                  activities.map((act, idx) => <li key={idx}>{act}</li>)
                )}
              </ul>
            </div>
          </div>


        {/* Environmental News */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Latest Environmental News</h3>
          <ul className="space-y-4">
            {news.length === 0 ? (
              <p className="text-sm text-gray-500">Loading news...</p>
            ) : (
              news.map((article, index) => (
                <li key={index} className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium">{article.title}</p>
                  <p className="text-sm text-gray-500">Source: {article.source}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
