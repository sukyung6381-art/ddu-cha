export type TickerMeta = {
  symbol: string;
  name: string; // 한글 우선 표기
  market: "US" | "KR";
  aliases?: string[]; // 검색 시 매칭될 별칭들
};

export const US_TICKERS: TickerMeta[] = [
  { symbol: "AAPL", name: "애플", market: "US", aliases: ["Apple", "AAPL"] },
  { symbol: "MSFT", name: "마이크로소프트", market: "US", aliases: ["Microsoft", "MS", "마소"] },
  { symbol: "GOOGL", name: "알파벳", market: "US", aliases: ["Google", "구글", "Alphabet"] },
  { symbol: "AMZN", name: "아마존", market: "US", aliases: ["Amazon"] },
  { symbol: "NVDA", name: "엔비디아", market: "US", aliases: ["NVIDIA", "엔비디어", "엔디비아"] },
  { symbol: "META", name: "메타", market: "US", aliases: ["Meta", "페이스북", "Facebook", "FB"] },
  { symbol: "TSLA", name: "테슬라", market: "US", aliases: ["Tesla"] },
  { symbol: "BRK-B", name: "버크셔 해서웨이", market: "US", aliases: ["Berkshire", "버크셔", "버핏"] },
  { symbol: "JPM", name: "JP모건", market: "US", aliases: ["JPMorgan", "제이피모건"] },
  { symbol: "V", name: "비자", market: "US", aliases: ["Visa"] },
  { symbol: "JNJ", name: "존슨앤드존슨", market: "US", aliases: ["J&J", "JNJ"] },
  { symbol: "WMT", name: "월마트", market: "US", aliases: ["Walmart"] },
  { symbol: "MA", name: "마스터카드", market: "US", aliases: ["Mastercard"] },
  { symbol: "PG", name: "P&G", market: "US", aliases: ["Procter", "프록터앤갬블"] },
  { symbol: "XOM", name: "엑손모빌", market: "US", aliases: ["ExxonMobil", "엑손"] },
  { symbol: "KO", name: "코카콜라", market: "US", aliases: ["Coca-Cola", "코카"] },
  { symbol: "PEP", name: "펩시", market: "US", aliases: ["Pepsi", "PepsiCo"] },
  { symbol: "DIS", name: "디즈니", market: "US", aliases: ["Disney"] },
  { symbol: "NFLX", name: "넷플릭스", market: "US", aliases: ["Netflix"] },
  { symbol: "ADBE", name: "어도비", market: "US", aliases: ["Adobe"] },
  { symbol: "CRM", name: "세일즈포스", market: "US", aliases: ["Salesforce"] },
  { symbol: "AMD", name: "AMD", market: "US", aliases: ["에이엠디"] },
  { symbol: "INTC", name: "인텔", market: "US", aliases: ["Intel"] },
  { symbol: "BAC", name: "뱅크오브아메리카", market: "US", aliases: ["BoA"] },
  { symbol: "CSCO", name: "시스코", market: "US", aliases: ["Cisco"] },
  { symbol: "ABBV", name: "애브비", market: "US", aliases: ["AbbVie"] },
  { symbol: "COST", name: "코스트코", market: "US", aliases: ["Costco"] },
  { symbol: "MRK", name: "머크", market: "US", aliases: ["Merck"] },
  { symbol: "PFE", name: "화이자", market: "US", aliases: ["Pfizer"] },
  { symbol: "TMO", name: "써모피셔", market: "US", aliases: ["Thermo Fisher"] },
  { symbol: "ORCL", name: "오라클", market: "US", aliases: ["Oracle"] },
  { symbol: "ACN", name: "액센츄어", market: "US", aliases: ["Accenture"] },
  { symbol: "MCD", name: "맥도날드", market: "US", aliases: ["McDonald's", "맥날"] },
  { symbol: "CVX", name: "셰브론", market: "US", aliases: ["Chevron"] },
  { symbol: "NKE", name: "나이키", market: "US", aliases: ["Nike"] },
  { symbol: "HD", name: "홈디포", market: "US", aliases: ["Home Depot"] },
  { symbol: "IBM", name: "IBM", market: "US", aliases: ["아이비엠"] },
  { symbol: "AVGO", name: "브로드컴", market: "US", aliases: ["Broadcom"] },
  { symbol: "LLY", name: "일라이릴리", market: "US", aliases: ["Eli Lilly", "릴리"] },
  { symbol: "UNH", name: "유나이티드헬스", market: "US", aliases: ["UnitedHealth"] },
];

