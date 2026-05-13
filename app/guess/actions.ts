"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canPickNow, registrationWindow } from "@/lib/guess/rules";
import { getEffectiveName } from "@/lib/profile";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createChallenge(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요해요" };

  const window = registrationWindow();
  if (!window.open) {
    return { ok: false, error: window.reason };
  }

  const tickerA = String(formData.get("ticker_a") ?? "");
  const tickerB = String(formData.get("ticker_b") ?? "");
  const nameA = String(formData.get("name_a") ?? "");
  const nameB = String(formData.get("name_b") ?? "");

  if (!tickerA || !tickerB || tickerA === tickerB) {
    return { ok: false, error: "서로 다른 두 종목을 선택해주세요" };
  }
  if (!/\.K[SQ]$/.test(tickerA) || !/\.K[SQ]$/.test(tickerB)) {
    return { ok: false, error: "국내 주식만 등록 가능합니다" };
  }

  const creatorName = await getEffectiveName(supabase, user);

  const { data, error } = await supabase
    .from("challenges")
    .insert({
      creator_id: user.id,
      creator_name: creatorName,
      ticker_a: tickerA,
      ticker_b: tickerB,
      name_a: nameA,
      name_b: nameB,
      market_date: window.marketDate,
      status: "open",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: `${window.marketDate} 챌린지는 이미 등록했어요 (1인 1챌린지)` };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/guess");
  redirect(`/guess/${data.id}`);
}

export async function submitPick(challengeId: string, pick: "A" | "B"): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요해요" };

  const { data: challenge, error: cErr } = await supabase
    .from("challenges")
    .select("market_date, status")
    .eq("id", challengeId)
    .single();
  if (cErr || !challenge) return { ok: false, error: "챌린지를 찾을 수 없어요" };

  if (challenge.status !== "open") {
    return { ok: false, error: "이미 마감된 챌린지입니다" };
  }
  if (!canPickNow(challenge.market_date)) {
    return { ok: false, error: `픽 마감 — ${challenge.market_date} 11:00 KST까지였어요` };
  }

  const userName = await getEffectiveName(supabase, user);

  const { error } = await supabase.from("picks").insert({
    challenge_id: challengeId,
    user_id: user.id,
    user_name: userName,
    pick,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "이미 픽을 제출했어요 (변경 불가)" };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath(`/guess/${challengeId}`);
  revalidatePath("/guess");
  return { ok: true };
}
