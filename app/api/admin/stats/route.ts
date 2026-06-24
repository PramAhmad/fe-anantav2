import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET() {
  try {
    // Get total gestures
    const { count: totalGestures } = await supabase
      .from("gestures")
      .select("*", { count: "exact", head: true });

    // Get today's searches
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: recentSearches } = await supabase
      .from("search_history")
      .select("*", { count: "exact", head: true })
      .gte("timestamp", today.toISOString());

    // Get total searches
    const { count: totalSearches } = await supabase
      .from("search_history")
      .select("*", { count: "exact", head: true });

    // Get top gestures
    const { data: topGestures } = await supabase
      .from("search_history")
      .select("gesture_id, searched_text")
      .limit(1000);

    const gestureCount: Record<string, number> = {};
    topGestures?.forEach((record) => {
      const key = record.searched_text || "unknown";
      gestureCount[key] = (gestureCount[key] || 0) + 1;
    });

    const topList = Object.entries(gestureCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      totalGestures: totalGestures || 0,
      recentSearches: recentSearches || 0,
      totalSearches: totalSearches || 0,
      topGestures: topList,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
