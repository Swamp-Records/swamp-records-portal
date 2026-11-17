import MeetingList, { type Tile } from "./meeting_list";

// placeholder data, replace with backend API call when available
const TempTiles: Tile[] = [
  { name: "GBM 101", location: "Room 101", date: "2024-06-01", time: "10:00 AM", id: "1" },
  { name: "Exec Meeting", location: "Room 102", date: "2024-06-02", time: "9:00 AM", id: "2" },
];

export default function Attendance_Form() {
  return <MeetingList tiles={TempTiles} />;
}
