"use client";

import { useCallback, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import StatusBanner, { type BannerState } from "@/components/status_banner";
import copyIcon from "../../../../images/copy-link-icon.png";
import closeIcon from "../../../../images/close-line-icon.png";
import trashIcon from "../../../../images/recycle-bin-line-icon.png";

export type Meeting = {
  id: string;
  name: string;
  location: string;
  pin: string;
};

type NewMeeting = Pick<Meeting, "name" | "location">;

const emptyMeeting: NewMeeting = { name: "", location: "" };

// placeholder until the backend creates meetings: makes a random 4 digit pin locally
async function createMeeting(meeting: NewMeeting): Promise<Meeting> {
  // TODO: send to the backend when the API is available, e.g.
  // const res = await fetch("/api/meetings", { method: "POST", body: JSON.stringify(meeting) });
  // if (!res.ok) throw new Error(`Create failed: ${res.status}`);
  // return res.json();
  const pin = String(Math.floor(1000 + Math.random() * 9000));
  return { ...meeting, id: crypto.randomUUID(), pin };
}

// stops the meeting from accepting attendance codes
async function endMeeting(id: string) {
  // TODO: e.g. await fetch(`/api/meetings/${id}/end`, { method: "POST" });
  console.log("end meeting", id);
}

// removes the meeting entirely
async function deleteMeeting(id: string) {
  // TODO: e.g. await fetch(`/api/meetings/${id}`, { method: "DELETE" });
  console.log("delete meeting", id);
}

const panelStyle = { backgroundColor: '#CCCCCC', borderWidth: '10px', borderColor: '#000000', borderRadius: '20px' };
// shared by the header row and each meeting so the columns line up
const columnsClassName = "grid grid-cols-[1fr_1fr_0.6fr_auto] items-center gap-2 px-3 text-left text-black sm:gap-4 sm:px-5 [&>*]:min-w-0 [&>*]:break-words";
const blueButtonClassName = "cursor-pointer rounded-xl border-2 border-black bg-[#2f6db5] px-6 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50";
const rowClassName = "flex items-center justify-between gap-4 rounded-xl border-2 border-black bg-[#ededed] px-5 py-3";
const inputClassName = "w-1/2 min-w-0 rounded-xl border-2 border-black bg-white px-3 py-2 text-center text-black placeholder:text-gray-400";

function IconButton({ icon, label, onClick }: { icon: StaticImageData; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="cursor-pointer rounded-md p-1 hover:bg-[#cccccc] focus-visible:bg-[#cccccc]">
      <Image src={icon} alt="" width={20} height={20} className="brightness-0" />
    </button>
  );
}

function MeetingRow({ meeting, onCopy, onEnd, onDelete }: { meeting: Meeting; onCopy: () => void; onEnd: () => void; onDelete: () => void }) {
  return (
    <div className={`${columnsClassName} rounded-xl border-2 border-black bg-[#ededed] py-3 text-xs sm:text-base`}>
      <div>{meeting.name}</div>
      <div>{meeting.location}</div>
      <div>{meeting.pin}</div>
      <div className="flex gap-1 sm:gap-2">
        <IconButton icon={copyIcon} label={`Copy pin for ${meeting.name}`} onClick={onCopy} />
        <IconButton icon={closeIcon} label={`End ${meeting.name}`} onClick={onEnd} />
        <IconButton icon={trashIcon} label={`Delete ${meeting.name}`} onClick={onDelete} />
      </div>
    </div>
  );
}

function MeetingForm({ onCreated, onCancel }: { onCreated: (meeting: Meeting) => void; onCancel: () => void }) {
  const [answers, setAnswers] = useState<NewMeeting>(emptyMeeting);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFailed(false);
    try {
      onCreated(await createMeeting(answers));
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[700px] flex-col items-center gap-6">
      <div className="flex w-full flex-col gap-4 rounded-xl border-2 border-black bg-[#dddddd] p-4 text-black">
        <label className={rowClassName}>
          <span>Meeting Name:</span>
          <input
            type="text"
            required
            autoFocus
            value={answers.name}
            onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
            placeholder="Meeting Name:"
            className={inputClassName}
          />
        </label>
        <label className={rowClassName}>
          <span>Location:</span>
          <input
            type="text"
            required
            value={answers.location}
            onChange={(e) => setAnswers({ ...answers, location: e.target.value })}
            placeholder="Location:"
            className={inputClassName}
          />
        </label>
      </div>

      {failed && <p role="alert" className="text-red-700">Couldn&apos;t create the meeting, please try again</p>}

      <div className="flex gap-4">
        <button type="button" onClick={onCancel} className="cursor-pointer rounded-xl border-2 border-black bg-[#ededed] px-6 py-2 text-black">
          Cancel
        </button>
        <button type="submit" disabled={submitting || !answers.name.trim() || !answers.location.trim()} className={blueButtonClassName}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}

export default function MeetingManager({ initialMeetings }: { initialMeetings: Meeting[] }) {
  const [meetings, setMeetings] = useState(initialMeetings);
  // false shows the list of meetings, true shows the create form
  const [creating, setCreating] = useState(false);
  const [banner, setBanner] = useState<BannerState | null>(null);
  const hideBanner = useCallback(() => setBanner(null), []);

  function showBanner(type: BannerState["type"], message: string) {
    setBanner((current) => ({ type, message, id: (current?.id ?? 0) + 1 }));
  }

  async function handleCopy(meeting: Meeting) {
    try {
      await navigator.clipboard.writeText(meeting.pin);
      showBanner("success", `Copied pin ${meeting.pin}`);
    } catch {
      showBanner("error", "Couldn't copy the pin");
    }
  }

  async function handleRemove(meeting: Meeting, action: "end" | "delete") {
    const verb = action === "end" ? "End" : "Delete";
    if (!window.confirm(`${verb} "${meeting.name}"?`)) return;
    try {
      await (action === "end" ? endMeeting(meeting.id) : deleteMeeting(meeting.id));
      setMeetings((current) => current.filter((m) => m.id !== meeting.id));
      showBanner("success", action === "end" ? "Meeting ended" : "Meeting deleted");
    } catch {
      showBanner("error", `${verb} failed, please try again`);
    }
  }

  function handleCreated(meeting: Meeting) {
    setMeetings((current) => [...current, meeting]);
    setCreating(false);
    showBanner("success", `Meeting created, pin ${meeting.pin}`);
  }

  return (
    <>
      <StatusBanner banner={banner} onDone={hideBanner} />

      <main className="flex flex-1 items-center justify-center px-4 py-4 font-mono">
        <div className="flex max-h-[min(800px,85vh)] w-full max-w-[1200px] flex-col items-center gap-4 px-3 py-4 sm:px-6" style={panelStyle}>
          <h1 className="text-center text-3xl font-bold sm:text-4xl text-black">Meeting Manager</h1>

          {creating ? (
            <MeetingForm onCreated={handleCreated} onCancel={() => setCreating(false)} />
          ) : (
            <>
              <div className="flex min-h-64 w-full flex-1 flex-col gap-3 overflow-hidden rounded-[20px] border-[5px] border-black bg-[#dddddd] p-3">
                {/* header row, stays in place while the meetings scroll */}
                <div className={`${columnsClassName} shrink-0 rounded-xl border-2 border-black bg-[#ededed] py-1 text-xs sm:text-sm`}>
                  <div>Name:</div>
                  <div>Location:</div>
                  <div>Pin:</div>
                  {/* keeps the header columns lined up with the icon buttons below */}
                  <div className="invisible flex gap-1 sm:gap-2" aria-hidden>
                    <span className="h-7 w-7" /><span className="h-7 w-7" /><span className="h-7 w-7" />
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {meetings.length === 0 ? (
                    <p className="py-8 text-center text-black">No active meetings</p>
                  ) : (
                    meetings.map((meeting) => (
                      <MeetingRow
                        key={meeting.id}
                        meeting={meeting}
                        onCopy={() => handleCopy(meeting)}
                        onEnd={() => handleRemove(meeting, "end")}
                        onDelete={() => handleRemove(meeting, "delete")}
                      />
                    ))
                  )}
                </div>
              </div>

              <button type="button" onClick={() => setCreating(true)} className={blueButtonClassName}>
                Add A Meeting
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
