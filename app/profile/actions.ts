"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateNickname(nickname: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요해요" };

  const trimmed = nickname.trim();
  if (!trimmed) return { ok: false, error: "닉네임을 입력해주세요" };
  if (trimmed.length < 2) return { ok: false, error: "닉네임은 2글자 이상이어야 해요" };
  if (trimmed.length > 20) return { ok: false, error: "닉네임은 20글자 이내여야 해요" };

  const { error } = await supabase.from("profiles").upsert({
    user_id: user.id,
    nickname: trimmed,
    updated_at: new Date().toISOString(),
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/profile");
  revalidatePath("/guess");
  return { ok: true };
}
