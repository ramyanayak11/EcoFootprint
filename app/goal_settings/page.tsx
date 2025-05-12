"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MonthlySummary from "./monthlySummary";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) return;
      setUserId(userData.user.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("goals").select("*").eq("user_id", userId);
    if (!error) setGoals(data || []);
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
    if (!error) fetchGoals();
    setNewGoal(""); setDeadline(""); setCategory("");
  };

  const toggleCompleted = async (goal: Goal) => {
    await supabase.from("goals").update({ completed: !goal.completed }).eq("id", goal.id);
    fetchGoals();
  };

  const deleteGoal = async (goalId: number) => {
    await supabase.from("goals").delete().eq("id", goalId);
    fetchGoals();
  };

  const total = goals.length;
  const completed = goals.filter((g) => g.completed).length;
  const planned = total - completed;
  const completionRate = ((completed / (total || 1)) * 100).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen w-full bg-[url('/green.jpg')] bg-cover bg-center bg-no-repeat text-green-900 p-6"
    >
      <motion.h2
        className="text-2xl font-bold mb-6 text-green-100"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Eco Goal Settings
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
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
                <motion.li
                  key={goal.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-l-4 border-green-500 pl-3 py-2 bg-green-100 rounded"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
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
                        <p>
                          Category: <span className="font-semibold">{goal.category}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Right side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MonthlySummary
            goals={goals}
            total={total}
            completed={completed}
            planned={planned}
            completionRate={completionRate}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
