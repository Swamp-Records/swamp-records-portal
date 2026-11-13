"use client";

import { useEffect } from "react";

export type BannerState = {
  type: "success" | "error";
  message: string;
  id: number;
}

export default function StatusBanner({ banner, onDone }: { banner: BannerState | null; onDone: () => void }) {
  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [banner, onDone]);

  return (
    <div className="relative z-10 h-0">
      {banner && (
        <div
          role={banner.type === "error" ? "alert" : "status"}
          className={`absolute inset-x-0 top-0 border-b-2 border-black py-3 text-center font-mono text-lg text-white ${
            banner.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {banner.message}
        </div>
      )}
    </div>
  );
}
