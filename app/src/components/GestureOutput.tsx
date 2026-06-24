"use client";

import { FC } from "react";

interface GestureOutputProps {
  gesture: string | null;
  isVisible: boolean;
}

export const GestureOutput: FC<GestureOutputProps> = ({ gesture, isVisible }) => {
  if (!isVisible || !gesture) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-lg bg-slate-900/90 px-4 py-2 text-center text-lg font-semibold text-white shadow-lg">
      <span>Isyarat: {gesture}</span>
    </div>
  );
};
