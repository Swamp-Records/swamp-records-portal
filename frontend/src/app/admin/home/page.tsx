import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import calendarIcon from "../../../../images/calendar-icon-white.png";
import chartIcon from "../../../../images/column-chart-icon.png";
import searchIcon from "../../../../images/search-icon.png";
import approveIcon from "../../../../images/application-approved-icon.png";
type Tile = {
  title: string;
  href?: string;
  img: StaticImageData;
};

const tiles: Tile[] = [
  { title: "Meeting Manager", href: "/admin/meeting_manager", img: calendarIcon },
  { title: "Attendance Statistics", href: "/admin/statistics", img: chartIcon },
  { title: "User Lookup", href: "/admin/user_lookup", img: searchIcon },
  { title: "Excuse Approval", href: "/admin/excuse_approval", img: approveIcon },
];

function TileContent({ title, img }: { title: string; img: StaticImageData }) {
  return (
    <>
      <div className="border-b-2 border-black bg-[#ededed] py-2 text-center text-2xl text-black sm:text-3xl">
        {title}:
      </div>
      <div className="flex flex-1 items-center justify-center bg-[#cccccc] py-6">
        <Image src={img} alt="" width={200} height={200} className="brightness-0" />
      </div>
    </>
  );
}

export default function Home() {
  // in the two-column layout, a lone tile on the last row spans both columns and is centered at the
  // normal tile width (half the row minus half the 5rem column gap)
  const tileClassName =
    "flex min-h-56 flex-col border-[5px] border-black font-mono sm:min-h-64 md:last:odd:col-span-2 md:last:odd:w-[calc(50%-2.5rem)] md:last:odd:justify-self-center";

  return (
    <main className="grid flex-1 grid-cols-1 gap-6 px-4 py-4 sm:px-12 md:grid-cols-2 md:gap-x-20">
      {tiles.map((tile) =>
        tile.href ? (
          <Link
            key={tile.title}
            href={tile.href}
            className={`${tileClassName} transition hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black`}
          >
            <TileContent title={tile.title} img={tile.img} />
          </Link>
        ) : (
          <div key={tile.title} className={tileClassName} aria-disabled>
            <TileContent title={tile.title} img={tile.img} />
          </div>
        ),
      )}
    </main>
  );
}
