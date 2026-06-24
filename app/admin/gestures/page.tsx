"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Gesture = {
  id: string;
  name: string;
  category?: string;
  difficulty?: string;
  created_at: string;
};

export default function GesturesPage() {
  const [gestures, setGestures] = useState<Gesture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGestures();
  }, [searchQuery]);

  const fetchGestures = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/gestures?${params}`);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setGestures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching gestures");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus gesture ini?")) return;

    try {
      const response = await fetch(`/api/admin/gestures/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setGestures(gestures.filter((g) => g.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting gesture");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Gestures</h1>
          <p className="mt-1 text-slate-600">
            {gestures.length} gesture{gestures.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/gestures/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 transition-all"
        >
          ➕ Add New Gesture
        </Link>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search gestures..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Created
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : gestures.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No gestures found
                </td>
              </tr>
            ) : (
              gestures.map((gesture) => (
                <tr key={gesture.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {gesture.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {gesture.category || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      gesture.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : gesture.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {gesture.difficulty || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(gesture.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/gestures/${gesture.id}/edit`}
                        className="rounded px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(gesture.id)}
                        className="rounded px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
