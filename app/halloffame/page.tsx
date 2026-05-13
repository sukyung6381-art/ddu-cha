import { HallOfFame } from "@/components/HallOfFame";
import { loadRankings } from "@/lib/rankings";

export const revalidate = 3600;

export const metadata = {
  title: "우리 10년을 보자 — 뚜껑 차트",
  description: "10년 데이터로 가려낸 진짜 강한 종목들",
};

export default async function HallOfFamePage() {
  const rankings = await loadRankings();

  return (
    <>
      <section className="relative overflow-hidden px-6 pt-20 pb-8 sm:pt-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 size-[720px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 size-[400px] rounded-full bg-purple-600/15 blur-3xl" />
          <div className="absolute left-1/4 top-1/3 size-[320px] rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="flex flex-col items-center text-center">
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            살아남았다는 건,
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              강하다는 증거.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-400">
            10년 시장 비바람을 견디고도 매년 성장한 종목들.
            <br className="hidden sm:inline" />
            데이터가 가려낸, 진짜 강한 픽이에요.
          </p>
        </div>
      </section>

      <HallOfFame rankings={rankings} />
    </>
  );
}
