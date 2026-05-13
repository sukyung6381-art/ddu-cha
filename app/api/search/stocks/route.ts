import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { ALL_TICKERS } from "@/lib/tickers";

const yahooFinance = new YahooFinance();

export type StockHit = {
  symbol: string;
  name: string;
  market: "KS" | "KQ";
};

function fromCuratedList(q: string): StockHit[] {
  const qLower = q.toLowerCase();
  const out: StockHit[] = [];
  for (const t of ALL_TICKERS) {
    if (t.market !== "KR") continue;
    const matchesName = t.name.toLowerCase().includes(qLower);
    const matchesAlias = t.aliases?.some((a) => a.toLowerCase().includes(qLower)) ?? false;
    if (matchesName || matchesAlias) {
      const m = /\.(KS|KQ)$/.exec(t.symbol);
      if (!m) continue;
      out.push({ symbol: t.symbol, name: t.name, market: m[1] as "KS" | "KQ" });
    }
  }
  return out;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 1) {
    return NextResponse.json({ hits: [] });
  }

  // 1) 큐레이션 리스트(빠르고 한글 잘 매칭)
  const curatedHits = fromCuratedList(q);

  // 2) Yahoo Finance search (KR 로케일)
  let yahooHits: StockHit[] = [];
  try {
    const res = await yahooFinance.search(q, {
      quotesCount: 25,
      newsCount: 0,
      lang: "ko-KR",
      region: "KR",
    } as Parameters<typeof yahooFinance.search>[1]);

    for (const quote of res.quotes ?? []) {
      const sym = "symbol" in quote && typeof quote.symbol === "string" ? quote.symbol : undefined;
      if (!sym) continue;
      const m = /\.(KS|KQ)$/.exec(sym);
      if (!m) continue;
      const name =
        ("shortname" in quote && quote.shortname) ||
        ("longname" in quote && quote.longname) ||
        sym;
      yahooHits.push({ symbol: sym, name: String(name), market: m[1] as "KS" | "KQ" });
    }
  } catch (err) {
    console.error("[search] yahoo error:", (err as Error).message);
  }

  // 3) 합치되 큐레이션 우선, 그 다음 Yahoo (중복 symbol 제거)
  const seen = new Set<string>();
  const merged: StockHit[] = [];
  for (const h of [...curatedHits, ...yahooHits]) {
    if (seen.has(h.symbol)) continue;
    seen.add(h.symbol);
    merged.push(h);
  }

  console.log(
    `[search] q="${q}" curated=${curatedHits.length} yahoo=${yahooHits.length} merged=${merged.length}`
  );

  return NextResponse.json({ hits: merged });
}
