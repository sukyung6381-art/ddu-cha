import { promises as fs } from "node:fs";
import path from "node:path";

export type SteadyEntry = {
  symbol: string;
  name: string;
  market: "US" | "KR";
  yearsAllPositive: number;
  totalReturnPct: number;
  yearlyReturns: Array<{ year: number; pct: number }>;
};

export type MoonshotEntry = {
  symbol: string;
  name: string;
  market: "US" | "KR";
  multiplier: number;
  totalReturnPct: number;
  from: { date: string; close: number };
  to: { date: string; close: number };
};

export type MonthEntry = {
  symbol: string;
  name: string;
  market: "US" | "KR";
  month: number;
  avgReturnPct: number;
  winRate: number;
  sampleYears: number;
  history: Array<{ year: number; pct: number }>;
};

export type Rankings = {
  generatedAt: string;
  universe: number;
  currentMonth: number;
  steadyKings: SteadyEntry[];
  steadyAlmost: SteadyEntry[];
  moonshot100x: MoonshotEntry[];
  moonshotTop10: MoonshotEntry[];
  monthTop: MonthEntry[];
  monthWorst: MonthEntry[];
};

export async function loadRankings(): Promise<Rankings> {
  const file = path.join(process.cwd(), "data", "rankings.json");
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as Rankings;
}

const MONTH_KR = ["", "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
export function monthLabel(m: number) {
  return MONTH_KR[m] ?? `${m}월`;
}
