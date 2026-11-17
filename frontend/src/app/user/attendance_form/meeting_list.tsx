"use client";

import { useCallback, useState } from "react";
import StatusBanner, { type BannerState } from "@/components/status_banner";

export type Tile = {
  name: string;
  location: string;
  date: string;
  time: string;
  id: string;
};

// shared by the header row and each tile so the columns line up
// shared by the header row and each tile so the columns line up, with smaller spacing on phones
const columnsClassName = "grid grid-cols-5 items-center gap-2 px-2 text-center text-black sm:gap-4 sm:px-6 [&>*]:min-w-0";
// tile values can wrap onto a second line if they're long
const tileColumnsClassName = `${columnsClassName} text-xs sm:text-base [&>*]:break-words`;
// header labels stay on one line and scale with the screen width instead (between 8px and 16px)
const headerColumnsClassName = `${columnsClassName} whitespace-nowrap text-[clamp(0.5rem,2.2vw,1rem)]`;

function DisplayTileContent({ tile }: { tile: Tile }) {
  return (
    <div className={tileColumnsClassName}>
      <div>{tile.name}</div>
      <div>{tile.location}</div>
      <div>{tile.date}</div>
      <div>{tile.time}</div>
      <div>#{tile.id}</div>
    </div>
  );
}

// placeholder until the backend can verify codes: any all-digit code is accepted
const TEMP_VALID_CODE = /^\d+$/;

// resolves true if the code was accepted, false if it was rejected, throws if the request itself failed
async function submitAttendance(meetingId: string, code: string): Promise<boolean> {
  // TODO: send to the backend when the API is available, e.g.
  // const res = await fetch("/api/attendance", { method: "POST", body: JSON.stringify({ meetingId, code }) });
  // if (res.status === 400 || res.status === 403) return false;
  // if (!res.ok) throw new Error(`Submission failed: ${res.status}`);
  // return true;
  console.log("submit attendance", { meetingId, code });
  return TEMP_VALID_CODE.test(code);
}

function AuthCodeForm({ tile, onResult }: { tile: Tile; onResult: (banner: Omit<BannerState, "id">, accepted: boolean) => void }) {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const accepted = await submitAttendance(tile.id, code);
      if (accepted) {
        onResult({ type: "success", message: "Attendance recorded" }, true);
      } else {
        setCode("");
        onResult({ type: "error", message: "Invalid code, please try again" }, false);
      }
    } catch {
      onResult({ type: "error", message: "Submission failed, please try again" }, false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t-2 border-dashed border-black px-3 py-4 sm:gap-4 sm:px-6">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Meeting authentication code:"
        aria-label="Meeting authentication code"
        autoFocus
        className="min-w-0 flex-1 rounded-xl border-2 border-black bg-white px-3 py-2 text-sm text-black sm:px-4 sm:text-base"
      />
      <button
        type="submit"
        disabled={!code || submitting}
        className="cursor-pointer rounded-xl border-2 border-black bg-[#2f6db5] px-4 py-2 text-sm text-white sm:px-6 sm:text-base disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

function DisplayTile({ tile, expanded, onToggle, onResult }: { tile: Tile; expanded: boolean; onToggle: () => void; onResult: (banner: Omit<BannerState, "id">, accepted: boolean) => void }) {
  return (
    <div className="shrink-0 overflow-hidden" style={{ width: '100%', backgroundColor: '#EDEDED', borderWidth: '5px', borderColor: '#000000', borderRadius: '20px', marginBottom: '10px'}}>
      <button type="button" onClick={onToggle} aria-expanded={expanded} className="block w-full cursor-pointer py-4 hover:bg-[#e0e0e0] sm:py-6">
        <DisplayTileContent tile={tile} />
      </button>
      {expanded && <AuthCodeForm tile={tile} onResult={onResult} />}
    </div>
  );
}

export default function MeetingList({ tiles }: { tiles: Tile[] }) {
  // only one tile can be open at a time
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [banner, setBanner] = useState<BannerState | null>(null);
  const hideBanner = useCallback(() => setBanner(null), []);

  function handleResult(result: Omit<BannerState, "id">, accepted: boolean) {
    setBanner({ ...result, id: Date.now() });
    if (accepted) setExpandedId(null); // close the tile once attendance is recorded
  }

  return (
    <>
      <StatusBanner banner={banner} onDone={hideBanner} />

      <main className="flex flex-1 items-center justify-center px-4 py-4 font-mono">
        {/* grows with the list up to the max height, then the list scrolls */}
        <div className="flex max-h-[min(800px,85vh)] w-full max-w-[1200px] flex-col items-center px-3 py-4 sm:px-6" style={{ backgroundColor: '#CCCCCC', borderWidth: '10px', borderColor: '#000000', borderRadius: '20px'}}>
          <h1 className="mb-4 text-center text-3xl font-bold sm:text-4xl text-black">Select a Meeting</h1>
          {/* header row, stays in place while the tiles scroll */}
          <div className="shrink-0 py-2" style={{ width: '100%', backgroundColor: '#EDEDED', borderWidth: '5px', borderColor: '#000000', borderRadius: '20px', marginBottom: '10px'}}>
            <div className={headerColumnsClassName}>
              <div>Name:</div>
              <div>Location:</div>
              <div>Date:</div>
              <div>Time:</div>
              <div>ID:</div>
            </div>
          </div>

          {/* scrollable panel holding the meeting tiles */}
          <div className="min-h-0 w-full flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-[20px] border-[5px] border-black bg-[#dddddd] p-3">
            {tiles.map((tile) => (
              <DisplayTile
                key={tile.id}
                tile={tile}
                expanded={expandedId === tile.id}
                onToggle={() => setExpandedId(expandedId === tile.id ? null : tile.id)}
                onResult={handleResult}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
