"use client";

import { useEffect, useState } from "react";

type AnalyticsData = {
  topSearches: { word: string; count: number }[];
  searchTrend: { date: string; count: number }[];
  totalSearchesToday: number;
  totalSearchesWeek: number;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics");
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <div className="text-center text-slate-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="text-sm text-slate-600 font-medium">Today</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            {data?.totalSearchesToday || 0}
          </div>
          <p className="mt-1 text-xs text-slate-500">searches</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="text-sm text-slate-600 font-medium">This Week</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            {data?.totalSearchesWeek || 0}
          </div>
          <p className="mt-1 text-xs text-slate-500">searches</p>
        </div>
      </div>

      {/* Top Searches Chart */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-6 text-lg font-semibold text-slate-900">
          Top 15 Most Searched Gestures
        </h3>

        <div className="space-y-4">
          {data?.topSearches?.slice(0, 15).map((item, idx) => {
            const maxCount = Math.max(...(data.topSearches?.map(s => s.count) || [1]));
            const percentage = (item.count / maxCount) * 100;

            return (
              <div key={item.word}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-900 capitalize">
                      {item.word}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-600">
                    {item.count}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Trend */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Search Trend (Last 7 Days)
        </h3>

        <div className="flex items-end justify-around h-32 gap-2">
          {data?.searchTrend?.map((day, idx) => {
            const maxCount = Math.max(...(data.searchTrend?.map(d => d.count) || [1]));
            const heightPercent = (day.count / maxCount) * 100;

            return (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full rounded-t bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer"
                  style={{ height: `${heightPercent}%` }}
                  title={`${day.count} searches`}
                />
                <div className="text-xs text-slate-600 font-medium">
                  {new Date(day.date).toLocaleDateString("id-ID", {
                    weekday: "short",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export */}
      <div className="rounded-lg bg-blue-50 p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">📊 Export Data</h3>
        <button
          onClick={() => {
            const csv = [
              ["Word", "Count"],
              ...(data?.topSearches?.map(s => [s.word, s.count]) || []),
            ]
              .map(row => row.join(","))
              .join("\n");

            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
          }}
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Download as CSV
        </button>
      </div>
    </div>
  );
}
