import { useCallback, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export type GestureData = {
  id: string;
  name: string;
  video_url: string;
  audio_url?: string;
  confidence?: number;
} | null;

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export function useGestureSearch() {
  const [gestureData, setGestureData] = useState<GestureData>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchGesture = useCallback(async (word: string) => {
    if (!word.trim()) {
      setGestureData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Search gesture by name (case-insensitive)
      const { data, error: queryError } = await supabase
        .from("gestures")
        .select("id, name, video_url, audio_url")
        .ilike("name", `%${word.trim()}%`)
        .single();

      if (queryError) {
        if (queryError.code === "PGRST116") {
          // No rows returned
          setError(`Gestur untuk "${word}" tidak ditemukan`);
          setGestureData(null);
        } else {
          throw queryError;
        }
        return;
      }

      if (data) {
        setGestureData({
          id: data.id,
          name: data.name,
          video_url: data.video_url,
          audio_url: data.audio_url,
        });
      }
    } catch (err) {
      console.error("Error searching gesture:", err);
      setError(err instanceof Error ? err.message : "Error searching gesture");
      setGestureData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    gestureData,
    isLoading,
    error,
    searchGesture,
  };
}
