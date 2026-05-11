export function MarketTag({ market }: { market: "US" | "KR" }) {
  const color =
    market === "US"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  const flag = market === "US" ? "🇺🇸" : "🇰🇷";
  return (
    <span className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${color}`}>
      <span>{flag}</span>
      {market}
    </span>
  );
}
