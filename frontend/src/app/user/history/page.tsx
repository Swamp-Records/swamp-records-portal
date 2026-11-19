// 0 = unexcused absence, 1 = excused absence, 2 = attended
type MeetingStatus = 0 | 1 | 2;

type Meeting = {
  name: string;
  date: string;
  status: MeetingStatus;
};

// placeholder until the backend can provide the user's attendance records
const demoMeetings: Meeting[] = [
  { name: "GBM 1", date: "11-1-2026", status: 0 },
  { name: "GBM 2", date: "11-2-2026", status: 1 },
  { name: "GBM 3", date: "11-3-2026", status: 2 },
  { name: "GBM 4", date: "11-4-2026", status: 2 },
  { name: "GBM 5", date: "11-5-2026", status: 2 },
  { name: "GBM 6", date: "11-6-2026", status: 2 },
  { name: "GBM 7", date: "11-7-2026", status: 2 },
];

const statusInfo: Record<MeetingStatus, { color: string; label: string }> = {
  0: { color: "#FF4444", label: "Unexcused absence" },
  1: { color: "#FFC400", label: "Excused absence" },
  2: { color: "#33CC55", label: "Attended" },
};

function StatBox({ title, count }: { title: string; count: number }) {
  return (
    <div
      className="flex w-28 flex-col items-center justify-between px-2 py-2 text-black sm:w-44 md:w-52"
      style={{ aspectRatio: '1/1', backgroundColor: '#EDEDED', borderWidth: '5px', borderColor: '#000000', borderRadius: '20px'}}
    >
      <h2 className="text-center text-xs sm:text-base">{title}</h2>
      <div className="flex flex-1 items-center text-5xl sm:text-6xl">{count}</div>
    </div>
  );
}

function MeetingTile({ meeting }: { meeting: Meeting }) {
  const { color, label } = statusInfo[meeting.status];
  return (
    <div
      className="flex shrink-0 flex-col items-center gap-1 rounded-xl bg-[#d4d4d4] px-2 py-2 text-[10px] leading-tight text-black sm:text-xs"
      title={`${meeting.name} (${meeting.date}): ${label}`}
    >
      <div className="h-7 w-7 rounded-full" style={{ backgroundColor: color }} aria-label={label} role="img" />
      <div>{meeting.name}</div>
      <div>{meeting.date}</div>
    </div>
  );
}

export default function History() {
  const meetings = demoMeetings;
  const count = (status: MeetingStatus) => meetings.filter((m) => m.status === status).length;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-4 font-mono">
      <div className="flex max-h-[min(800px,85vh)] w-full max-w-[1200px] flex-col items-center gap-6 px-3 py-4 sm:px-6" style={{ backgroundColor: '#CCCCCC', borderWidth: '10px', borderColor: '#000000', borderRadius: '20px'}}>
        <h1 className="text-center text-3xl font-bold sm:text-4xl text-black">User History</h1>

        {/* sized to the stat row, so the report panel's edges line up with the outer stat boxes */}
        <div className="flex w-fit max-w-full flex-col gap-6">
          <div className="flex flex-row justify-center gap-3 sm:gap-20">
            <StatBox title="Excused Absences" count={count(1)} />
            <StatBox title="Unexcused Absences" count={count(0)} />
            <StatBox title="Attended Meetings" count={count(2)} />
          </div>

          {/* w-0 + min-w-full: fills the row's width without letting the meeting list widen it */}
          <div className="flex w-0 min-w-full flex-col items-center gap-4 px-3 py-4 sm:px-5" style={{ backgroundColor: '#EDEDED', borderWidth: '5px', borderColor: '#000000', borderRadius: '20px'}}>
            <h2 className="text-center text-sm text-black sm:text-base">Attendance Report:</h2>
            {/* scrolls sideways once there are more meetings than fit */}
            <div className="flex w-full flex-row gap-3 overflow-x-auto rounded-[15px] border-[3px] border-black bg-[#f5f5f5] p-3 [scrollbar-width:thin]">
              {meetings.map((meeting) => (
                <MeetingTile key={`${meeting.name}-${meeting.date}`} meeting={meeting} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
