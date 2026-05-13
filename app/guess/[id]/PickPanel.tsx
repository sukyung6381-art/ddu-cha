"use client";

import { useState, useTransition } from "react";
import { submitPick } from "../actions";

type Props = {
  challengeId: string;
  labelA: string;
  labelB: string;
};

export function PickPanel({ challengeId, labelA, labelB }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<"A" | "B" | null>(null);

  function pick(side: "A" | "B") {
    setSelected(side);
    setError(null);
    startTransition(async () => {
      const res = await submitPick(challengeId, side);
      if (!res.ok) {
        setError(res.error);
        setSelected(null);
      }
    });
  }

  return (
    <div>
      <div className="text-center text-sm text-zinc-400">어느 쪽이 오늘 더 많이 오를까요?</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => pick("A")}
          disabled={isPending}
          className={`group flex items-center justify-center gap-2 rounded-2xl border px-6 py-5 text-sm font-semibold transition disabled:opacity-50 ${
            selected === "A"
              ? "border-blue-400 bg-blue-500 text-white"
              : "border-white/15 bg-white/[0.04] text-zinc-300 hover:border-blue-500 hover:bg-blue-500/10 hover:text-white"
          }`}
        >
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-blue-500 text-xs text-white group-disabled:bg-zinc-700">
            A
          </span>
          {labelA}
        </button>
        <button
          type="button"
          onClick={() => pick("B")}
          disabled={isPending}
          className={`group flex items-center justify-center gap-2 rounded-2xl border px-6 py-5 text-sm font-semibold transition disabled:opacity-50 ${
            selected === "B"
              ? "border-purple-400 bg-purple-500 text-white"
              : "border-white/15 bg-white/[0.04] text-zinc-300 hover:border-purple-500 hover:bg-purple-500/10 hover:text-white"
          }`}
        >
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-purple-500 text-xs text-white group-disabled:bg-zinc-700">
            B
          </span>
          {labelB}
        </button>
      </div>
      {error && (
        <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}
      <p className="mt-3 text-center text-xs text-zinc-500">
        ⚠️ 한 번 픽하면 변경 불가
      </p>
    </div>
  );
}
