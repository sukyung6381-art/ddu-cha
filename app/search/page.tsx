import { SymbolSearch } from "@/components/SymbolSearch";

export const metadata = { title: "종목 찾기 — 뚜껑 차트" };

export default function SearchPage() {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 size-[720px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 size-[480px] rounded-full bg-purple-600/15 blur-3xl" />
        <div className="absolute left-1/4 top-1/3 size-[360px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="flex flex-col items-center text-center">
        <h1 className="max-w-2xl text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          어떤 종목이
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            궁금하신가요?
          </span>
        </h1>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-400">
          이름만 입력하면 됩니다. 한미 어떤 종목이든
          <br className="hidden sm:inline" />
          일봉 차트로 즉시 보여드려요.
        </p>

        <div className="mt-12 w-full">
          <div className="mx-auto flex max-w-xl flex-col items-center">
            <SymbolSearch />
          </div>
        </div>
      </div>
    </section>
  );
}
