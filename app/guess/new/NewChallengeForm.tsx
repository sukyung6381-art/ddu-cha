"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StockSearchInput } from "@/components/StockSearchInput";
import type { StockHit } from "@/app/api/search/stocks/route";
import { createChallenge } from "../actions";

type Props = { disabled: boolean };

export function NewChallengeForm({ disabled }: Props) {
  const [a, setA] = useState<StockHit | null>(null);
  const [b, setB] = useState<StockHit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    if (!a || !b) return;
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("ticker_a", a.symbol);
      fd.set("ticker_b", b.symbol);
      fd.set("name_a", a.name);
      fd.set("name_b", b.name);
      const res = await createChallenge(fd);
      if (res?.ok === false) {
        setError(res.error);
      }
      // 성공 시 server action이 redirect 처리
    });
  }

  const ready = a && b && !disabled && !isPending;

  return (
    <div className="space-y-5">
      <StockSearchInput
        label="종목 A"
        value={a}
        onChange={setA}
        excludeSymbol={b?.symbol}
      />
      <div className="flex items-center justify-center text-xs font-medium text-zinc-500">
        VS
      </div>
      <StockSearchInput
        label="종목 B"
        value={b}
        onChange={setB}
        excludeSymbol={a?.symbol}
      />

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={!ready}
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#3182F6] text-sm font-semibold text-white shadow-[0_0_30px_-8px_rgba(49,130,246,0.5)] transition hover:bg-[#1B64DA] disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-zinc-500 disabled:shadow-none"
      >
        {isPending ? "등록 중..." : disabled ? "오늘은 등록 마감" : "챌린지 등록하기"}
      </button>
    </div>
  );
}