export const KR_TICKERS: TickerMeta[] = [
  { symbol: "005930.KS", name: "삼성전자", market: "KR", aliases: ["삼전", "Samsung"] },
  { symbol: "000660.KS", name: "SK하이닉스", market: "KR", aliases: ["하이닉스"] },
  { symbol: "035420.KS", name: "네이버", market: "KR", aliases: ["NAVER"] },
  { symbol: "035720.KS", name: "카카오", market: "KR", aliases: ["Kakao"] },
  { symbol: "005380.KS", name: "현대차", market: "KR", aliases: ["현대자동차", "Hyundai"] },
  { symbol: "005490.KS", name: "POSCO홀딩스", market: "KR", aliases: ["포스코"] },
  { symbol: "051910.KS", name: "LG화학", market: "KR" },
  { symbol: "006400.KS", name: "삼성SDI", market: "KR" },
  { symbol: "207940.KS", name: "삼성바이오로직스", market: "KR", aliases: ["삼바", "삼성바이오"] },
  { symbol: "068270.KS", name: "셀트리온", market: "KR" },
  { symbol: "105560.KS", name: "KB금융", market: "KR" },
  { symbol: "055550.KS", name: "신한지주", market: "KR", aliases: ["신한금융"] },
  { symbol: "000270.KS", name: "기아", market: "KR", aliases: ["Kia"] },
  { symbol: "028260.KS", name: "삼성물산", market: "KR" },
  { symbol: "015760.KS", name: "한국전력", market: "KR", aliases: ["한전"] },
  { symbol: "017670.KS", name: "SK텔레콤", market: "KR", aliases: ["SKT"] },
  { symbol: "030200.KS", name: "KT", market: "KR" },
  { symbol: "086790.KS", name: "하나금융지주", market: "KR", aliases: ["하나금융"] },
  { symbol: "009150.KS", name: "삼성전기", market: "KR" },
  { symbol: "010130.KS", name: "고려아연", market: "KR" },
  { symbol: "011200.KS", name: "HMM", market: "KR" },
  { symbol: "012330.KS", name: "현대모비스", market: "KR", aliases: ["모비스"] },
  { symbol: "018260.KS", name: "삼성SDS", market: "KR" },
  { symbol: "032830.KS", name: "삼성생명", market: "KR" },
  { symbol: "066570.KS", name: "LG전자", market: "KR" },
  { symbol: "090430.KS", name: "아모레퍼시픽", market: "KR", aliases: ["아모레"] },
  { symbol: "096770.KS", name: "SK이노베이션", market: "KR", aliases: ["SK이노"] },
  { symbol: "251270.KS", name: "넷마블", market: "KR" },
  { symbol: "003550.KS", name: "LG", market: "KR" },
  { symbol: "247540.KQ", name: "에코프로비엠", market: "KR", aliases: ["에코프로"] },
];

export const ALL_TICKERS: TickerMeta[] = [...US_TICKERS, ...KR_TICKERS];

export function lookupTicker(symbol: string): TickerMeta | undefined {
  return ALL_TICKERS.find((t) => t.symbol === symbol);
}

/**
 * 사용자가 입력한 쿼리(이름·별칭·심볼)를 실제 티커로 해석.
 * 우선순위: 심볼 정확 일치 → 이름/별칭 정확 일치 → 이름/별칭 startsWith → 부분일치
 */
export function resolveTicker(query: string): TickerMeta | undefined {
  const q = query.trim();
  if (!q) return undefined;
  const qUpper = q.toUpperCase();
  const qLower = q.toLowerCase();

  // 1. symbol 정확 일치
  const exactSym = ALL_TICKERS.find((t) => t.symbol.toUpperCase() === qUpper);
  if (exactSym) return exactSym;

  // 2. name / alias 정확 일치
  const exactName = ALL_TICKERS.find(
    (t) =>
      t.name.toLowerCase() === qLower ||
      t.aliases?.some((a) => a.toLowerCase() === qLower)
  );
  if (exactName) return exactName;

  // 3. startsWith
  const starts = ALL_TICKERS.find(
    (t) =>
      t.name.toLowerCase().startsWith(qLower) ||
      t.aliases?.some((a) => a.toLowerCase().startsWith(qLower))
  );
  if (starts) return starts;

  // 4. 부분 일치
  const contains = ALL_TICKERS.find(
    (t) =>
      t.name.toLowerCase().includes(qLower) ||
      t.aliases?.some((a) => a.toLowerCase().includes(qLower))
  );
  return contains;
}
