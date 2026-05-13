import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { registrationWindow, formatRemaining } from "@/lib/guess/rules";
import { NewChallengeForm } from "./NewChallengeForm";

export const metadata = { title: "챌린지 등록 — 뚜껑 차트" };

export default async function NewChallengePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/guess");

  const window = registrationWindow();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <Link
        href="/guess"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-white"
      >
        <ArrowLeft className="size-4" />
        리스트로
      </Link>

      <div className="mt-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          챌린지 등록
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          국내 주식 2개를 골라주세요. <span className="text-white">더 많이 오를</span> 종목을 사람들이 맞춥니다.
        </p>

        {window.open ? (
          <div className="mt-4 space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              등록 가능 · {window.cutoffLabel} · {formatRemaining(window.remainingMinutes)}
            </div>
            <p className="text-xs text-zinc-500">
              📅 이 챌린지의 market_date: <span className="text-zinc-300">{window.marketDate}</span>
            </p>
          </div>
        ) : (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-300">
            <span className="size-1.5 rounded-full bg-rose-400" />
            {window.reason}
          </div>
        )}
      </div>

      <div className="mt-10">
        <NewChallengeForm disabled={!window.open} />
      </div>

      <p className="mt-8 text-xs text-zinc-500">
        ⓘ 등록 후 수정·삭제 불가. 픽 마감은 market_date 당일 11:00 KST. 정산은 16:00 이후 자동 진행됩니다.
      </p>
    </div>
  );
}
