"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import MobileBottomNav from "@/app/src/components/MobileBottomNav";
import { GestureOutput } from "@/app/src/components/GestureOutput";
import { useGestureRecognizer } from "@/app/src/hooks/useGestureRecognizer";

const MIN_GESTURE_INTERVAL_MS = 1000;

export default function GesturePage() {
  const {
    webcamRef,
    isWebcamRunning,
    toggleWebcam,
    recognizedGesture,
    isLoading,
    error,
  } = useGestureRecognizer();

  const [gestureHistory, setGestureHistory] = useState<string[]>([]);
  const lastGestureTimeRef = useRef<number>(0);
  const lastGestureNameRef = useRef<string>("");

  useEffect(() => {
    if (!recognizedGesture) return;

    const now = Date.now();
    const { categoryName } = recognizedGesture;
    const isSameGesture = categoryName === lastGestureNameRef.current;
    const isTooSoon = now - lastGestureTimeRef.current < MIN_GESTURE_INTERVAL_MS;

    if (isSameGesture || isTooSoon) return;

    lastGestureNameRef.current = categoryName;
    lastGestureTimeRef.current = now;
    setGestureHistory((prev) => [...prev, categoryName]);
  }, [recognizedGesture]);

  const handleClearHistory = useCallback(() => {
    setGestureHistory([]);
    lastGestureTimeRef.current = 0;
    lastGestureNameRef.current = "";
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/green.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-[#082218]/80" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-28 md:pb-8">
        {isWebcamRunning ? (
          <ActiveView
            webcamRef={webcamRef}
            recognizedGesture={recognizedGesture}
            gestureHistory={gestureHistory}
            onToggle={toggleWebcam}
            onClear={handleClearHistory}
            error={error}
          />
        ) : (
          <LandingView
            onStart={toggleWebcam}
            isLoading={isLoading}
            error={error}
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
  isLoading: boolean;
  error: string | null;
};

function LandingView({ onStart, isLoading, error }: LandingViewProps) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600">
        <HandIcon className="h-8 w-8 text-white" />
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Penerjemah Isyarat</h1>
        <p className="mt-2 text-sm leading-relaxed text-emerald-300/80">
          Tunjukkan gerakan tangan Anda ke kamera,
          <br />
          kami akan menerjemahkannya secara langsung.
        </p>
      </div>

      {/* Feature Pills */}
      <div className="flex w-full flex-col gap-2.5">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left"
          >
            <Icon className="h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-white">{title}</p>
              <p className="text-xs text-emerald-300/60">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="w-full rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-left text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onStart}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-600 py-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="h-4 w-4 animate-spin" />
            Memuat model...
          </>
        ) : (
          <>
            <CameraIcon className="h-5 w-5" />
            Mulai Penerjemahan
          </>
        )}
      </button>

      <p className="text-xs text-emerald-900/60 text-white/30">
        Izin kamera diperlukan untuk memulai
      </p>
    </div>
  );
}

// ─── Active State ─────────────────────────────────────────────────────────────

type GestureResult = { categoryName: string; confidence: number } | null;

type ActiveViewProps = {
  webcamRef: React.RefObject<HTMLVideoElement | null>;
  recognizedGesture: GestureResult;
  gestureHistory: string[];
  onToggle: () => void;
  onClear: () => void;
  error: string | null;
};

function ActiveView({
  webcamRef,
  recognizedGesture,
  gestureHistory,
  onToggle,
  onClear,
  error,
}: ActiveViewProps) {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-white">Penerjemah Isyarat</h1>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-600/30 px-3 py-1 text-xs font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Aktif
        </span>
      </div>

      {/* Video */}
      <div className="relative overflow-hidden rounded-2xl bg-black">
        <video
          ref={webcamRef}
          autoPlay
          playsInline
          className="h-auto w-full"
          style={{ aspectRatio: "16/9" }}
        />
        <GestureOutput
          gesture={recognizedGesture?.categoryName ?? null}
          isVisible={recognizedGesture !== null}
        />
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-500 active:scale-95"
        >
          <StopIcon className="h-4 w-4" />
          Hentikan
        </button>
        <button
          onClick={onClear}
          disabled={gestureHistory.length === 0}
          className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <TrashIcon className="h-4 w-4" />
          Hapus
        </button>
      </div>

      {/* History */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-emerald-300">Riwayat gestur</p>
          {gestureHistory.length > 0 && (
            <span className="rounded-full bg-emerald-600/20 px-2.5 py-0.5 text-xs text-emerald-400">
              {gestureHistory.length} gestur
            </span>
          )}
        </div>

        {gestureHistory.length === 0 ? (
          <p className="py-4 text-center text-sm text-white/30">
            Belum ada gestur terdeteksi
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {gestureHistory.map((name, i) => (
              <span
                key={i}
                className="rounded-lg bg-emerald-900/60 px-3 py-1.5 text-sm text-emerald-200"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Features Data ────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: CameraIcon,
    title: "Kamera real-time",
    desc: "Deteksi otomatis tiap frame video",
  },
  {
    icon: HandIcon,
    title: "Gestur isyarat",
    desc: "Mendukung berbagai gestur dasar BISINDO",
  },
  {
    icon: HistoryIcon,
    title: "Riwayat gestur",
    desc: "Tersimpan selama sesi berlangsung",
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path fillRule="evenodd" d="M8.5 3A1.5 1.5 0 0 0 7 4.5H5A3 3 0 0 0 2 7.5v9A3 3 0 0 0 5 19.5h14a3 3 0 0 0 3-3v-9A3 3 0 0 0 19 4.5h-2A1.5 1.5 0 0 0 15.5 3h-7zM12 8a5.5 5.5 0 1 0 0 11A5.5 5.5 0 0 0 12 8z" clipRule="evenodd" />
    </svg>
  );
}

function HandIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10 2a1 1 0 0 1 1 1v7h2V4a1 1 0 1 1 2 0v6h2V6a1 1 0 1 1 2 0v8a7 7 0 0 1-7 7H9A7 7 0 0 1 2 14v-4a1 1 0 1 1 2 0v3h2V3a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-1 5a1 1 0 1 1 2 0v5.586l3.707 3.707a1 1 0 0 1-1.414 1.414l-4-4A1 1 0 0 1 11 13V7z" clipRule="evenodd" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M9 3a1 1 0 0 0-1 1H5a1 1 0 0 0 0 2h14a1 1 0 1 0 0-2h-3a1 1 0 0 0-1-1H9zM6 7l1.5 12.5A1.5 1.5 0 0 0 9 21h6a1.5 1.5 0 0 0 1.5-1.5L18 7H6z" clipRule="evenodd" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
}