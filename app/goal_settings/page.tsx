"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MonthlySummary from "./monthlySummary";
import { useRouter } from "next/navigation"; // 🚨 Needed for redirection

interface Goal {
  id: number;
  user_id: string;
  text: string;
  deadline?: string;
  completed: boolean;
  category: string;
  created_at?: string;
}

export default function GoalSettingsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // 👈 used to redirect unauthenticated users

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

  // First fetch user id
  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("User not found. Redirecting to login...");
        return;
      }
      setUserId(userData.user.id);
    };

    fetchUser();
  }, []);

  // Then fetch goals once userId is available
  useEffect(() => {
    if (!userId) return;
    fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching goals:", error.message);
    } else {
      setGoals(data || []);
    }
    setLoading(false);
  };

  const addGoal = async () => {
    if (!newGoal.trim() || !category || !userId) return;

    const { error } = await supabase.from("goals").insert([
      {
        user_id: userId,
        text: newGoal.trim(),
        deadline,
        completed: false,
        category,
      },
    ]);

    if (error) {
      console.error("Error adding goal:", error.message);
    } else {
      fetchGoals();
    }

    setNewGoal("");
    setDeadline("");
    setCategory("");
  };

  const toggleCompleted = async (goal: Goal) => {
    const { error } = await supabase
      .from("goals")
      .update({ completed: !goal.completed })
      .eq("id", goal.id);

    if (error) {
      console.error("Error toggling goal:", error.message);
    } else {
      fetchGoals();
    }
  };

  const deleteGoal = async (goalId: number) => {
    const { error } = await supabase.from("goals").delete().eq("id", goalId);

    if (error) {
      console.error("Error deleting goal:", error.message);
    } else {
      fetchGoals();
    }
  };

  const total = goals.length;
  const completed = goals.filter((g) => g.completed).length;
  const planned = total - completed;
  const completionRate = ((completed / (total || 1)) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-green-50 text-green-900 p-6">
      <h2 className="text-2xl font-bold mb-6">Eco Goal Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side: Goal Form & List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Set a New Goal</h3>

          <div className="flex flex-col gap-3 mb-3">
            <input
              type="text"
              placeholder="e.g. Use reusable bags"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="p-2 border rounded bg-gray-100 text-black"
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="p-2 border rounded bg-gray-100 text-black"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded bg-gray-100 text-black"
            >
              <option value="">Select Category</option>
              <option value="Diet">🥗 Diet</option>
              <option value="Transportation">🚲 Transportation</option>
              <option value="Energy">💡 Energy</option>
              <option value="Waste">🧼 Waste</option>
            </select>

            <button
              onClick={addGoal}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
            >
              ➕ Add Goal
            </button>
          </div>

          <h4 className="font-semibold mt-4 mb-2">Your Goals</h4>

          {loading ? (
            <p className="text-sm text-gray-500">Loading goals...</p>
          ) : goals.length === 0 ? (
            <p className="text-sm text-gray-500">No goals set yet. Start now!</p>
          ) : (
            <ul className="space-y-2">
              {goals.map((goal) => (
                <li
                  key={goal.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-l-4 border-green-500 pl-3 py-2 bg-green-100 rounded"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleCompleted(goal)}
                      className="accent-green-600"
                    />
                    <div>
                      <p className={`${goal.completed ? "line-through text-gray-500" : ""}`}>
                        {goal.text}
                      </p>
                      <div className="text-xs text-gray-600 space-y-1">
                        {goal.deadline && <p>Due: {goal.deadline}</p>}
                        <p>Category: <span className="font-semibold">{goal.category}</span></p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right side: Monthly Summary */}
        <MonthlySummary
          goals={goals}
          total={total}
          completed={completed}
          planned={planned}
          completionRate={completionRate}
        />
      </div>
    </div>
  );
}
