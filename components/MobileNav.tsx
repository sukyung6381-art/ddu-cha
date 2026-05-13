"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, UserRound } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/guess", label: "종가 챌린지" },
  { href: "/halloffame", label: "우리 10년을 보자" },
  { href: "/search", label: "종목 찾기" },
];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 페이지 이동 시 자동 닫기
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 메뉴 열림 동안 body 스크롤 잠금
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function signIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
  }

  const overlay = (
    <div
      className="fixed inset-0 top-14 z-40 bg-black sm:hidden"
      onClick={() => setOpen(false)}
    >
      <div
        className="flex h-full flex-col bg-black p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-3.5 text-xl font-semibold tracking-tight transition ${
                  active
                    ? "bg-white/[0.06] text-white"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 border-t border-white/[0.06] pt-6">
          {user ? (
            <>
              <Link
                href="/profile"
                className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base transition ${
                  pathname === "/profile"
                    ? "bg-white/[0.06] text-white"
                    : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <UserRound className="size-5" />
                프로필
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-base font-medium text-zinc-300 transition hover:border-white/30 hover:text-white"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={signIn}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-base font-semibold text-black transition hover:bg-zinc-200"
            >
              <GoogleIcon />
              Google 로그인
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        onClick={() => setOpen(!open)}
        className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:border-white/30 hover:text-white sm:hidden"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {open && mounted && createPortal(overlay, document.body)}
    </>
  );
}
