import userIcon from "../../../../images/user-icon.png";
import UserList, { type Member } from "./user_list";

// placeholder data, replace with backend API call when available (photos will come from the user's profile)
const demoMembers: Member[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@ufl.edu",
    photo: userIcon,
    meetings: [
      { name: "GBM 1", date: "11-1-2026", status: 0 },
      { name: "GBM 2", date: "11-2-2026", status: 1 },
      { name: "GBM 3", date: "11-3-2026", status: 2 },
      { name: "GBM 4", date: "11-4-2026", status: 1 },
      { name: "GBM 5", date: "11-5-2026", status: 0 },
      { name: "GBM 6", date: "11-6-2026", status: 2 },
      { name: "GBM 7", date: "11-7-2026", status: 1 },
    ],
  },
  {
    id: "2",
    name: "Emily Doe",
    email: "emily.doe@ufl.edu",
    photo: userIcon,
    meetings: [
      { name: "GBM 1", date: "11-1-2026", status: 2 },
      { name: "GBM 2", date: "11-2-2026", status: 1 },
      { name: "GBM 3", date: "11-3-2026", status: 2 },
      { name: "GBM 4", date: "11-4-2026", status: 0 },
      { name: "GBM 5", date: "11-5-2026", status: 2 },
      { name: "GBM 6", date: "11-6-2026", status: 1 },
      { name: "GBM 7", date: "11-7-2026", status: 2 },
    ],
  },
  {
    id: "3",
    name: "Michael Doe",
    email: "michael.doe@ufl.edu",
    photo: userIcon,
    meetings: [
      { name: "GBM 1", date: "11-1-2026", status: 1 },
      { name: "GBM 2", date: "11-2-2026", status: 2 },
      { name: "GBM 3", date: "11-3-2026", status: 1 },
      { name: "GBM 4", date: "11-4-2026", status: 2 },
      { name: "GBM 5", date: "11-5-2026", status: 1 },
      { name: "GBM 6", date: "11-6-2026", status: 2 },
      { name: "GBM 7", date: "11-7-2026", status: 2 },
    ],
  },
  {
    id: "4",
    name: "Sarah Doe",
    email: "sarah.doe@ufl.edu",
    photo: userIcon,
    meetings: [
      { name: "GBM 1", date: "11-1-2026", status: 0 },
      { name: "GBM 2", date: "11-2-2026", status: 2 },
      { name: "GBM 3", date: "11-3-2026", status: 0 },
      { name: "GBM 4", date: "11-4-2026", status: 2 },
      { name: "GBM 5", date: "11-5-2026", status: 0 },
      { name: "GBM 6", date: "11-6-2026", status: 1 },
      { name: "GBM 7", date: "11-7-2026", status: 2 },
    ],
  },
  {
    id: "5",
    name: "David Doe",
    email: "david.doe@ufl.edu",
    photo: userIcon,
    meetings: [
      { name: "GBM 1", date: "11-1-2026", status: 2 },
      { name: "GBM 2", date: "11-2-2026", status: 2 },
      { name: "GBM 3", date: "11-3-2026", status: 2 },
      { name: "GBM 4", date: "11-4-2026", status: 2 },
      { name: "GBM 5", date: "11-5-2026", status: 1 },
      { name: "GBM 6", date: "11-6-2026", status: 2 },
      { name: "GBM 7", date: "11-7-2026", status: 2 },
    ],
  },
];

export default function UserLookup() {
  return <UserList members={demoMembers} />;
}
