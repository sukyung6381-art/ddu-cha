# Tickr

한국(KOSPI·KOSDAQ)과 미국(NASDAQ·NYSE) 주식의 시세·차트를 한 곳에서 보는 웹서비스.

## 기술 스택

| 영역 | 선택 |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| 스타일 | Tailwind CSS v4 |
| 차트 | [lightweight-charts](https://tradingview.github.io/lightweight-charts/) (TradingView 무료 차트) |
| 데이터 페칭 | TanStack Query |
| 인증·DB | Supabase (Postgres + Auth) |
| 시세 — 미국 | Finnhub API |
| 시세 — 한국 | 한국투자증권 KIS OpenAPI |

## 로컬 실행

```bash
# 환경변수 준비
cp .env.local.example .env.local
# 각 키 채우기

npm run dev
# http://localhost:3000
```

## 현재 진행 상황

- [x] 프로젝트 스캐폴딩 (Next.js + Tailwind + lightweight-charts)
- [x] 랜딩 페이지 + 종목 검색 UI
- [x] 차트 페이지 (현재는 목업 데이터)
- [ ] Supabase 인증 연동
- [ ] Finnhub로 실제 미국 시세 연결
- [ ] KIS OpenAPI로 국내 시세 연결
- [ ] WebSocket 실시간 푸시
- [ ] 관심종목 저장
- [ ] 배포 (Vercel + Supabase)

## 폴더 구조

```
app/
  page.tsx              # 랜딩
  quote/[symbol]/       # 종목 상세 차트
  layout.tsx
components/
  Header.tsx
  StockChart.tsx        # lightweight-charts 래퍼
  SymbolSearch.tsx
lib/
  utils.ts
  mock-candles.ts       # 데모 데이터 (추후 실제 API로 교체)
```
