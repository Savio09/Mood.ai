"use client";
import { useState } from "react";
import { createNewEntry } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function NewEntryCard() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function create() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const entry = await createNewEntry();
      router.push(`/journal/${entry.id}`);
    } catch {
      setError("Could not create an entry. Please try again.");
      setBusy(false);
    }
  }
  return <div>
    <button onClick={create} disabled={busy} className="w-full text-left cursor-pointer overflow-hidden rounded-lg bg-white shadow px-4 py-5 sm:p-6 text-3xl">
      {busy ? "Creating…" : "New Entry"}
    </button>
    {error && <p role="alert">{error}</p>}
  </div>;
}
