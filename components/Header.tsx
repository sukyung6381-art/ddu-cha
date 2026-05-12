import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight text-white">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-500 text-[10px] font-bold text-white">
            뚜
          </span>
          <span>뚜껑 차트</span>
        </Link>
        <div className="flex items-center gap-7">
          <nav className="hidden items-center gap-7 text-sm text-zinc-400 sm:flex">
            <Link href="/" className="transition hover:text-white">
              홈
            </Link>
            <Link href="/guess" className="transition hover:text-white">
              주식 종가 맞추기
            </Link>
            <Link href="/halloffame" className="transition hover:text-white">
              명예의 전당
            </Link>
          </nav>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
