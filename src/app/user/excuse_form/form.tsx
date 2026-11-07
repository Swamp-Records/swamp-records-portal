"use client";

import { useCallback, useState } from "react";
import StatusBanner, { type BannerState } from "@/components/status_banner";

// TODO: replace with the real user type once it's defined
type User = unknown;

type ExcuseAnswers = {
  meetingName: string;
  meetingDate: string;
  reason: string;
  proof: File | null;
};

const emptyAnswers: ExcuseAnswers = { meetingName: "", meetingDate: "", reason: "", proof: null };

async function submitExcuse(answers: ExcuseAnswers, user: User | null) {
  // multipart form data instead of JSON so the proof file can be sent with the answers
  const body = new FormData();
  body.append("meetingName", answers.meetingName);
  body.append("meetingDate", answers.meetingDate);
  body.append("reason", answers.reason);
  if (answers.proof) body.append("proof", answers.proof);
  body.append("submittedAt", new Date().toISOString());
  body.append("user", JSON.stringify(user));

  // TODO: send to the backend when the API is available, e.g.
  // const res = await fetch("/api/excuses", { method: "POST", body });
  // if (!res.ok) throw new Error(`Submission failed: ${res.status}`);
  console.log("submit excuse", Object.fromEntries(body));
}

const rowClassName = "flex items-center justify-between gap-4 rounded-xl border-2 border-black bg-[#ededed] px-5 py-3";
const inputClassName = "w-1/2 min-w-0 rounded-xl border-2 border-black bg-white px-3 py-2 text-center text-black placeholder:text-gray-400";

export default function ExcuseFormSpace() {
  const [answers, setAnswers] = useState<ExcuseAnswers>(emptyAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<BannerState | null>(null);
  const hideBanner = useCallback(() => setBanner(null), []);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);
    try {
      await submitExcuse(answers, null); // TODO: pass the logged in user
      setAnswers(emptyAnswers);
      form.reset(); // file inputs can't be cleared through state, so reset the form itself
      setBanner({ type: "success", message: "Form submitted", id: Date.now() });
    } catch {
      setBanner({ type: "error", message: "Submission failed, please try again", id: Date.now() });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <StatusBanner banner={banner} onDone={hideBanner} />

      <main className="flex flex-1 items-center justify-center px-4 py-4 font-mono">
        <div className="flex w-full max-w-[1200px] flex-col items-center px-6 py-4" style={{ backgroundColor: '#CCCCCC', borderWidth: '10px', borderColor: '#000000', borderRadius: '20px'}}>
          <h1 className="mb-4 text-4xl font-bold text-black">Excuse Form</h1>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5 rounded-xl border-2 border-black bg-[#dddddd] p-4 text-black">
            <label className={rowClassName}>
              <span>Meeting Name:</span>
              <input
                type="text"
                required
                value={answers.meetingName}
                onChange={(e) => setAnswers({ ...answers, meetingName: e.target.value })}
                placeholder="Meeting Name:"
                className={inputClassName}
              />
            </label>

            <label className={rowClassName}>
              <span>Date of Meeting:</span>
              <input
                type="date"
                required
                value={answers.meetingDate}
                onChange={(e) => setAnswers({ ...answers, meetingDate: e.target.value })}
                className={inputClassName}
              />
            </label>

            <label className={`${rowClassName} flex-col`}>
              <span>Reason:</span>
              <input
                type="text"
                required
                value={answers.reason}
                onChange={(e) => setAnswers({ ...answers, reason: e.target.value })}
                placeholder="Reason:"
                className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-black placeholder:text-gray-400"
              />
            </label>

            <label className={`${rowClassName} cursor-pointer`}>
              <span>
                Proof of Absence:
                {answers.proof && <span className="block text-sm text-gray-600">{answers.proof.name}</span>}
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setAnswers({ ...answers, proof: e.target.files?.[0] ?? null })}
                className="sr-only"
              />
              <span className="flex size-14 items-center justify-center rounded-xl border-2 border-black bg-white" aria-hidden>
                <svg viewBox="0 0 24 24" className="size-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15V3M7 8l5-5 5 5M4 15v5h16v-5" />
                </svg>
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mx-auto mt-1 cursor-pointer rounded-xl bg-[#0a84ff] px-5 py-1.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
