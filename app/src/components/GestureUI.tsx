"use client";

import { FC } from "react";

interface GestureChipProps {
  text: string;
}

export const GestureChip: FC<GestureChipProps> = ({ text }) => {
  return (
    <span className="inline-block rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-900">
      {text}
    </span>
  );
};

interface GestureHistoryProps {
  gestures: string[];
}

export const GestureHistory: FC<GestureHistoryProps> = ({ gestures }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-white">Riwayat Isyarat</h3>
      <div className="flex flex-wrap gap-2">
        {gestures.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada isyarat terdeteksi</p>
        ) : (
          gestures.map((gesture, index) => (
            <GestureChip key={`${gesture}-${index}`} text={gesture} />
          ))
        )}
      </div>
    </div>
  );
};
