import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Get today's searches
    const { count: totalSearchesToday } = await supabase
      .from("search_history")
      .select("*", { count: "exact", head: true })
      .gte("timestamp", today.toISOString());

    // Get week's searches
    const { count: totalSearchesWeek } = await supabase
      .from("search_history")
      .select("*", { count: "exact", head: true })
      .gte("timestamp", weekAgo.toISOString());

    // Get top searches
    const { data: searches } = await supabase
      .from("search_history")
      .select("searched_text")
      .gte("timestamp", weekAgo.toISOString());

    const searchCount: Record<string, number> = {};
    searches?.forEach((record) => {
      const key = record.searched_text || "unknown";
      searchCount[key] = (searchCount[key] || 0) + 1;
    });

    const topSearches = Object.entries(searchCount)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);

    // Get trend (last 7 days)
    const searchTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const { count } = await supabase
        .from("search_history")
        .select("*", { count: "exact", head: true })
        .gte("timestamp", date.toISOString())
        .lt("timestamp", nextDay.toISOString());

      searchTrend.push({
        date: date.toISOString().split("T")[0],
        count: count || 0,
      });
    }

    return NextResponse.json({
      totalSearchesToday: totalSearchesToday || 0,
      totalSearchesWeek: totalSearchesWeek || 0,
      topSearches,
      searchTrend,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      {
        totalSearchesToday: 0,
        totalSearchesWeek: 0,
        topSearches: [],
        searchTrend: [],
      },
      { status: 500 }
    );
  }
}
