import Link from "next/link";
import { Plus, Users, Clock, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { registrationWindow, formatRemaining } from "@/lib/guess/rules";

export const metadata = { title: "종가 챌린지 — 뚜껑 차트" };

type SortKey = "latest" | "popular" | "oldest";
type StatusFilter = "open" | "closed";

type Props = {
  searchParams: Promise<{ sort?: string; status?: string }>;
};

export default async function GuessPage({ searchParams }: Props) {
  const sp = await searchParams;
  const sort: SortKey = sp.sort === "popular" || sp.sort === "oldest" ? sp.sort : "latest";
  const status: StatusFilter = sp.status === "closed" ? "closed" : "open";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 챌린지 조회 (참여자 수 포함은 별도 쿼리)
  let query = supabase
    .from("challenges")
    .select("id, creator_name, ticker_a, ticker_b, name_a, name_b, market_date, status, winner, created_at, return_a, return_b")
    .eq("status", status);

  if (sort === "latest") query = query.order("created_at", { ascending: false });
  if (sort === "oldest") query = query.order("created_at", { ascending: true });
  // popular는 클라이언트에서 추가 처리 필요 → 일단 latest로 받고 뒤에 정렬

  const { data: challenges = [], error } = await query.limit(50);

  // 참여자 수 가져오기
  const ids = (challenges ?? []).map((c) => c.id);
  let pickCounts = new Map<string, number>();
  if (ids.length > 0) {
    const { data: picks } = await supabase
      .from("picks")
      .select("challenge_id")
      .in("challenge_id", ids);
    for (const p of picks ?? []) {
      pickCounts.set(p.challenge_id, (pickCounts.get(p.challenge_id) ?? 0) + 1);
    }
  }

  const sortedChallenges = (challenges ?? []).slice();
  if (sort === "popular") {
    sortedChallenges.sort(
      (x, y) => (pickCounts.get(y.id) ?? 0) - (pickCounts.get(x.id) ?? 0)
    );
  }

  const regWindow = registrationWindow();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-12 pb-24 sm:pb-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            종가 챌린지
          </h1>
          <p className="mt-3 text-zinc-400">
            오늘 장 마감 전,
            <br className="sm:hidden" />
            <span className="sm:ml-1">어느 주식의 수익률이 더 높을까?</span>
          </p>
        </div>

        {/* 데스크탑 전용 인라인 버튼/안내 (모바일은 하단 FAB) */}
        {user ? (
          regWindow.open ? (
            <Link
              href="/guess/new"
              className="hidden h-11 items-center gap-2 rounded-full bg-[#3182F6] px-5 text-sm font-semibold text-white shadow-[0_0_24px_-8px_rgba(49,130,246,0.6)] transition hover:bg-[#1B64DA] sm:inline-flex"
            >
              <Plus className="size-4" />
              챌린지 등록
            </Link>
          ) : (
            <span className="hidden h-11 items-center rounded-full border border-white/10 bg-white/[0.04] px-5 text-xs text-zinc-500 sm:inline-flex">
              {regWindow.nextOpenLabel}
            </span>
          )
        ) : (
          <span className="hidden h-11 items-center rounded-full border border-white/10 bg-white/[0.04] px-5 text-xs text-zinc-500 sm:inline-flex">
            로그인 후 등록 가능
          </span>
        )}
      </header>

      {user && regWindow.open && (
        <p className="mt-2 text-xs text-zinc-500">
          ⏰ {regWindow.cutoffLabel} · {formatRemaining(regWindow.remainingMinutes)} · 대상일 {regWindow.marketDate}
        </p>
      )}
      {user && !regWindow.open && (
        <p className="mt-2 text-xs text-zinc-500">
          ⏰ {regWindow.reason}
        </p>
      )}

      {/* 탭 + 정렬 */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex gap-1">
          <TabLink href={`/guess?status=open&sort=${sort}`} active={status === "open"}>
            진행중
          </TabLink>
          <TabLink href={`/guess?status=closed&sort=${sort}`} active={status === "closed"}>
            진행완료
          </TabLink>
        </div>
        <div className="flex gap-1 text-xs">
          <SortLink href={`/guess?status=${status}&sort=latest`} active={sort === "latest"}>
            최신순
          </SortLink>
          <SortLink href={`/guess?status=${status}&sort=popular`} active={sort === "popular"}>
            참여자 많은 순
          </SortLink>
          <SortLink href={`/guess?status=${status}&sort=oldest`} active={sort === "oldest"}>
            가장 오래된 순
          </SortLink>
        </div>
      </div>

      {/* 리스트 */}
      <div className="mt-6">
        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-300">
            데이터 로드 실패: {error.message}
          </div>
        )}

        {!error && sortedChallenges.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
            <p className="text-zinc-400">
              {status === "open" ? "아직 진행중인 챌린지가 없어요." : "아직 종료된 챌린지가 없어요."}
            </p>
            {user && regWindow.open && status === "open" && (
              <Link
                href="/guess/new"
                className="mt-4 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
              >
                <Plus className="size-3.5" />
                첫 챌린지 등록하기
              </Link>
            )}
          </div>
        )}

        <div className="grid gap-3">
          {sortedChallenges.map((c) => (
            <ChallengeRow
              key={c.id}
              c={c}
              pickCount={pickCounts.get(c.id) ?? 0}
            />
          ))}
        </div>
      </div>

      {/* 모바일 전용 플로팅 등록 버튼 (로그인 + 등록 윈도우 열림 시) */}
      {user && regWindow.open && (
        <Link
          href="/guess/new"
          aria-label="챌린지 등록"
          className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-[#3182F6] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(49,130,246,0.7)] transition hover:bg-[#1B64DA] sm:hidden"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <Plus className="size-4" />
          챌린지 등록
        </Link>
      )}
    </div>
  );
}

function TabLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? "bg-white text-black" : "text-zinc-400 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

function SortLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 transition ${
        active
          ? "bg-white/[0.08] text-white"
          : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
      }`}
    >
      {children}
    </Link>
  );
}

type ChallengeRowProps = {
  c: {
    id: string;
    creator_name: string | null;
    ticker_a: string;
    ticker_b: string;
    name_a: string;
    name_b: string;
    market_date: string;
    status: string;
    winner: string | null;
    created_at: string;
    return_a: number | null;
    return_b: number | null;
  };
  pickCount: number;
};

function ChallengeRow({ c, pickCount }: ChallengeRowProps) {
  const isClosed = c.status !== "open";
  const created = new Date(c.created_at);
  const relative = formatRelative(created);

  return (
    <Link
      href={`/guess/${c.id}`}
      className="group flex flex-wrap items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/15 hover:bg-white/[0.04]"
    >
      <div className="flex flex-1 items-center gap-4">
        <SideBadge name={c.name_a} side="A" winner={c.winner === "A"} closed={isClosed} returnPct={c.return_a} />
        <span className="text-xs font-medium text-zinc-500">VS</span>
        <SideBadge name={c.name_b} side="B" winner={c.winner === "B"} closed={isClosed} returnPct={c.return_b} />
      </div>

      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1">
          <Users className="size-3.5" />
          {pickCount}명
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" />
          {relative}
        </span>
        {isClosed && c.winner && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-300">
            <Trophy className="size-3" />
            {c.winner} 승
          </span>
        )}
        {c.creator_name && (
          <span className="hidden sm:inline">@{c.creator_name}</span>
        )}
      </div>
    </Link>
  );
}

function SideBadge({
  name,
  side,
  winner,
  closed,
  returnPct,
}: {
  name: string;
  side: "A" | "B";
  winner: boolean;
  closed: boolean;
  returnPct: number | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className={`inline-flex size-7 items-center justify-center rounded-full text-xs font-bold ${
          closed && winner
            ? "bg-amber-500 text-amber-950"
            : "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
        }`}
      >
        {side}
      </span>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-white">{name}</div>
        {closed && returnPct !== null && (
          <div className={`text-xs tabular-nums ${returnPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {returnPct >= 0 ? "+" : ""}
            {returnPct.toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );
}

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return `${d}일 전`;
}
