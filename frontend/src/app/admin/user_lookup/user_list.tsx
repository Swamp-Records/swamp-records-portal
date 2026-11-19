"use client";

import { useCallback, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import StatusBanner, { type BannerState } from "@/components/status_banner";

// 0 = unexcused absence, 1 = excused absence, 2 = attended
type MeetingStatus = 0 | 1 | 2;

export type MemberMeeting = {
  name: string;
  date: string;
  status: MeetingStatus;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  photo: StaticImageData | string;
  meetings: MemberMeeting[];
};

const statusInfo: Record<MeetingStatus, { color: string; label: string }> = {
  0: { color: "#FF4444", label: "Unexcused absence" },
  1: { color: "#FFC400", label: "Excused absence" },
  2: { color: "#33CC55", label: "Attended" },
};

// order the options appear in the dropdown
const statusOptions: MeetingStatus[] = [2, 1, 0];

async function updateAttendance(memberId: string, meeting: MemberMeeting, status: MeetingStatus) {
  // TODO: send to the backend when the API is available, e.g.
  // const res = await fetch(`/api/members/${memberId}/attendance`, { method: "PATCH", body: JSON.stringify({ meeting: meeting.name, date: meeting.date, status }) });
  // if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  console.log("update attendance", { memberId, meeting, status });
}

// shared by the header row and each member so the columns line up
const columnsClassName = "grid grid-cols-[2.5rem_1fr_repeat(3,3.75rem)] items-center gap-2 px-3 text-black sm:grid-cols-[3.5rem_1fr_repeat(3,7rem)] sm:gap-4 sm:px-5 [&>*]:min-w-0";

function count(meetings: MemberMeeting[], status: MeetingStatus) {
  return meetings.filter((m) => m.status === status).length;
}

function MeetingTile({ meeting, onChange }: { meeting: MemberMeeting; onChange: (status: MeetingStatus) => void }) {
  const { color, label } = statusInfo[meeting.status];
  return (
    <div
      className="flex shrink-0 flex-col items-center gap-1 rounded-xl bg-[#d4d4d4] px-2 py-2 text-[10px] leading-tight text-black sm:text-xs"
      title={`${meeting.name} (${meeting.date}): ${label}`}
    >
      {/* the dot shows the status; an invisible select laid over it opens the browser's dropdown to change it */}
      <div className="relative h-7 w-7 rounded-full ring-black ring-offset-2 ring-offset-[#d4d4d4] focus-within:ring-2 hover:ring-2" style={{ backgroundColor: color }}>
        <select
          value={meeting.status}
          onChange={(e) => onChange(Number(e.target.value) as MeetingStatus)}
          aria-label={`Status for ${meeting.name} (${meeting.date})`}
          className="absolute inset-0 cursor-pointer appearance-none rounded-full opacity-0"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {statusInfo[status].label}
            </option>
          ))}
        </select>
      </div>
      <div>{meeting.name}</div>
      <div>{meeting.date}</div>
    </div>
  );
}

