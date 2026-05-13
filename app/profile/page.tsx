import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getEffectiveName } from "@/lib/profile";
import { NicknameForm } from "./NicknameForm";

export const metadata = { title: "프로필 — 뚜껑 차트" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const currentName = await getEffectiveName(supabase, user);

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-white"
      >
        <ArrowLeft className="size-4" />
        홈으로
      </Link>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
        프로필
      </h1>
      <p className="mt-3 text-sm text-zinc-400">
        챌린지·픽에 표시되는 이름을 설정해요.
      </p>

      <div className="mt-10 space-y-6">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-sm text-zinc-400">
          <div className="text-xs text-zinc-500">로그인 계정</div>
          <div className="mt-1 text-white">{user.email}</div>
        </div>

        <NicknameForm initial={currentName} />
      </div>

      <p className="mt-8 text-xs text-zinc-500">
        ⓘ 닉네임을 바꿔도 이미 등록된 챌린지·픽의 표시명은 그대로 유지됩니다 (스냅샷).
      </p>
    </div>
  );
}
