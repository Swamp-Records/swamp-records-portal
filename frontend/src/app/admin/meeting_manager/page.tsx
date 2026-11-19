import MeetingManager, { type Meeting } from "./meeting_manager";

// placeholder data, replace with backend API call when available
const TempMeetings: Meeting[] = [
  { id: "1", name: "GBM 1", location: "Reitz 3315", pin: "3022" },
  { id: "2", name: "Exec Meeting", location: "Reitz 3315", pin: "5173" },
];

export default function MeetingManagerPage() {
  return <MeetingManager initialMeetings={TempMeetings} />;
}
