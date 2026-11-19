"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import hamburgerMenu from "../../images/hamburger_menu.png";

type MenuMode = "user" | "admin";

const menuItems: Record<MenuMode, { label: string; href: string }[]> = {
  user: [
    { label: "Home", href: "/user/home" },
    { label: "Attendance Form", href: "/user/attendance_form" },
    { label: "Excuse Form", href: "/user/excuse_form" },
    { label: "History", href: "/user/history" },
  ],
  admin: [
    { label: "Home", href: "/admin/home" },
    { label: "Meeting Manager", href: "/admin/meeting_manager" },
    { label: "Attendance Stats", href: "/admin/statistics" },
    { label: "Excuse Approval", href: "/admin/excuse_approval" },
    { label: "User Lookup", href: "/admin/user_lookup" },
  ],
};

// shared by the user and admin layouts; the switch in the menu header flips between the two sets of links
export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // starts on whichever section the current page belongs to
  const [mode, setMode] = useState<MenuMode>(pathname.startsWith("/admin") ? "admin" : "user");
  const menuRef = useRef<HTMLDivElement>(null);
  const isAdmin = mode === "admin";

  // close the menu when clicking outside it or pressing Escape
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={menuRef}>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(!open)}
        className="cursor-pointer"
      >
        <Image src={hamburgerMenu} alt="" width={56} height={56} />
      </button>

      {open && (
        <nav
          id="site-menu"
          className="absolute right-0 top-full z-20 mt-1 w-[min(320px,calc(100vw-32px))] rounded-[20px] border-[3px] border-black bg-[#ededed] px-6 py-4 font-mono text-black sm:right-2"
        >
          <div className="relative -mx-6 mb-3 border-b-2 border-dashed border-black px-6 pb-2">
            <h2 className="text-center text-xl font-bold">{isAdmin ? "Admin Menu" : "User Menu"}</h2>
            {/* green = user links, blue = admin links */}
            <button
              type="button"
              role="switch"
              aria-checked={isAdmin}
              aria-label="Show admin links"
              title={isAdmin ? "Switch to user menu" : "Switch to admin menu"}
              onClick={() => setMode(isAdmin ? "user" : "admin")}
              className={`absolute right-4 top-1 h-6 w-12 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${isAdmin ? "bg-[#2f6db5]" : "bg-[#33CC55]"}`}
            />
          </div>
          <ul className="flex flex-col gap-1">
            {menuItems[mode].map((item) => (
              <li key={item.href}>
                {/* the gray box behind each item shows on hover (and keyboard focus) */}
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block rounded-lg px-3 py-2 text-center hover:bg-[#cccccc] focus-visible:bg-[#cccccc] focus-visible:outline-none aria-[current=page]:font-bold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
