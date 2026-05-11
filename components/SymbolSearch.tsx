"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { resolveTicker } from "@/lib/tickers";

const SUGGESTIONS = [
  { keyword: "테슬라", market: "US" },
  { keyword: "엔비디아", market: "US" },
  { keyword: "애플", market: "US" },
  { keyword: "삼성전자", market: "KR" },
  { keyword: "카카오", market: "KR" },
  { keyword: "SK하이닉스", market: "KR" },
];

const TYPING_EXAMPLES = ["테슬라", "엔비디아", "삼성전자", "카카오", "애플"];
const TYPE_MS = 110;
const DELETE_MS = 55;
const HOLD_MS = 1400;
const NEXT_MS = 280;

export function SymbolSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [typed, setTyped] = useState("");
  const [exIdx, setExIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "hold" | "deleting" | "next">("typing");
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(query: string) {
    const q = query.trim();
    if (!q) return;
    const resolved = resolveTicker(q);
    if (!resolved) {
      setNotFound(true);
      return;
    }
    setNotFound(false);
    router.push(`/quote/${encodeURIComponent(resolved.symbol)}`);
  }

  const showAnimation = !isFocused && value === "";

  useEffect(() => {
    if (!showAnimation) return;

    const target = TYPING_EXAMPLES[exIdx];
    let t: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (typed.length < target.length) {
        t = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), TYPE_MS);
      } else {
        t = setTimeout(() => setPhase("hold"), HOLD_MS);
      }
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("deleting"), 0);
    } else if (phase === "deleting") {
      if (typed.length > 0) {
        t = setTimeout(() => setTyped(typed.slice(0, -1)), DELETE_MS);
      } else {
        t = setTimeout(() => setPhase("next"), 0);
      }
    } else if (phase === "next") {
      t = setTimeout(() => {
        setExIdx((i) => (i + 1) % TYPING_EXAMPLES.length);
        setPhase("typing");
      }, NEXT_MS);
    }

    return () => clearTimeout(t);
  }, [typed, phase, exIdx, showAnimation]);

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 size-5 text-zinc-500" />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (notFound) setNotFound(false);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="종목 이름 검색"
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-5 pl-14 pr-36 text-base text-white placeholder:text-zinc-500 shadow-[0_0_60px_-12px_rgba(49,130,246,0.25)] outline-none transition focus:border-blue-500/60 focus:bg-white/[0.06]"
        />

        {/* 타이핑 애니메이션 오버레이 */}
        {showAnimation && (
          <div
            aria-hidden
            onClick={() => inputRef.current?.focus()}
            className="absolute inset-y-0 left-14 right-36 flex items-center text-base text-zinc-500 select-none"
          >
            <span>{typed}</span>
            <span className="caret-blink ml-px inline-block h-5 w-[2px] bg-zinc-500" />
          </div>
        )}

        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#3182F6] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_-8px_rgba(49,130,246,0.6)] transition hover:bg-[#1B64DA]"
        >
          차트 보기
        </button>
      </form>

      {notFound && (
        <p className="mt-3 text-center text-sm text-rose-400">
          "{value}" 종목을 찾지 못했어요. 아래 추천에서 골라보세요.
        </p>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.keyword}
            onClick={() => submit(s.keyword)}
            className="group rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-zinc-300 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
          >
            <span className="mr-1.5">{s.market === "US" ? "🇺🇸" : "🇰🇷"}</span>
            {s.keyword}
          </button>
        ))}
      </div>
    </div>
  );
}
