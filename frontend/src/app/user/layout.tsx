import Image from "next/image";
import Link from "next/link";
import logo from "../../../images/black_swamp_records_logo.png";
import UserMenu from "./user_menu";

export default function UserLayout({ children }: LayoutProps<"/user">) {
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
        <UserMenu />
      </header>

      {children}
    </div>
  );
}
