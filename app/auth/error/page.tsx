import Link from "next/link";

export const metadata = { title: "로그인 실패 — 뚜껑 차트" };

export default function AuthErrorPage() {
  return (
    <div className="mx-auto flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">로그인이 완료되지 않았어요</h1>
      <p className="mt-3 max-w-md text-zinc-400">
        Google 인증 도중 문제가 생겼어요. 다시 시도해주세요.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-zinc-200"
      >
        홈으로
      </Link>
    </div>
  );
}
