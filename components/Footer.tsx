"use client";

import React from "react";
import { Zap } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200/80 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shadow-2xs">
      <div> &copy;2026 PT PLN (Persero) UPDL Surabaya</div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-[#0072CE] font-bold">
        <Zap className="w-4 h-4 fill-[#00A3E0] text-[#00A3E0]" />
        <span>Listrik untuk Kehidupan yang Lebih Baik</span>
      </div>
    </footer>
  );
};
