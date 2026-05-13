"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Props = {
  href: string;
  loggedIn: boolean;
  className?: string;
  children: React.ReactNode;
};

export function LoginRequiredLink({ href, loggedIn, className, children }: Props) {
  const [open, setOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function signIn() {
    setSigningIn(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (loggedIn) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${className ?? ""} text-left`}
      >
        {children}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-gate-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.8)]">
            <h2
              id="login-gate-title"
              className="text-base font-semibold text-white"
            >
              구글 로그인을 하면 참여하실 수 있어요.
            </h2>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-11 flex-1 rounded-full border border-white/10 bg-white/[0.04] text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08]"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={signIn}
                disabled={signingIn}
                className="h-11 flex-1 rounded-full bg-[#3182F6] text-sm font-semibold text-white shadow-[0_0_24px_-8px_rgba(49,130,246,0.6)] transition hover:bg-[#1B64DA] disabled:opacity-60"
              >
                {signingIn ? "이동 중…" : "로그인하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
