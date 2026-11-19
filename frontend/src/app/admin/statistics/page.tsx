import AttendanceChart, { type MeetingStats } from "./chart";

// placeholder data, replace with backend API call when available
const demoData: MeetingStats[] = [
  {meeting: {name: "Gbm 1", date: "11-1-2026"}, attended: 76, excused: 16, unexcused: 8},
  {meeting: {name: "Gbm 2", date: "11-2-2026"}, attended: 84, excused: 11, unexcused: 5},
  {meeting: {name: "Gbm 3", date: "11-3-2026"}, attended: 72, excused: 19, unexcused: 9},
  {meeting: {name: "Gbm 4", date: "11-4-2026"}, attended: 86, excused: 10, unexcused: 4},
  {meeting: {name: "Gbm 5", date: "11-5-2026"}, attended: 75, excused: 15, unexcused: 10},
  {meeting: {name: "Gbm 6", date: "11-6-2026"}, attended: 89, excused: 8, unexcused: 3},
];

export default function Statistics() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-4 font-mono">
      <div className="flex max-h-[min(800px,85vh)] w-full max-w-[1200px] flex-col items-center gap-4 px-3 py-4 sm:px-6" style={{ backgroundColor: '#CCCCCC', borderWidth: '10px', borderColor: '#000000', borderRadius: '20px' }}>
        <h1 className="text-center text-3xl font-bold sm:text-4xl text-black">Attendance Statistics</h1>

        {/* the chart fills this box, so its height sets the chart's height */}
        <div className="h-[min(500px,60vh)] min-h-72 p-2 sm:p-4" style={{backgroundColor: '#EDEDED', width: '95%', borderWidth: '5px', borderRadius: '20px', borderColor: '#000000'}}>
          <AttendanceChart data={demoData} />
        </div>
      </div>
    </main>
  );
}
