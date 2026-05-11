import { StockChart } from "@/components/StockChart";
import { MarketTag } from "@/components/MarketTag";
import { getCandles } from "@/lib/quote";
import { lookupTicker } from "@/lib/tickers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600;

type Props = {
  params: Promise<{ symbol: string }>;
};

export default async function QuotePage({ params }: Props) {
  const { symbol: raw } = await params;
  const symbol = decodeURIComponent(raw).toUpperCase();
  const meta = lookupTicker(symbol);
  const isKR =
    meta?.market === "KR" || /\.KS$|\.KQ$/i.test(symbol) || /^\d{6}/.test(symbol);

  const candles = await getCandles(symbol, "6M");

  if (!candles || candles.length < 2) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">종목을 찾을 수 없어요</h1>
        <p className="mt-3 text-zinc-400">
          <span className="font-mono text-zinc-200">{symbol}</span> 데이터를 받지 못했어요.
          <br />
          심볼을 다시 확인하거나, 처음 화면에서 익숙한 이름으로 검색해보세요.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-1 text-sm text-blue-400 transition hover:text-blue-300"
        >
          <ArrowLeft className="size-4" />
          검색으로
        </Link>
      </div>
    );
  }

  const displayName = meta?.name ?? symbol;
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const change = last.close - prev.close;
  const changePct = (change / prev.close) * 100;
  const up = change >= 0;

  const currency = isKR ? "₩" : "$";
  const fmt = (n: number) =>
    new Intl.NumberFormat(isKR ? "ko-KR" : "en-US", {
      maximumFractionDigits: isKR ? 0 : 2,
    }).format(n);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-zinc-100"
      >
        <ArrowLeft className="size-4" />
        검색으로
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MarketTag market={isKR ? "KR" : "US"} />
            <span className="text-xs font-mono text-zinc-500">{symbol}</span>
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{displayName}</h1>
          <p className="mt-1 text-xs text-zinc-500">
            최근 거래일 {last.time} · 데이터 출처 Yahoo Finance
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold tabular-nums">
            {currency}
            {fmt(last.close)}
          </div>
          <div
            className={`mt-1 text-sm font-medium tabular-nums ${
              up ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {up ? "▲" : "▼"} {currency}
            {fmt(Math.abs(change))} ({changePct >= 0 ? "+" : ""}
            {changePct.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <StockChart data={candles} height={520} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "시가", value: `${currency}${fmt(last.open)}` },
          { label: "고가", value: `${currency}${fmt(last.high)}` },
          { label: "저가", value: `${currency}${fmt(last.low)}` },
          { label: "거래량", value: fmt(last.volume) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
          >
            <div className="text-xs text-zinc-500">{s.label}</div>
            <div className="mt-1 text-lg font-medium tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
