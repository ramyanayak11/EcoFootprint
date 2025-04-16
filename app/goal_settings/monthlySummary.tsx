"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type Goal = {
  text: string;
  deadline?: string;
  completed: boolean;
  category: string;
};

type SummaryProps = {
  goals: Goal[];
  total: number;
  completed: number;
  planned: number;
  completionRate: string;
};

export default function MonthlySummary({
  goals,
  total,
  completed,
  planned,
  completionRate,
}: SummaryProps) {
  const categoryProgress = goals.reduce(
    (acc: Record<string, { total: number; completed: number }>, goal) => {
      if (!acc[goal.category]) {
        acc[goal.category] = { total: 0, completed: 0 };
      }
      acc[goal.category].total += 1;
      if (goal.completed) acc[goal.category].completed += 1;
      return acc;
    },
    {}
  );

  const chartData = {
    labels: Object.keys(categoryProgress),
    datasets: [
      {
        label: "Category Completion %",
        data: Object.values(categoryProgress).map(({ total, completed }) =>
          total === 0 ? 0 : Number(((completed / total) * 100).toFixed(1))
        ),
        backgroundColor: ["#34D399", "#60A5FA", "#FBBF24", "#F87171"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const getMessage = () => {
    if (completed === total && total > 0) {
      return "🏅 You completed all your goals! Excellent work!";
    } else if (completed >= Math.ceil(total * 0.7)) {
      return "👏 You're doing great! Keep pushing!";
    } else if (total === 0) {
      return "🌱 Start setting your first goal!";
    } else {
      return "🌱 Small steps matter. Keep going!";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">🌿 Monthly Summary</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
        <div className="bg-green-100 p-3 rounded text-center">
          <p className="font-medium text-green-800">Total</p>
          <p className="text-2xl font-bold text-green-900">{total}</p>
        </div>
        <div className="bg-green-100 p-3 rounded text-center">
          <p className="font-medium text-green-800">Completed</p>
          <p className="text-2xl font-bold text-green-900">{completed}</p>
        </div>
        <div className="bg-yellow-100 p-3 rounded text-center">
          <p className="font-medium text-yellow-800">Planned</p>
          <p className="text-2xl font-bold text-yellow-900">{planned}</p>
        </div>
      </div>

      <div className="w-full mt-2 mb-4">
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-gray-700 font-medium">Progress</span>
          <span className="text-green-700 font-bold">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded">
          <div
            className="bg-green-600 h-3 rounded transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 rounded text-sm text-green-900">
        {getMessage()}
      </div>

      <div className="mt-6 text-center">
        <h4 className="text-lg font-semibold mb-3">📊 Category Completion %</h4>
        {Object.keys(categoryProgress).length === 0 ? (
          <p className="text-sm text-gray-500">No category progress to show.</p>
        ) : (
          <div className="w-64 mx-auto">
            <Pie data={chartData} />
            <ul className="text-sm mt-3 text-left mx-auto w-fit space-y-1">
              {Object.entries(categoryProgress).map(([cat, val]) => {
                const percent = val.total
                  ? ((val.completed / val.total) * 100).toFixed(1)
                  : "0";
                const icon =
                  cat === "Diet"
                    ? "🥗"
                    : cat === "Transportation"
                    ? "🚲"
                    : cat === "Energy"
                    ? "💡"
                    : cat === "Waste"
                    ? "🧼"
                    : "📦";

                return (
                  <li key={cat} className="flex justify-between gap-4 items-center">
                    <span>{icon} {cat}</span>
                    <span className="font-semibold">{percent}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