function MemberRow({ member, expanded, onToggle, onStatusChange }: { member: Member; expanded: boolean; onToggle: () => void; onStatusChange: (meetingIndex: number, status: MeetingStatus) => void }) {
  return (
    <div className="shrink-0 overflow-hidden rounded-xl border-[3px] border-black bg-[#ededed]">
      <button type="button" onClick={onToggle} aria-expanded={expanded} className={`${columnsClassName} w-full cursor-pointer py-2 text-left hover:bg-[#e0e0e0]`}>
        <Image src={member.photo} alt="" width={48} height={48} className="h-9 w-9 rounded-lg border-2 border-black bg-white object-cover sm:h-12 sm:w-12" />
        <div className="flex flex-col">
          <span className="truncate text-xs sm:text-base">{member.name}</span>
          <span className="truncate text-[10px] text-gray-500 sm:text-xs">{member.email}</span>
        </div>
        <div className="text-center text-lg sm:text-2xl">{count(member.meetings, 0)}</div>
        <div className="text-center text-lg sm:text-2xl">{count(member.meetings, 1)}</div>
        <div className="text-center text-lg sm:text-2xl">{count(member.meetings, 2)}</div>
      </button>

      {/* the member's attendance for each meeting, scrolls sideways once there are more than fit */}
      {expanded && (
        <div className="border-t-2 border-dashed border-black p-3">
          <div className="flex w-full flex-row gap-3 overflow-x-auto rounded-[15px] border-[3px] border-black bg-[#f5f5f5] p-3 [scrollbar-width:thin]">
            {member.meetings.length === 0 ? (
              <p className="w-full py-2 text-center text-xs sm:text-sm">No meetings yet</p>
            ) : (
              member.meetings.map((meeting, i) => (
                <MeetingTile key={`${meeting.name}-${meeting.date}`} meeting={meeting} onChange={(status) => onStatusChange(i, status)} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserList({ members: initialMembers }: { members: Member[] }) {
  // kept in state so status edits show up straight away, including in the counts
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  // only one member can be open at a time
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [banner, setBanner] = useState<BannerState | null>(null);
  const hideBanner = useCallback(() => setBanner(null), []);

  function setStatus(memberId: string, meetingIndex: number, status: MeetingStatus) {
    setMembers((current) =>
      current.map((m) =>
        m.id === memberId ? { ...m, meetings: m.meetings.map((mt, i) => (i === meetingIndex ? { ...mt, status } : mt)) } : m,
      ),
    );
  }

  // updates the screen right away, then puts the old status back if saving fails
  async function handleStatusChange(member: Member, meetingIndex: number, status: MeetingStatus) {
    const meeting = member.meetings[meetingIndex];
    const previous = meeting.status;
    if (status === previous) return;
    setStatus(member.id, meetingIndex, status);
    try {
      await updateAttendance(member.id, meeting, status);
    } catch {
      setStatus(member.id, meetingIndex, previous);
      setBanner((b) => ({ type: "error", message: "Update failed, please try again", id: (b?.id ?? 0) + 1 }));
    }
  }

  const query = search.trim().toLowerCase();
  const matches = members.filter((m) => m.name.toLowerCase().includes(query) || m.email.toLowerCase().includes(query));

  return (
    <>
      <StatusBanner banner={banner} onDone={hideBanner} />
      <main className="flex flex-1 items-center justify-center px-4 py-4 font-mono">
        <div className="flex max-h-[min(800px,85vh)] w-full max-w-[1200px] flex-col items-center gap-4 px-3 py-4 sm:px-6" style={{ backgroundColor: '#CCCCCC', borderWidth: '10px', borderColor: '#000000', borderRadius: '20px'}}>
          <h1 className="text-center text-3xl font-bold sm:text-4xl text-black">User Lookup</h1>

          <div className="flex min-h-0 w-full flex-1 flex-col gap-3 rounded-[20px] border-[5px] border-black bg-[#dddddd] p-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter name here:"
              aria-label="Search members by name or email"
              className="mx-auto w-full max-w-[600px] shrink-0 rounded-xl border-[3px] border-black bg-white px-3 py-2 text-center text-sm text-black placeholder:text-gray-400 sm:text-base"
            />

            {/* header row, stays in place while the members scroll */}
            <div className={`${columnsClassName} shrink-0 rounded-xl border-2 border-black bg-[#ededed] py-1 whitespace-nowrap text-[clamp(0.5rem,2.2vw,0.875rem)]`}>
              <div>Photo:</div>
              <div>Name:</div>
              <div className="text-center">Unexcused:</div>
              <div className="text-center">Excused:</div>
              <div className="text-center">Attended:</div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
              {matches.length === 0 ? (
                <p className="py-8 text-center text-black">No members match &quot;{search.trim()}&quot;</p>
              ) : (
                matches.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    expanded={expandedId === member.id}
                    onToggle={() => setExpandedId(expandedId === member.id ? null : member.id)}
                    onStatusChange={(i, status) => handleStatusChange(member, i, status)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
