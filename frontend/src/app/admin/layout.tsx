import Image from "next/image";
import Link from "next/link";
import logo from "../../../images/black_swamp_records_logo.png";
import UserMenu from "../user_menu";

export default function UserLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="relative flex items-center justify-between border-2 border-black bg-[#ededed] px-4 py-2">
        <Link href="/">
          <Image
            src={logo}
            alt="Swamp Records logo"
            width={82}
            height={82}
            preload
          />
        </Link>
        {/* centered on the header regardless of the logo and menu widths */}
        <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-black px-3 py-1 font-mono text-xl text-white sm:px-6 sm:text-4xl md:text-5xl">
          Admin Interface
        </div>
        <UserMenu />
      </header>

      {children}
    </div>
  );
}
