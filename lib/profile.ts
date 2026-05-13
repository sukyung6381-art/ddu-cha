import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * 사용자 표시명 우선순위:
 *   1. profiles.nickname (커스텀 닉네임)
 *   2. Google OAuth user_metadata.name / full_name
 *   3. 이메일 앞부분
 *   4. "익명"
 */
export async function getEffectiveName(
  supabase: SupabaseClient,
  user: User
): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("user_id", user.id)
    .maybeSingle();
  if (data?.nickname) return data.nickname;

  return (
    (user.user_metadata?.name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "익명"
  );
}
