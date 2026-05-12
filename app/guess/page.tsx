import Link from "next/link";

export const metadata = {
  title: "주식 종가 맞추기 — 뚜껑 차트",
};

export default function GuessPage() {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 size-[420px] rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="flex flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-zinc-300 backdrop-blur">
          <span className="size-1.5 rounded-full bg-amber-400" />
          준비 중
        </span>

        <h1 className="max-w-2xl text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          오늘의 주식,
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            얼마에 마감했을까?
          </span>
        </h1>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-400">
          매일 한 종목, 어제 종가를 맞히는 게임이에요.
          <br className="hidden sm:inline" />
          곧 만나요.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          홈으로
        </Link>
      </div>
    </section>
  );
}
