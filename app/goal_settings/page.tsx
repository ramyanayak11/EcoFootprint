"use client";
import { useEffect, useState } from "react";
import MonthlySummary from "./monthlySummary";

type Goal = {
  text: string;
  deadline?: string;
  completed: boolean;
  category: string;
};

export default function GoalSettingsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("ecoGoals");
    if (stored) setGoals(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("ecoGoals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!newGoal.trim() || !category) return;
    setGoals([
      ...goals,
      {
        text: newGoal.trim(),
        deadline,
        completed: false,
        category,
      },
    ]);
    setNewGoal("");
    setDeadline("");
    setCategory("");
  };

  const toggleCompleted = (index: number) => {
    const updated = [...goals];
    updated[index].completed = !updated[index].completed;
    setGoals(updated);
  };

  const deleteGoal = (index: number) => {
    const updated = goals.filter((_, i) => i !== index);
    setGoals(updated);
  };

  const total = goals.length;
  const completed = goals.filter((g) => g.completed).length;
  const planned = total - completed;
  const completionRate = ((completed / (total || 1)) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-green-50 text-green-900 p-6">
      <h2 className="text-2xl font-bold mb-6">Eco Goal Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Goal Form & List */}
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
          <ul className="space-y-2">
            {goals.length === 0 ? (
              <li className="text-sm text-gray-500">No goals set yet. Start now!</li>
            ) : (
              goals.map((goal, index) => (
                <li
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-l-4 border-green-500 pl-3 py-2 bg-green-100 rounded"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleCompleted(index)}
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
                    onClick={() => deleteGoal(index)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Right: Monthly Summary */}
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
