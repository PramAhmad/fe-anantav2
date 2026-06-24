"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalGestures: number;
  recentSearches: number;
  totalSearches: number;
  topGestures: { name: string; count: number }[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="text-center text-slate-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="🤚"
          title="Total Gestures"
          value={stats?.totalGestures || 0}
        />
        <StatCard
          icon="🔍"
          title="Today's Searches"
          value={stats?.recentSearches || 0}
        />
        <StatCard
          icon="📊"
          title="Total Searches"
          value={stats?.totalSearches || 0}
        />
        <StatCard
          icon="⭐"
          title="Top Gesture"
          value={stats?.topGestures?.[0]?.name || "-"}
        />
      </div>

      {/* Top Gestures */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Top 10 Most Searched
        </h3>
        <div className="space-y-3">
          {stats?.topGestures?.slice(0, 10).map((gesture, idx) => (
            <div
              key={gesture.name}
              className="flex items-center justify-between border-b border-slate-200 pb-3"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  {idx + 1}
                </span>
                <span className="font-medium text-slate-900">
                  {gesture.name}
                </span>
              </div>
              <span className="text-slate-600 font-semibold">
                {gesture.count} searches
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <QuickActionButton href="/admin/gestures/new" icon="➕" label="Add Gesture" />
          <QuickActionButton href="/admin/gestures" icon="📋" label="Manage Gestures" />
          <QuickActionButton href="/admin/upload" icon="📤" label="Bulk Upload" />
          <QuickActionButton href="/admin/analytics" icon="📈" label="Analytics" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

function QuickActionButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 p-4 text-center transition-all hover:border-blue-500 hover:bg-blue-50"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium text-slate-900">{label}</span>
    </a>
  );
}
