"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import MobileBottomNav from "@/app/src/components/MobileBottomNav";
import { useSpeechRecognition } from "@/app/src/hooks/useSpeechRecognition";
import { useGestureSearch } from "@/app/src/hooks/useGestureSearch";

const DEBOUNCE_MS = 500;

export default function VoicePage() {
  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    isSpeechSupported,
  } = useSpeechRecognition();

  const {
    gestureData,
    isLoading: isSearching,
    error: searchError,
    searchGesture,
  } = useGestureSearch();

  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const [searchHistory, setSearchHistory] = useState<
    { word: string; timestamp: number }[]
  >([]);

  // Debounce gesture search when transcript changes
  useEffect(() => {
    if (!transcript.trim()) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchGesture(transcript.trim());
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [transcript, searchGesture]);

  const handleAddToHistory = useCallback(() => {
    if (!transcript.trim() || !gestureData) return;

    setSearchHistory((prev) => [
      ...prev,
      { word: transcript.trim(), timestamp: Date.now() },
    ]);
  }, [transcript, gestureData]);

  const handleClearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const handleToggleListen = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  if (!isSpeechSupported) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/blue.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-[#082218]/80" />

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-28 md:pb-8">
          <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-6 py-4">
              <p className="text-sm text-red-300">
                Browser Anda tidak mendukung Speech Recognition.{" "}
                <a
                  href="https://caniuse.com/mdn-api_speechrecognition"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-red-200"
                >
                  Lihat kompatibilitas
                </a>
              </p>
            </div>
          </div>
        </div>

        <MobileBottomNav />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/blue.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-[#082218]/80" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-28 md:pb-8">
        {!isListening && !transcript ? (
          <LandingView onStart={handleToggleListen} />
        ) : (
          <ActiveView
            isListening={isListening}
            transcript={transcript}
            gestureData={gestureData}
            isSearching={isSearching}
            speechError={speechError}
            searchError={searchError}
            searchHistory={searchHistory}
            onToggleListen={handleToggleListen}
            onAddToHistory={handleAddToHistory}
            onClearHistory={handleClearHistory}
          />
        )}
      </div>

      <MobileBottomNav />
    </main>
  );
}

// ─── Landing State ────────────────────────────────────────────────────────────

type LandingViewProps = {
  onStart: () => void;
};

function LandingView({ onStart }: LandingViewProps) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
        <MicrophoneIcon className="h-8 w-8 text-white" />
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Suara ke Isyarat</h1>
        <p className="mt-2 text-sm leading-relaxed text-blue-300/80">
          Ucapkan kata, kami cari gerakan isyarat
          <br />
          yang sesuai untuk ditampilkan.
        </p>
      </div>

      {/* Feature Pills */}
      <div className="flex w-full flex-col gap-2.5">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left"
          >
            <Icon className="h-5 w-5 shrink-0 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">{title}</p>
              <p className="text-xs text-blue-300/60">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 py-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-500 active:scale-95"
      >
        <MicrophoneIcon className="h-5 w-5" />
        Mulai Rekam Suara
      </button>

      <p className="text-xs text-white/30">
        Izin mikrofon diperlukan untuk memulai
      </p>
    </div>
  );
}

// ─── Active State ─────────────────────────────────────────────────────────────

type GestureData = {
  id: string;
  name: string;
  video_url: string;
  audio_url?: string;
} | null;

type ActiveViewProps = {
  isListening: boolean;
  transcript: string;
  gestureData: GestureData;
  isSearching: boolean;
  speechError: string | null;
  searchError: string | null;
  searchHistory: { word: string; timestamp: number }[];
  onToggleListen: () => void;
  onAddToHistory: () => void;
  onClearHistory: () => void;
};

