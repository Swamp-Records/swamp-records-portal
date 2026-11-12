"use client";

import { useState } from "react";

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

function AuthCodeForm({ tile }: { tile: Tile }) {
  const [code, setCode] = useState("");

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: send { meetingId: tile.id, code} to the backend when the API is available
    console.log("submit attendance", { meetingId: tile.id, code });
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
        disabled={!code}
        className="cursor-pointer rounded-xl border-2 border-black bg-[#2f6db5] px-4 py-2 text-sm text-white sm:px-6 sm:text-base disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit
      </button>
    </form>
  );
}

function DisplayTile({ tile, expanded, onToggle }: { tile: Tile; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="shrink-0 overflow-hidden" style={{ width: '100%', backgroundColor: '#EDEDED', borderWidth: '5px', borderColor: '#000000', borderRadius: '20px', marginBottom: '10px'}}>
      <button type="button" onClick={onToggle} aria-expanded={expanded} className="block w-full cursor-pointer py-4 hover:bg-[#e0e0e0] sm:py-6">
        <DisplayTileContent tile={tile} />
      </button>
      {expanded && <AuthCodeForm tile={tile} />}
    </div>
  );
}

export default function MeetingList({ tiles }: { tiles: Tile[] }) {
  // only one tile can be open at a time
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
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
          />
        ))}
      </div>
    </>
  );
}
