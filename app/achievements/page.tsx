"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RocketIcon, FlameIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import clsx from "clsx";
import { useRouter } from "next/navigation"; // ✅ Needed to redirect unauthenticated users

const BADGE_MILESTONE = 5;

const badgeEmojis = {
  Diet: "🥗",
  Transportation: "🚲",
  Energy: "💡",
  Waste: "🧼",
};

export default function GamificationPage() {
  const [achievements, setAchievements] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // ✅ Route protection
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
    const fetchGamificationData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        console.error("No user session");
        return;
      }

      const userId = userData.user.id;

      const { data: achievementData, error: achievementError } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", userId);

      if (achievementError) {
        console.error("Failed to fetch achievements:", achievementError.message);
        return;
      }

      const counts: Record<string, number> = {};
      achievementData?.forEach((ach) => {
        counts[ach.category] = ach.count;
      });
      setAchievements(counts);

      setIsLoaded(true);
    };

    fetchGamificationData();
  }, []);

  const calculateBadges = (count: number) => Math.floor(count / BADGE_MILESTONE);
  const calculateProgressToNextBadge = (count: number) => BADGE_MILESTONE - (count % BADGE_MILESTONE);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="animate-pulse text-green-700 text-lg">Loading your eco achievements...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-50 to-green-100 p-6 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-green-900">🌿 Eco Journey</h1>
        <p className="text-green-700">Track your progress, earn badges, and stay green!</p>
      </div>

      {/* Streak */}
      <Alert className="max-w-md mx-auto bg-green-100">
        <FlameIcon className="h-5 w-5 text-red-500" />
        <AlertTitle>Daily Streak</AlertTitle>
        <AlertDescription className="text-lg">
          🔥 {streak} {streak === 1 ? "day" : "days"} streak active!
        </AlertDescription>
      </Alert>

      {/* Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {Object.entries(badgeEmojis).map(([category, emoji]) => {
          const count = achievements[category] || 0;
          const earned = calculateBadges(count) > 0;

          return (
            <Card
              key={category}
              className={clsx(
                "hover:scale-105 transition-transform",
                earned ? "border-green-600" : "border-gray-300"
              )}
            >
              <CardHeader>
                <div className="flex justify-center text-5xl">{emoji}</div>
                <CardTitle className="text-center text-green-800">{category}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                {earned ? (
                  <Badge variant="default" className="bg-green-600 text-white">
                    {calculateBadges(count)} Badge{calculateBadges(count) > 1 ? "s" : ""}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-gray-500">
                    Not Yet Earned
                  </Badge>
                )}
                <Progress value={(count % BADGE_MILESTONE) * 20} />
                <p className="text-xs text-gray-500">
                  {calculateProgressToNextBadge(count)} more to next badge
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="flex justify-center">
        <Button variant="default" className="bg-green-600 hover:bg-green-700">
          <RocketIcon className="mr-2 h-5 w-5" /> Start a New Eco Challenge
        </Button>
      </div>
    </div>
  );
}