function ActiveView({
  isListening,
  transcript,
  gestureData,
  isSearching,
  speechError,
  searchError,
  searchHistory,
  onToggleListen,
  onAddToHistory,
  onClearHistory,
}: ActiveViewProps) {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-white">Suara ke Isyarat</h1>
        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            isListening
              ? "bg-blue-600/30 text-blue-300"
              : "bg-white/10 text-white/60"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isListening ? "animate-pulse bg-blue-400" : "bg-white/40"
            }`}
          />
          {isListening ? "Merekam..." : "Siap"}
        </span>
      </div>

      {/* Transcript Display */}
      <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">
        <p className="text-xs font-medium text-blue-300/70 mb-2">Teks Terdeteksi</p>
        <p className="text-lg font-semibold text-white min-h-8">
          {transcript || "Mulai berbicara..."}
        </p>
      </div>

      {/* Gesture Video Display */}
      {isSearching ? (
        <div className="aspect-video rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <SpinnerIcon className="h-8 w-8 animate-spin text-blue-400" />
            <p className="text-sm text-white/60">Mencari gestur...</p>
          </div>
        </div>
      ) : gestureData ? (
        <div className="rounded-2xl overflow-hidden bg-black border border-white/10">
          <video
            src={gestureData.video_url}
            autoPlay
            loop
            playsInline
            className="w-full h-auto"
            style={{ aspectRatio: "16/9" }}
            controls
          />
          <div className="bg-blue-600/20 px-4 py-3 border-t border-white/10">
            <p className="text-sm font-semibold text-blue-300 capitalize">
              {gestureData.name}
            </p>
          </div>
        </div>
      ) : (
        <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <p className="text-sm text-white/40">Belum ada hasil pencarian</p>
        </div>
      )}

      {/* Errors */}
      {(speechError || searchError) && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {speechError || searchError}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={onToggleListen}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 active:scale-95 ${
            isListening
              ? "bg-red-600 hover:bg-red-500 text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {isListening ? (
            <>
              <StopIcon className="h-4 w-4" />
              Hentikan Rekam
            </>
          ) : (
            <>
              <MicrophoneIcon className="h-4 w-4" />
              Mulai Rekam
            </>
          )}
        </button>

        <button
          onClick={onAddToHistory}
          disabled={!gestureData || !transcript}
          className="flex items-center gap-2 rounded-xl bg-blue-600/30 px-5 py-3 text-sm font-medium text-blue-300 transition-all duration-200 hover:bg-blue-600/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PlusIcon className="h-4 w-4" />
          Simpan
        </button>
      </div>

      {/* History */}
      {searchHistory.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-blue-300">Riwayat Pencarian</p>
            <button
              onClick={onClearHistory}
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Hapus Semua
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, i) => (
              <span
                key={i}
                className="rounded-lg bg-blue-900/60 px-3 py-1.5 text-sm text-blue-200 capitalize"
              >
                {item.word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Features Data ────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: MicrophoneIcon,
    title: "Rekam Suara",
    desc: "Ucapkan kata dengan jelas dan natural",
  },
  {
    icon: SearchIcon,
    title: "Cari Otomatis",
    desc: "Database gesture terupdate real-time",
  },
  {
    icon: HistoryIcon,
    title: "Riwayat Pencarian",
    desc: "Lihat kata-kata yang pernah dicari",
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function MicrophoneIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 1C6.48 1 2 4.58 2 9v4.5C2 18.05 4.65 21 8 21c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2 3.35 0 6-2.95 6-7.5V9c0-4.42-4.48-8-10-8zm0 2c3.3 0 6 2.24 6 5v4.5c0 2.76-2.7 5-6 5s-6-2.24-6-5V8c0-2.76 2.7-5 6-5zm0 2c-1.66 0-3 1.34-3 3v3c0 1.66 1.34 3 3 3s3-1.34 3-3v-3c0-1.66-1.34-3-3-3z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM0 10a10 10 0 1 1 20 0A10 10 0 0 1 0 10zm17.657-1.414a1 1 0 1 0-1.414-1.414l-2.5 2.5a1 1 0 0 0 1.414 1.414l2.5-2.5z" clipRule="evenodd" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path fillRule="evenodd" d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-1 5a1 1 0 1 1 2 0v5.586l3.707 3.707a1 1 0 0 1-1.414 1.414l-4-4A1 1 0 0 1 11 13V7z" clipRule="evenodd" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 5a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5V6a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}
