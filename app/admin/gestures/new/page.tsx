"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

type Gesture = {
  id?: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  video_url: string;
  audio_url?: string;
};

export default function GestureFormPage({
  isEdit = false,
}: {
  isEdit?: boolean;
}) {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState<Gesture>({
    name: "",
    description: "",
    category: "General",
    difficulty: "Easy",
    video_url: "",
    audio_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && params.id) {
      fetchGesture(params.id as string);
    }
  }, [isEdit, params.id]);

  const fetchGesture = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/gestures/${id}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching gesture");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `/api/admin/gestures/${params.id}`
        : "/api/admin/gestures";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      router.push("/admin/gestures");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving gesture");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        {isEdit ? "Edit Gesture" : "Add New Gesture"}
      </h2>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Gesture Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Halo, Terima Kasih"
            required
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe the gesture..."
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Category & Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option>General</option>
              <option>Greetings</option>
              <option>Numbers</option>
              <option>Actions</option>
              <option>Emotions</option>
              <option>Objects</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Video URL *
          </label>
          <input
            type="url"
            value={formData.video_url}
            onChange={(e) =>
              setFormData({ ...formData, video_url: e.target.value })
            }
            placeholder="https://..."
            required
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <p className="mt-1 text-xs text-slate-500">
            Upload to Supabase Storage and paste the URL
          </p>
        </div>

        {/* Audio URL (optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Audio URL (Optional)
          </label>
          <input
            type="url"
            value={formData.audio_url || ""}
            onChange={(e) =>
              setFormData({ ...formData, audio_url: e.target.value })
            }
            placeholder="https://..."
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Saving..."
              : isEdit
              ? "Update Gesture"
              : "Add Gesture"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-300 px-6 py-2.5 font-semibold text-slate-900 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
