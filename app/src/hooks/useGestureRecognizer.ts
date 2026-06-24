"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type GestureResult = {
  categoryName: string;
  confidence: number;
};

export type UseGestureRecognizerReturn = {
  webcamRef: React.RefObject<HTMLVideoElement | null>;
  isWebcamRunning: boolean;
  toggleWebcam: () => Promise<void>;
  recognizedGesture: GestureResult | null;
  isLoading: boolean;
  error: string | null;
};

const MODEL_URL =
  "https://res.cloudinary.com/dvwldqymc/raw/upload/v1727604336/gesture_recognizer_a4kozh.task";
const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm";

export function useGestureRecognizer(): UseGestureRecognizerReturn {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const gestureRecognizerRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);

  const [isWebcamRunning, setIsWebcamRunning] = useState(false);
  const [recognizedGesture, setRecognizedGesture] =
    useState<GestureResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initializeRecognizer = async () => {
      try {
        const vision = await import(
          "@mediapipe/tasks-vision"
        );
        const { GestureRecognizer, FilesetResolver } = vision;

        if (cancelled) return;

        const filesetResolver = await FilesetResolver.forVisionTasks(WASM_URL);

        if (cancelled) return;

        gestureRecognizerRef.current =
          await GestureRecognizer.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath: MODEL_URL,
              delegate: "GPU",
            },
            runningMode: "VIDEO",
          });

        if (!cancelled) setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "Failed to initialize gesture recognizer";
        setError(message);
        setIsLoading(false);
      }
    };

    initializeRecognizer();

    return () => {
      cancelled = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const predictGesture = useCallback(() => {
    if (!gestureRecognizerRef.current || !webcamRef.current) return;

    const video = webcamRef.current;

    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;

      try {
        const results = gestureRecognizerRef.current.recognizeForVideo(
          video,
          Date.now()
        );

        const firstGesture = results.gestures?.[0]?.[0];
        setRecognizedGesture(
          firstGesture
            ? { categoryName: firstGesture.categoryName, confidence: firstGesture.score }
            : null
        );
      } catch (err) {
        console.error("Gesture prediction error:", err);
      }
    }

    animationFrameRef.current = requestAnimationFrame(predictGesture);
  }, []);

  const enableWebcam = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Browser tidak mendukung akses kamera");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      const video = webcamRef.current;
      if (!video) return;

      video.srcObject = stream;
      setIsWebcamRunning(true);
      video.addEventListener("play", predictGesture, { once: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengakses kamera";
      setError(message);
    }
  }, [predictGesture]);

  const disableWebcam = useCallback(() => {
    const video = webcamRef.current;
    if (video?.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsWebcamRunning(false);
    setRecognizedGesture(null);
  }, []);

  const toggleWebcam = useCallback(async () => {
    if (isWebcamRunning) {
      disableWebcam();
    } else {
      await enableWebcam();
    }
  }, [isWebcamRunning, enableWebcam, disableWebcam]);

  return {
    webcamRef,
    isWebcamRunning,
    toggleWebcam,
    recognizedGesture,
    isLoading,
    error,
  };
}