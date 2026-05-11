import YahooFinance from "yahoo-finance2";

const client = new YahooFinance();

export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Range = "1M" | "3M" | "6M" | "1Y" | "5Y";

const RANGE_DAYS: Record<Range, number> = {
  "1M": 31,
  "3M": 93,
  "6M": 186,
  "1Y": 372,
  "5Y": 5 * 365,
};

/**
 * 종목의 일봉 데이터 가져오기. 실패 시 null.
 */
export async function getCandles(
  symbol: string,
  range: Range = "6M"
): Promise<Candle[] | null> {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - RANGE_DAYS[range]);

    const result = await client.chart(symbol, {
      period1: start,
      period2: end,
      interval: "1d",
    });

    const quotes = result.quotes ?? [];
    const candles: Candle[] = [];
    for (const q of quotes) {
      if (q.date == null || q.close == null) continue;
      candles.push({
        time: new Date(q.date).toISOString().slice(0, 10),
        open: Number(q.open ?? q.close),
        high: Number(q.high ?? q.close),
        low: Number(q.low ?? q.close),
        close: Number(q.close),
        volume: Number(q.volume ?? 0),
      });
    }
    return candles.length > 0 ? candles : null;
  } catch (err) {
    console.error(`[getCandles] ${symbol}: ${(err as Error).message}`);
    return null;
  }
}
