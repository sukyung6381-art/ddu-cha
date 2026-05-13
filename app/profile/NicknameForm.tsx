"use client";

import { useState, useTransition } from "react";
import { updateNickname } from "./actions";

export function NicknameForm({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const dirty = value.trim() !== initial.trim();

  function save() {
    setMsg(null);
    startTransition(async () => {
      const res = await updateNickname(value);
      if (res.ok) {
        setMsg({ ok: true, text: "저장됐어요" });
      } else {
        setMsg({ ok: false, text: res.error });
      }
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (dirty && !isPending) save();
      }}
      className="space-y-4"
    >
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-400">
          닉네임
        </label>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (msg) setMsg(null);
          }}
          maxLength={20}
          placeholder="2~20자"
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-zinc-500 outline-none transition focus:border-blue-500/60"
        />
        <div className="mt-1 text-right text-xs text-zinc-500">
          {value.length} / 20
        </div>
      </div>

      {msg && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            msg.ok
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}
        >
          {msg.text}
        </div>
      )}

      <button
        type="submit"
        disabled={!dirty || isPending}
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#3182F6] text-sm font-semibold text-white shadow-[0_0_30px_-8px_rgba(49,130,246,0.5)] transition hover:bg-[#1B64DA] disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-zinc-500 disabled:shadow-none"
      >
        {isPending ? "저장 중..." : dirty ? "저장" : "변경사항 없음"}
      </button>
    </form>
  );
}
