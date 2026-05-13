/**
 * 게임 시간 규칙 (KST 기준)
 *
 * 챌린지 등록 윈도우:
 *   전일 15:30 (KR 장 마감) ~ 당일 09:00 (KR 장 개장)
 *   - market_date 는 윈도우가 가리키는 "다음 영업일"
 *
 * 픽:
 *   챌린지의 market_date 당일 11:00 KST 까지
 *
 * 정산:
 *   market_date 당일 16:00 이후 자동
 */
export const REGISTER_MORNING_CUTOFF_HOUR = 9;
export const MARKET_CLOSE_HOUR = 15;
export const MARKET_CLOSE_MINUTE = 30;
export const PICK_CUTOFF_HOUR = 11;

function nowKst(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
}

function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKstDateStr(): string {
  return fmtDate(nowKst());
}

function tomorrowKstDateStr(): string {
  const d = nowKst();
  d.setDate(d.getDate() + 1);
  return fmtDate(d);
}

export type RegistrationWindow =
  | {
      open: true;
      marketDate: string;
      cutoffLabel: string;
      remainingMinutes: number;
    }
  | {
      open: false;
      reason: string;
      nextOpenLabel: string;
    };

export function registrationWindow(): RegistrationWindow {
  const d = nowKst();
  const h = d.getHours();
  const m = d.getMinutes();

  // Case 1: 00:00 ~ 09:00 → 오늘이 market_date
  if (h < REGISTER_MORNING_CUTOFF_HOUR) {
    const minutes = (REGISTER_MORNING_CUTOFF_HOUR - h) * 60 - m;
    return {
      open: true,
      marketDate: todayKstDateStr(),
      cutoffLabel: "오늘 09:00 마감",
      remainingMinutes: minutes,
    };
  }

  // Case 2: 15:30 이후 → 내일이 market_date
  const afterClose =
    h > MARKET_CLOSE_HOUR ||
    (h === MARKET_CLOSE_HOUR && m >= MARKET_CLOSE_MINUTE);
  if (afterClose) {
    const target = new Date(d);
    target.setDate(d.getDate() + 1);
    target.setHours(REGISTER_MORNING_CUTOFF_HOUR, 0, 0, 0);
    const minutes = Math.ceil((target.getTime() - d.getTime()) / 60000);
    return {
      open: true,
      marketDate: tomorrowKstDateStr(),
      cutoffLabel: "내일 09:00 마감",
      remainingMinutes: minutes,
    };
  }

  // Case 3: 09:00 ~ 15:30 (장 진행중) → 등록 불가
  return {
    open: false,
    reason: "시장 진행중 — 등록은 장 마감(15:30) 이후 다시 열려요",
    nextOpenLabel: "오늘 15:30 ~",
  };
}

/** 챌린지 market_date 의 11:00 KST 이전이면 픽 가능 */
export function canPickNow(marketDate: string): boolean {
  return pickRemainingMinutes(marketDate) > 0;
}

export function pickRemainingMinutes(marketDate: string): number {
  const now = nowKst();
  const [y, mo, da] = marketDate.split("-").map(Number);
  const target = new Date(now);
  target.setFullYear(y, mo - 1, da);
  target.setHours(PICK_CUTOFF_HOUR, 0, 0, 0);
  if (now >= target) return 0;
  return Math.ceil((target.getTime() - now.getTime()) / 60000);
}

export function formatRemaining(minutes: number): string {
  if (minutes <= 0) return "마감";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}분 남음`;
  return `${h}시간 ${m}분 남음`;
}
