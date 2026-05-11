/**
 * 야간 배치 시뮬: 종목별 10년치 일봉을 받아 data/history/<symbol>.json 으로 저장.
 * 사용: npm run data:refresh
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import YahooFinance from "yahoo-finance2";
import { ALL_TICKERS } from "../lib/tickers";

const yahooFinance = new YahooFinance();

const ROOT = path.resolve(__dirname, "..");
const HISTORY_DIR = path.join(ROOT, "data", "history");

const YEARS_BACK = 11;

type Row = { date: string; close: number; volume: number };

async function fetchOne(symbol: string): Promise<Row[]> {
  const end = new Date();
  const start = new Date();
  start.setFullYear(end.getFullYear() - YEARS_BACK);

  const result = await yahooFinance.chart(symbol, {
    period1: start,
    period2: end,
    interval: "1d",
  });

  const quotes = result.quotes ?? [];
  return quotes
    .filter((q) => q.close != null && q.date)
    .map((q) => ({
      date: new Date(q.date).toISOString().slice(0, 10),
      close: Number(q.close),
      volume: Number(q.volume ?? 0),
    }));
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  await fs.mkdir(HISTORY_DIR, { recursive: true });

  let success = 0;
  let failed = 0;
  const summary: Array<{ symbol: string; rows: number; from: string; to: string }> = [];

  for (const t of ALL_TICKERS) {
    try {
      const rows = await fetchOne(t.symbol);
      if (rows.length === 0) {
        console.warn(`  ⚠️  ${t.symbol} — 0 rows`);
        failed++;
        continue;
      }
      const file = path.join(HISTORY_DIR, `${t.symbol.replace("/", "_")}.json`);
      await fs.writeFile(file, JSON.stringify(rows));
      summary.push({
        symbol: t.symbol,
        rows: rows.length,
        from: rows[0].date,
        to: rows[rows.length - 1].date,
      });
      success++;
      process.stdout.write(`  ✓ ${t.symbol.padEnd(12)} ${rows.length} rows  ${rows[0].date} → ${rows[rows.length - 1].date}\n`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${t.symbol} — ${(err as Error).message}`);
    }
    await sleep(150);
  }

  await fs.writeFile(
    path.join(ROOT, "data", "history-summary.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), success, failed, summary }, null, 2)
  );

  console.log(`\nDone. ✓${success}  ✗${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
