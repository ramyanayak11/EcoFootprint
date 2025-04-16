"use client";
import { useState, useEffect } from "react";

const badgeMilestone = 5;

export default function GamificationPage() {
  const [activityCounts, setActivityCounts] = useState({
    "Used Public Transport": 0,
    "Biked to Work/School": 0,
    "Ate a Vegetarian Meal": 0,
  });
  const [streak, setStreak] = useState(0);

  const [isLoaded, setIsLoaded] = useState(false);              // to avoid showing different values before/after activity log is fetched

  const badgeEmoji = {
    "Used Public Transport": "🚌",
    "Biked to Work/School": "🚴",
    "Ate a Vegetarian Meal": "🌿",
  };

  const getFormattedDate = (date) => {                          // track date for daily streak
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        const res = await fetch("/api/activities");
        const data = await res.json();

        const counts = {
          "Used Public Transport": 0,
          "Biked to Work/School": 0,
          "Ate a Vegetarian Meal": 0,
        };

        const dateSet = new Set();
        
        data.forEach((entry) => {
          const activity = typeof entry === "string" ? entry : entry.activity;
          const date = typeof entry === "string" ? new Date() : new Date(entry.date);

          if (counts[activity] !== undefined) {
            counts[activity]++;
          }

          dateSet.add(getFormattedDate(date));
        });

        setActivityCounts(counts);

        let today = new Date();
        let streakCount = 0;

        while (true) {                                          // manage daily streak
          const formatted = getFormattedDate(today);
          if (dateSet.has(formatted)) {
            streakCount++;
            today.setDate(today.getDate() - 1);
          } else {
            break;
          }
        }

        setStreak(streakCount);
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      }
    };

    fetchActivityLog();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 text-green-900 p-6">
      {isLoaded ? (
        <>
          <h2 className="text-2xl font-bold mb-2">My Eco Achievements</h2>
          <p className="text-green-700 mb-6 text-sm">
            Daily Streak: <span className="font-semibold">{streak} day{streak === 1 ? "" : "s"}</span> 🔥
          </p>
  
          <div className="mb-12 mt-16">
            <div className="flex items-center mb-4">
              <div className="w-40 text-lg font-semibold text-green-900 text-lg">Badges Preview</div>
            </div>
            <div className="flex justify-around flex-1">
              {Object.entries(badgeEmoji).map(([activity, emoji]) => {
                const count = activityCounts[activity];
                const earned = count >= badgeMilestone;
  
                return (
                  <div key={activity} className="flex flex-col items-center">
                    <div
                      className={`w-28 h-28 rounded-full border-4 flex items-center justify-center text-5xl bg-white transition-all ${
                        earned
                          ? "border-green-600 text-green-600"
                          : "border-dashed border-gray-400 text-gray-400 grayscale"
                      }`}
                    >
                      {emoji}
                    </div>
                    <p className="text-xs mt-2 text-gray-600 text-center w-24">{activity}</p>
                  </div>
                );
              })}
            </div>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-16">
            {Object.entries(activityCounts).map(([activity, count]) => {
              const badgesEarned = Math.floor(count / badgeMilestone);
              const remaining = badgeMilestone - (count % badgeMilestone);
              return (
                <div
                  key={activity}
                  className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600"
                >
                  <h3 className="text-lg font-semibold mb-2">{activity}</h3>
                  <p className="text-2xl mb-2">
                    {badgeEmoji[activity]} x {badgesEarned}
                  </p>
                  <p className="text-sm text-gray-600">
                    {remaining === 0
                      ? "You're ready to earn your next badge!"
                      : `Do this ${remaining} more time${remaining > 1 ? "s" : ""} to earn your next badge.`}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-lg text-green-700 animate-pulse">Loading...</p>
        </div>
      )}
    </div>
  );
  
}
