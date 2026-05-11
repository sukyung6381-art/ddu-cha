/**
 * data/history/*.json 을 읽어 명예의 전당 3종 랭킹 계산.
 * 결과: data/rankings.json
 *
 * 사용: npm run rankings:build
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { ALL_TICKERS, lookupTicker } from "../lib/tickers";

const ROOT = path.resolve(__dirname, "..");
const HISTORY_DIR = path.join(ROOT, "data", "history");

type Row = { date: string; close: number; volume: number };

async function loadHistory(symbol: string): Promise<Row[] | null> {
  try {
    const file = path.join(HISTORY_DIR, `${symbol.replace("/", "_")}.json`);
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as Row[];
  } catch {
    return null;
  }
}

// ----- 랭킹 1. 꾸준왕 (지난 N개 캘린더 연도 모두 + 수익) -----

type SteadyEntry = {
  symbol: string;
  name: string;
  market: "US" | "KR";
  yearsAllPositive: number;
  totalReturnPct: number;
  yearlyReturns: Array<{ year: number; pct: number }>;
};

function yearEndCloses(rows: Row[]): Map<number, number> {
  const byYear = new Map<number, Row>();
  for (const r of rows) {
    const y = Number(r.date.slice(0, 4));
    const prev = byYear.get(y);
    if (!prev || r.date > prev.date) byYear.set(y, r);
  }
  const out = new Map<number, number>();
  for (const [y, r] of byYear) out.set(y, r.close);
  return out;
}

function computeSteady(symbol: string, rows: Row[]): SteadyEntry | null {
  const meta = lookupTicker(symbol);
  if (!meta) return null;

  const yearEnd = yearEndCloses(rows);
  const currentYear = new Date().getFullYear();
  // 직전 10개 완료 연도: (currentYear - 10) ~ (currentYear - 1)
  const years: number[] = [];
  for (let y = currentYear - 10; y < currentYear; y++) years.push(y);

  const yearlyReturns: Array<{ year: number; pct: number }> = [];
  let allPositive = 0;
  for (const y of years) {
    const close = yearEnd.get(y);
    const prevClose = yearEnd.get(y - 1);
    if (close == null || prevClose == null) return null;
    const pct = (close / prevClose - 1) * 100;
    yearlyReturns.push({ year: y, pct: +pct.toFixed(2) });
    if (pct > 0) allPositive++;
  }

  const first = yearEnd.get(currentYear - 11) ?? yearEnd.get(currentYear - 10);
  const last = yearEnd.get(currentYear - 1);
  if (first == null || last == null) return null;
  const totalReturnPct = +((last / first - 1) * 100).toFixed(2);

  return {
    symbol,
    name: meta.name,
    market: meta.market,
    yearsAllPositive: allPositive,
    totalReturnPct,
    yearlyReturns,
  };
}

// ----- 랭킹 2. 가장 많이 오른 종목 (10년 누적 수익률 TOP) -----

type MoonshotEntry = {
  symbol: string;
  name: string;
  market: "US" | "KR";
  multiplier: number; // ex) 27.3 = 27.3배
  totalReturnPct: number;
  from: { date: string; close: number };
  to: { date: string; close: number };
};

function computeMoonshot(symbol: string, rows: Row[]): MoonshotEntry | null {
  const meta = lookupTicker(symbol);
  if (!meta || rows.length < 100) return null;

  const today = new Date();
  const tenYearsAgo = new Date(today);
  tenYearsAgo.setFullYear(today.getFullYear() - 10);
  const cutoff = tenYearsAgo.toISOString().slice(0, 10);

  const startRow = rows.find((r) => r.date >= cutoff);
  const endRow = rows[rows.length - 1];
  if (!startRow || !endRow) return null;

  const multiplier = endRow.close / startRow.close;
  return {
    symbol,
    name: meta.name,
    market: meta.market,
    multiplier: +multiplier.toFixed(2),
    totalReturnPct: +((multiplier - 1) * 100).toFixed(2),
    from: { date: startRow.date, close: +startRow.close.toFixed(2) },
    to: { date: endRow.date, close: +endRow.close.toFixed(2) },
  };
}

// ----- 랭킹 3. 이번달 챔피언 (현재 월 기준 과거 평균 수익률) -----

type MonthEntry = {
  symbol: string;
  name: string;
  market: "US" | "KR";
  month: number;
  avgReturnPct: number;
  winRate: number; // 0~1
  sampleYears: number;
  history: Array<{ year: number; pct: number }>;
};

function computeMonthChampion(symbol: string, rows: Row[], month: number): MonthEntry | null {
  const meta = lookupTicker(symbol);
  if (!meta) return null;

  // 월의 첫 거래일 종가 vs 마지막 거래일 종가
  const byYear = new Map<number, Row[]>();
  for (const r of rows) {
    const y = Number(r.date.slice(0, 4));
    const m = Number(r.date.slice(5, 7));
    if (m !== month) continue;
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(r);
  }

  const history: Array<{ year: number; pct: number }> = [];
  for (const [year, monthRows] of byYear) {
    if (monthRows.length < 5) continue;
    monthRows.sort((a, b) => (a.date < b.date ? -1 : 1));
    const first = monthRows[0];
    const last = monthRows[monthRows.length - 1];
    const pct = (last.close / first.close - 1) * 100;
    history.push({ year, pct: +pct.toFixed(2) });
  }

  if (history.length < 5) return null; // 표본 5년 미만 제외

  const avg = history.reduce((s, h) => s + h.pct, 0) / history.length;
  const wins = history.filter((h) => h.pct > 0).length;
  return {
    symbol,
    name: meta.name,
    market: meta.market,
    month,
    avgReturnPct: +avg.toFixed(2),
    winRate: +(wins / history.length).toFixed(2),
    sampleYears: history.length,
    history: history.sort((a, b) => b.year - a.year),
  };
}

// ----- 메인 -----

async function main() {
  const currentMonth = new Date().getMonth() + 1; // 1~12

  const steadyAll: SteadyEntry[] = [];
  const moonshotAll: MoonshotEntry[] = [];
  const monthAll: MonthEntry[] = [];

  for (const t of ALL_TICKERS) {
    const rows = await loadHistory(t.symbol);
    if (!rows || rows.length === 0) continue;

    const s = computeSteady(t.symbol, rows);
    if (s) steadyAll.push(s);

    const m = computeMoonshot(t.symbol, rows);
    if (m) moonshotAll.push(m);

    const mo = computeMonthChampion(t.symbol, rows, currentMonth);
    if (mo) monthAll.push(mo);
  }

  // 꾸준왕: 10년 무패만, 누적 수익률 높은 순
  const steadyKings = steadyAll
    .filter((e) => e.yearsAllPositive === 10)
    .sort((a, b) => b.totalReturnPct - a.totalReturnPct);

  // 9년 이상 (relaxed) 도 따로 제공
  const steadyAlmost = steadyAll
    .filter((e) => e.yearsAllPositive >= 9 && e.yearsAllPositive < 10)
    .sort((a, b) => b.yearsAllPositive - a.yearsAllPositive || b.totalReturnPct - a.totalReturnPct);

  // 100배 클럽 또는 가장 많이 오른 TOP10
  const moonshot100x = moonshotAll
    .filter((e) => e.multiplier >= 100)
    .sort((a, b) => b.multiplier - a.multiplier);
  const moonshotTop10 = moonshotAll
    .sort((a, b) => b.multiplier - a.multiplier)
    .slice(0, 10);

  // 이번달 챔피언 TOP10 (승률 + 평균 수익률)
  const monthTop = monthAll
    .sort((a, b) => b.avgReturnPct - a.avgReturnPct)
    .slice(0, 10);
  const monthWorst = monthAll
    .sort((a, b) => a.avgReturnPct - b.avgReturnPct)
    .slice(0, 5);

  const result = {
    generatedAt: new Date().toISOString(),
    universe: ALL_TICKERS.length,
    currentMonth,
    steadyKings,
    steadyAlmost,
    moonshot100x,
    moonshotTop10,
    monthTop,
    monthWorst,
  };

  await fs.mkdir(path.join(ROOT, "data"), { recursive: true });
  await fs.writeFile(
    path.join(ROOT, "data", "rankings.json"),
    JSON.stringify(result, null, 2)
  );

  console.log(`\n=== 랭킹 요약 ===`);
  console.log(`전체 종목: ${ALL_TICKERS.length}`);
  console.log(`\n📈 꾸준왕 (10년 무패): ${steadyKings.length}종목`);
  steadyKings.slice(0, 5).forEach((e) =>
    console.log(`   ${e.symbol.padEnd(12)} ${e.name.padEnd(20)} 10년 누적 ${e.totalReturnPct.toFixed(1)}%`)
  );
  console.log(`\n📈 거의 무패 (9/10): ${steadyAlmost.length}종목`);
  console.log(`\n🚀 100배 클럽: ${moonshot100x.length}종목`);
  console.log(`🚀 10년 수익률 TOP10:`);
  moonshotTop10.forEach((e) =>
    console.log(`   ${e.symbol.padEnd(12)} ${e.name.padEnd(20)} ${e.multiplier}× (+${e.totalReturnPct.toFixed(0)}%)`)
  );
  console.log(`\n📅 ${currentMonth}월 챔피언 TOP10 (평균 ${currentMonth}월 수익률):`);
  monthTop.forEach((e) =>
    console.log(`   ${e.symbol.padEnd(12)} ${e.name.padEnd(20)} 평균 ${e.avgReturnPct.toFixed(2)}%  승률 ${(e.winRate * 100).toFixed(0)}%  (${e.sampleYears}년 표본)`)
  );
  console.log(`\n→ data/rankings.json 저장 완료`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
