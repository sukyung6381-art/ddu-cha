import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";
import { MobileNav } from "@/components/MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-white"
        >
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-500 text-[10px] font-bold text-white">
            뚜
          </span>
          <span>뚜껑 차트</span>
        </Link>

        {/* Desktop nav + auth */}
        <div className="hidden items-center gap-7 sm:flex">
          <nav className="flex items-center gap-7 text-sm text-zinc-400">
            <Link href="/guess" className="transition hover:text-white">
              종가 챌린지
            </Link>
            <Link href="/halloffame" className="transition hover:text-white">
              우리 10년을 보자
            </Link>
            <Link href="/search" className="transition hover:text-white">
              종목 찾기
            </Link>
          </nav>
          <AuthButton />
        </div>

        {/* Mobile hamburger */}
        <MobileNav />
      </div>
    </header>
  );
}
