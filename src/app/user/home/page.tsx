import Link from "next/link";

type Tile = {
  title: string;
  href?: string;
};

const tiles: Tile[] = [
  { title: "Attendance Form", href: "/user/attendance_form" },
  { title: "Absence Request", href: "/user/excuse_form" },
  { title: "History", href: "/user/history" },
  { title: "TBD", href: "/user/home" }, /*replace href with actual link when available*/
];

function TileContent({ title }: { title: string }) {
  return (
    <>
      <div className="border-b-2 border-black bg-[#ededed] py-2 text-center text-2xl text-black sm:text-3xl">
        {title}:
      </div>
      <div className="flex flex-1 items-center justify-center bg-[#cccccc] text-2xl text-white sm:text-3xl">
        Add image here:
      </div>
    </>
  );
}

export default function Home() {
  const tileClassName =
    "flex min-h-56 flex-col border-2 border-black font-mono sm:min-h-64";

  return (
    <main className="grid flex-1 grid-cols-1 gap-6 px-4 py-4 sm:px-12 md:grid-cols-2 md:gap-x-20">
      {tiles.map((tile) =>
        tile.href ? (
          <Link
            key={tile.title}
            href={tile.href}
            className={`${tileClassName} transition hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black`}
          >
            <TileContent title={tile.title} />
          </Link>
        ) : (
          <div key={tile.title} className={tileClassName} aria-disabled>
            <TileContent title={tile.title} />
          </div>
        ),
      )}
    </main>
  );
}
