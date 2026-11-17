"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import hamburgerMenu from "../../../images/hamburger_menu.png";

const menuItems = [
  { label: "Home", href: "/user/home" },
  { label: "Attendance Form", href: "/user/attendance_form" },
  { label: "Excuse Form", href: "/user/excuse_form" },
  { label: "History", href: "/user/history" },
];

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

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
        aria-controls="user-menu"
        onClick={() => setOpen(!open)}
        className="cursor-pointer"
      >
        <Image src={hamburgerMenu} alt="" width={56} height={56} />
      </button>

      {open && (
        <nav
          id="user-menu"
          className="absolute right-0 top-full z-20 mt-1 w-[min(320px,calc(100vw-32px))] rounded-[20px] border-[3px] border-black bg-[#ededed] px-6 py-4 font-mono text-black sm:right-2"
        >
          <h2 className="-mx-6 mb-3 border-b-2 border-dashed border-black px-6 pb-2 text-center text-xl font-bold">User Menu</h2>
          <ul className="flex flex-col gap-1">
            {menuItems.map((item) => (
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
