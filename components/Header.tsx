import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight text-white">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-500 text-[10px] font-bold text-white">
            뚜
          </span>
          <span>뚜차</span>
        </Link>
        <nav className="flex items-center gap-7 text-sm text-zinc-400">
          <Link href="/halloffame" className="transition hover:text-white">
            명예의 전당
          </Link>
          <Link href="/quote/NVDA" className="transition hover:text-white">
            차트
          </Link>
        </nav>
      </div>
    </header>
  );
}
