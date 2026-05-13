// Supabase 인증 쿠키 옵션. maxAge 미지정 시 session cookie가 되어
// 브라우저 종료 시 로그아웃되므로 명시적으로 1년 만료를 부여한다.
export const AUTH_COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
  sameSite: "lax" as const,
};
