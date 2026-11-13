import MeetingList, { type Tile } from "./meeting_list";

// placeholder data, replace with backend API call when available
const TempTiles: Tile[] = [
  { name: "GBM 101", location: "Room 101", date: "2024-06-01", time: "10:00 AM", id: "1" },
  { name: "GBM 102", location: "Room 102", date: "2024-06-02", time: "11:00 AM", id: "2" },
  { name: "GBM 103", location: "Room 103", date: "2024-06-03", time: "12:00 PM", id: "3" },
  { name: "GBM 104", location: "Room 104", date: "2024-06-04", time: "01:00 PM", id: "4" },
  { name: "GBM 105", location: "Room 104", date: "2024-06-04", time: "02:00 PM", id: "5" },
  { name: "GBM 106", location: "Room 104", date: "2024-06-04", time: "03:00 PM", id: "6" },
];

export default function Attendance_Form() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-4 font-mono">
      {/* grows with the list up to the max height, then the list scrolls */}
      <div className="flex max-h-[min(800px,85vh)] w-full max-w-[1200px] flex-col items-center px-3 py-4 sm:px-6" style={{ backgroundColor: '#CCCCCC', borderWidth: '10px', borderColor: '#000000', borderRadius: '20px'}}>
        <h1 className="mb-4 text-center text-3xl font-bold sm:text-4xl text-black">Select a Meeting</h1>
        <MeetingList tiles={TempTiles} />
      </div>
    </main>
  );
}
