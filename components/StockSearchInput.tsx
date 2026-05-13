"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { StockHit } from "@/app/api/search/stocks/route";

type Props = {
  label: string;
  placeholder?: string;
  value: StockHit | null;
  onChange: (hit: StockHit | null) => void;
  excludeSymbol?: string;
};

export function StockSearchInput({ label, placeholder, value, onChange, excludeSymbol }: Props) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<StockHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim() || value) {
      setHits([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/stocks?q=${encodeURIComponent(query)}`, {
          signal: ctrl.signal,
        });
        const data = (await res.json()) as { hits: StockHit[] };
        setHits(data.hits.filter((h) => h.symbol !== excludeSymbol));
      } catch {
        // aborted or failed; ignore
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query, value, excludeSymbol]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (value) {
    return (
      <div>
        <div className="mb-1.5 text-xs font-medium text-zinc-400">{label}</div>
        <div className="flex items-center gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/5 px-4 py-3.5">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-semibold text-white">
            {label.replace("종목 ", "")}
          </span>
          <div className="flex-1">
            <div className="text-sm font-semibold">{value.name}</div>
            <div className="text-xs text-zinc-500">
              <span className="mr-1.5 rounded-sm bg-white/[0.06] px-1 py-0.5 text-[10px] font-medium">
                {value.market === "KS" ? "KOSPI" : "KOSDAQ"}
              </span>
              {value.symbol}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setQuery("");
            }}
            className="rounded-full p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
            aria-label="선택 해제"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <label className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder ?? "종목명 검색 (예: 삼성전자, 에코프로)"}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-blue-500/60"
        />

        {open && (query || loading) && (
          <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-1 shadow-xl">
            {loading && hits.length === 0 && (
              <div className="px-4 py-3 text-xs text-zinc-500">검색 중...</div>
            )}
            {!loading && hits.length === 0 && query && (
              <div className="px-4 py-3 text-xs text-zinc-500">결과 없음</div>
            )}
            {hits.map((h) => (
              <button
                key={h.symbol}
                type="button"
                onClick={() => {
                  onChange(h);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/5"
              >
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-white">{h.name}</span>
                  <span className="text-xs text-zinc-500">{h.symbol}</span>
                </span>
                <span className="rounded-sm bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                  {h.market === "KS" ? "KOSPI" : "KOSDAQ"}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
