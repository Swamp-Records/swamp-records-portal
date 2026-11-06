type Tile = {
  name: string;
  location: string;
  date: string;
  time: string;
  id: string;
};

// placeholder data, replace with backend API call when available
const TempTiles: Tile[] = [
  { name: "GBM 101", location: "Room 101", date: "2024-06-01", time: "10:00 AM", id: "1" },
  { name: "GBM 102", location: "Room 102", date: "2024-06-02", time: "11:00 AM", id: "2" },
  { name: "GBM 103", location: "Room 103", date: "2024-06-03", time: "12:00 PM", id: "3" },
  { name: "GBM 104", location: "Room 104", date: "2024-06-04", time: "01:00 PM", id: "4" },
  { name: "GBM 105", location: "Room 104", date: "2024-06-04", time: "01:00 PM", id: "5" },
  { name: "GBM 106", location: "Room 104", date: "2024-06-04", time: "01:00 PM", id: "6" },
];

function DisplayTileContent({ tile }: { tile: Tile }) {
  return (
    <div className="flex h-full items-center justify-between px-6 text-black">
      <div>{tile.name}</div>
      <div>{tile.location}</div>
      <div>{tile.date}</div>
      <div>{tile.time}</div>
      <div>{tile.id}</div>
    </div>
  );
}

function DisplayTile({ tile }: { tile: Tile }) {
  return (
    <div className="shrink-0" style={{ width: '800px', height: '100px', backgroundColor: '#EDEDED', borderWidth: '5px', borderColor: '#000000', borderRadius: '20px', marginBottom: '10px'}}>
      <DisplayTileContent tile={tile} />
    </div>
  );
}

export default function Attendance_Form() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-4">
      <div className="flex flex-col items-center overflow-y-auto py-4" style={{ width: '900px', height: '600px', backgroundColor: '#CCCCCC', borderWidth: '10px', borderColor: '#000000', borderRadius: '20px'}}>
        <div style={{ width: '90%', height: '50px', backgroundColor: '#EDEDED', borderWidth: '5px', borderColor: '#000000', borderRadius: '20px', marginBottom: '10px'}}>
          <div className="flex h-full items-center justify-between px-6 text-black">
            <div>Name:</div>
            <div>Location:</div>
            <div>Date:</div>
            <div>Time:</div>
            <div>ID:</div>
          </div>
        </div>
        {/* add imported tiles here */}
        {TempTiles.map((tile) => (
          <DisplayTile key={tile.id} tile={tile} />
        ))}
      </div>
    </main>
  );
}
