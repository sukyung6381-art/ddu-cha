import Link from "next/link";
import { loadRankings, monthLabel } from "@/lib/rankings";
import { MarketTag } from "@/components/MarketTag";

export const metadata = {
  title: "명예의 전당 — Tickr",
  description: "10년 데이터로 뽑은 진짜 챔피언들",
};

export const revalidate = 3600;

function formatPct(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function formatMultiplier(n: number) {
  if (n >= 100) return `${n.toFixed(0)}×`;
  if (n >= 10) return `${n.toFixed(1)}×`;
  return `${n.toFixed(2)}×`;
}

export default async function HallOfFamePage() {
  const r = await loadRankings();
  const generated = new Date(r.generatedAt).toLocaleDateString("ko-KR");

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-12 text-center">
        <span className="mb-4 inline-block rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          🏆 데이터로 뽑은 챔피언들
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          명예의 전당
        </h1>
        <p className="mt-4 text-zinc-500">
          {r.universe}개 한미 대표 종목 · 10년 일봉 데이터 기준 · 갱신 {generated}
        </p>
      </header>

      {/* === 카드 1: 꾸준왕 === */}
      <section className="mb-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            📈 꾸준왕 <span className="text-zinc-400">— 10년 내내 +였던 종목</span>
          </h2>
          <span className="text-xs text-zinc-500">매 연말 종가 기준 10년 연속 상승</span>
        </div>

        {r.steadyKings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
            아직 10년 연속 상승한 종목이 없어요 🥹
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {r.steadyKings.map((e, i) => (
              <Link
                key={e.symbol}
                href={`/quote/${encodeURIComponent(e.symbol)}`}
                className="group rounded-xl border border-zinc-200 bg-gradient-to-br from-emerald-50 to-white p-6 transition hover:border-emerald-400 hover:shadow-md dark:border-zinc-800 dark:from-emerald-950/30 dark:to-zinc-900 dark:hover:border-emerald-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🏅"}</div>
                    <div className="mt-3 flex items-center gap-2">
                      <MarketTag market={e.market} />
                      <span className="text-xs text-zinc-500">{e.symbol}</span>
                    </div>
                    <div className="mt-1 text-lg font-semibold">{e.name}</div>
                  </div>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <div className="text-xs text-zinc-500">10년 누적</div>
                    <div className="text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {formatPct(e.totalReturnPct)}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {e.yearlyReturns.map((y) => (
                      <div
                        key={y.year}
                        title={`${y.year}: ${formatPct(y.pct)}`}
                        className="size-3 rounded-sm bg-emerald-500"
                        style={{ opacity: 0.3 + Math.min(0.7, Math.abs(y.pct) / 50) }}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {r.steadyAlmost.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-zinc-500">
              🌟 거의 무패 (10년 중 9년 + ) — {r.steadyAlmost.length}종목
            </h3>
            <div className="flex flex-wrap gap-2">
              {r.steadyAlmost.map((e) => (
                <Link
                  key={e.symbol}
                  href={`/quote/${encodeURIComponent(e.symbol)}`}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs transition hover:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-100"
                >
                  <MarketTag market={e.market} /> <span className="ml-1">{e.name}</span>{" "}
                  <span className="text-emerald-600">{formatPct(e.totalReturnPct)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* === 카드 2: 100배 클럽 / 폭주왕 === */}
      <section className="mb-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            🚀 폭주왕 <span className="text-zinc-400">— 10년 누적 수익률 TOP10</span>
          </h2>
          <span className="text-xs text-zinc-500">
            {r.moonshot100x.length > 0 ? `100배 클럽 ${r.moonshot100x.length}종목 포함` : "100배 클럽은 아직 비어있음"}
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
              <tr>
                <th className="px-6 py-3 text-left">순위</th>
                <th className="px-6 py-3 text-left">종목</th>
                <th className="px-6 py-3 text-right">10년 전 가격</th>
                <th className="px-6 py-3 text-right">현재 가격</th>
                <th className="px-6 py-3 text-right">배수</th>
                <th className="px-6 py-3 text-right hidden sm:table-cell">수익률</th>
              </tr>
            </thead>
            <tbody>
              {r.moonshotTop10.map((e, i) => {
                const isHundred = e.multiplier >= 100;
                return (
                  <tr
                    key={e.symbol}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                  >
                    <td className="px-6 py-4">
                      <span className="text-lg">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/quote/${encodeURIComponent(e.symbol)}`}
                        className="group flex items-center gap-2"
                      >
                        <MarketTag market={e.market} />
                        <div>
                          <div className="font-medium group-hover:underline">{e.name}</div>
                          <div className="text-xs text-zinc-500">{e.symbol}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-zinc-500">
                      {e.market === "KR" ? "₩" : "$"}
                      {e.from.close.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums">
                      {e.market === "KR" ? "₩" : "$"}
                      {e.to.close.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-semibold tabular-nums ${
                          isHundred
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {isHundred && "💎 "}
                        {formatMultiplier(e.multiplier)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">
                      {formatPct(e.totalReturnPct)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* === 카드 3: 이번달 챔피언 === */}
      <section className="mb-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            📅 {monthLabel(r.currentMonth)} 챔피언{" "}
            <span className="text-zinc-400">— 과거 {monthLabel(r.currentMonth)}에 가장 잘 오른 종목</span>
          </h2>
          <span className="text-xs text-zinc-500">최대 12년치 표본</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {r.monthTop.slice(0, 6).map((e, i) => (
            <Link
              key={e.symbol}
              href={`/quote/${encodeURIComponent(e.symbol)}`}
              className="group rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-900 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-zinc-400">#{i + 1}</span>
                    <MarketTag market={e.market} />
                  </div>
                  <div className="mt-2 text-lg font-semibold group-hover:underline">{e.name}</div>
                  <div className="text-xs text-zinc-500">{e.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-500">평균 {monthLabel(r.currentMonth)}</div>
                  <div className="text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatPct(e.avgReturnPct)}
                  </div>
                  <div className="text-xs text-zinc-500">
                    승률 {(e.winRate * 100).toFixed(0)}% · {e.sampleYears}년
                  </div>
                </div>
              </div>

              <div className="mt-5 flex h-8 items-end gap-1">
                {e.history.slice().reverse().map((h) => (
                  <div
                    key={h.year}
                    title={`${h.year}년 ${monthLabel(r.currentMonth)}: ${formatPct(h.pct)}`}
                    className={`flex-1 rounded-sm ${
                      h.pct >= 0 ? "bg-emerald-500" : "bg-red-500"
                    }`}
                    style={{
                      height: `${Math.min(100, Math.max(8, Math.abs(h.pct) * 4))}%`,
                      opacity: 0.4 + Math.min(0.6, Math.abs(h.pct) / 30),
                    }}
                  />
                ))}
              </div>
            </Link>
          ))}
        </div>

        {r.monthWorst.length > 0 && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50/50 p-5 dark:border-red-950 dark:bg-red-950/20">
            <h3 className="mb-3 text-sm font-medium text-red-700 dark:text-red-300">
              ⚠️ {monthLabel(r.currentMonth)}의 함정 — 과거 평균이 가장 나빴던 종목
            </h3>
            <div className="flex flex-wrap gap-2">
              {r.monthWorst.map((e) => (
                <Link
                  key={e.symbol}
                  href={`/quote/${encodeURIComponent(e.symbol)}`}
                  className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs transition hover:border-red-500 dark:border-red-900 dark:bg-zinc-900"
                >
                  <MarketTag market={e.market} /> <span className="ml-1">{e.name}</span>{" "}
                  <span className="text-red-600 dark:text-red-400">{formatPct(e.avgReturnPct)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
        ⚠️ 과거 수익률은 미래를 보장하지 않습니다. 투자 판단은 본인 책임이에요.
      </footer>
    </div>
  );
}
