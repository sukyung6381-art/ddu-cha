import Link from "next/link";
import { ArrowLeft, Trophy, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { canPickNow, formatRemaining, pickRemainingMinutes } from "@/lib/guess/rules";
import { PickPanel } from "./PickPanel";

type Props = { params: Promise<{ id: string }> };

export default async function ChallengeDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: c, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !c) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">챌린지를 찾을 수 없어요</h1>
        <Link href="/guess" className="mt-6 inline-block text-sm text-blue-400 hover:text-blue-300">
          ← 리스트로
        </Link>
      </div>
    );
  }

  const { data: picks = [] } = await supabase
    .from("picks")
    .select("user_id, user_name, pick, created_at")
    .eq("challenge_id", id)
    .order("created_at", { ascending: false });

  const aCount = (picks ?? []).filter((p) => p.pick === "A").length;
  const bCount = (picks ?? []).filter((p) => p.pick === "B").length;
  const total = aCount + bCount;
  const aPct = total > 0 ? Math.round((aCount / total) * 100) : 0;
  const bPct = total > 0 ? Math.round((bCount / total) * 100) : 0;

  const myPick = user ? (picks ?? []).find((p) => p.user_id === user.id) : null;
  const canPick = !!user && !myPick && c.status === "open" && canPickNow(c.market_date);

  const isClosed = c.status !== "open";
  const remaining = pickRemainingMinutes(c.market_date);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <Link
        href="/guess"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-white"
      >
        <ArrowLeft className="size-4" />
        리스트로
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span>{c.market_date}</span>
          <span>·</span>
          <span>@{c.creator_name ?? "익명"}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3" />
            {total}명 참여
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          오늘 더 많이 오를 종목은?
        </h1>

        {!isClosed && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            {remaining > 0
              ? `진행중 · 픽 마감 ${c.market_date} 11:00 KST까지 ${formatRemaining(remaining)}`
              : `픽 마감 — 정산 대기중 (${c.market_date} 16:00 KST 이후)`}
          </div>
        )}
        {isClosed && c.winner && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
            <Trophy className="size-3" />
            {c.winner === "A" ? c.name_a : c.winner === "B" ? c.name_b : "무승부"} 승
          </div>
        )}
      </header>

      {/* 두 종목 카드 */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <SideCard
          side="A"
          name={c.name_a}
          symbol={c.ticker_a}
          count={aCount}
          pct={aPct}
          isWinner={c.winner === "A"}
          isClosed={isClosed}
          returnPct={c.return_a}
        />
        <SideCard
          side="B"
          name={c.name_b}
          symbol={c.ticker_b}
          count={bCount}
          pct={bPct}
          isWinner={c.winner === "B"}
          isClosed={isClosed}
          returnPct={c.return_b}
        />
      </div>

      {/* 픽 패널 */}
      <div className="mt-8">
        {!user && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center text-sm text-zinc-400">
            픽을 제출하려면 <span className="text-white">Google 로그인</span>이 필요해요.
          </div>
        )}
        {user && myPick && (
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6 text-center text-sm text-blue-200">
            ✓ 이미 <span className="font-semibold text-white">{myPick.pick}: {myPick.pick === "A" ? c.name_a : c.name_b}</span> 로 픽했어요.
            {!isClosed && " 정산 결과를 기다려주세요."}
          </div>
        )}
        {canPick && (
          <PickPanel
            challengeId={c.id}
            labelA={c.name_a}
            labelB={c.name_b}
          />
        )}
        {user && !myPick && !canPick && !isClosed && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-sm text-rose-300">
            픽 마감 (11:00 KST 이후)
          </div>
        )}
      </div>

      {/* 최근 참여자 */}
      {(picks ?? []).length > 0 && (
        <div className="mt-12">
          <h2 className="mb-3 text-sm font-medium text-zinc-400">참여자 ({total}명)</h2>
          <div className="flex flex-wrap gap-2">
            {(picks ?? []).slice(0, 30).map((p) => (
              <span
                key={p.user_id}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-400"
              >
                <span
                  className={`inline-flex size-4 items-center justify-center rounded-full text-[9px] font-bold ${
                    p.pick === "A"
                      ? "bg-blue-500 text-white"
                      : "bg-purple-500 text-white"
                  }`}
                >
                  {p.pick}
                </span>
                {p.user_name ?? "익명"}
              </span>
            ))}
            {(picks ?? []).length > 30 && (
              <span className="px-2.5 py-1 text-xs text-zinc-500">
                +{(picks ?? []).length - 30}명
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SideCard({
  side,
  name,
  symbol,
  count,
  pct,
  isWinner,
  isClosed,
  returnPct,
}: {
  side: "A" | "B";
  name: string;
  symbol: string;
  count: number;
  pct: number;
  isWinner: boolean;
  isClosed: boolean;
  returnPct: number | null;
}) {
  const borderClass = isClosed && isWinner ? "border-amber-500/50 bg-amber-500/5" : "border-white/[0.08] bg-white/[0.02]";
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 ${borderClass}`}>
      <div className="flex items-start justify-between">
        <span
          className={`inline-flex size-9 items-center justify-center rounded-full text-sm font-bold ${
            isClosed && isWinner
              ? "bg-amber-500 text-amber-950"
              : side === "A"
                ? "bg-blue-500 text-white"
                : "bg-purple-500 text-white"
          }`}
        >
          {side}
        </span>
        {isClosed && isWinner && (
          <Trophy className="size-5 text-amber-400" />
        )}
      </div>
      <div className="mt-4 text-xl font-semibold">{name}</div>
      <div className="text-xs text-zinc-500">{symbol}</div>

      {isClosed && returnPct !== null && (
        <div className={`mt-3 text-2xl font-semibold tabular-nums ${returnPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
          {returnPct >= 0 ? "+" : ""}
          {returnPct.toFixed(2)}%
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-zinc-500">픽 비율</span>
          <span className="text-sm font-medium tabular-nums">{pct}% <span className="text-xs text-zinc-500">({count}명)</span></span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className={`h-full rounded-full transition-all ${side === "A" ? "bg-blue-500" : "bg-purple-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
