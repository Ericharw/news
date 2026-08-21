"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700/50 transition-all duration-300 transform translate-y-0 opacity-100">
      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs font-medium text-slate-300">Notifikasi System</div>
        <div className="text-sm font-semibold text-white">{message}</div>
      </div>
    </div>
  );
};
