"use client";

import React, { useState } from "react";
import { Menu, Bell, User, ChevronDown, Zap, LogOut, Settings, ShieldCheck } from "lucide-react";
import { ActiveMenuType } from "@/types/activity";
import Swal from "sweetalert2";

interface HeaderProps {
  activeMenu: ActiveMenuType;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMenu,
  sidebarCollapsed,
  setSidebarCollapsed
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const getPageTitle = () => {
    switch (activeMenu) {
      case "data-kegiatan":
        return "Data Kegiatan & Diklat";
      case "tambah-kegiatan":
        return "Input Kegiatan Baru (NEWS)";
      case "master-program":
        return "Master Program & Singkatan";
      case "master-keyword":
        return "Master Keyword Non-Allowable Cost (NAC)";
      case "master-jenis-biaya":
        return "Master Jenis Biaya PLN";
      default:
        return "Data Kegiatan";
    }
  };

  const handleLogout = () => {
    setShowProfileDropdown(false);
    Swal.fire({
      icon: "success",
      title: "Logout Berhasil!",
      text: "Anda telah keluar dari sistem PT PLN (Persero).",
      confirmButtonColor: "#0072CE",
      timer: 2000,
    });
  };

  return (
    <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Header Left: Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/60 shadow-2xs shrink-0"
          title="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00A3E0] animate-pulse shrink-0"></span>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
              NEWS • NAC Early Warning System
            </span>
          </div>
          <h1 className="text-sm sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Header Right: Notification & Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 fill-[#FFC72C] text-[#FFC72C]" />
          <span>Server PLN Online</span>
        </div>

        {/* Bell Notification */}
        <button className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/60">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
        </button>

        {/* Profile Dropdown Container */}
        <div className="relative border-l border-slate-200 pl-4 sm:pl-6">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-100/80 transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0072CE] to-[#00A3E0] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#00A3E0]/30 group-hover:ring-[#0072CE]/50 transition-all">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-extrabold text-slate-900 leading-tight flex items-center gap-1">
                <span>Admin PLN</span>
              </div>
              <div className="text-[11px] font-medium text-slate-500">Divisi SDM & Diklat</div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${showProfileDropdown ? "rotate-180 text-[#0072CE]" : ""}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200/90 rounded-2xl shadow-2xl z-50 p-2 border-t-4 border-t-[#0072CE] animate-in fade-in zoom-in-95">
              {/* Header Info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0072CE] text-white flex items-center justify-center font-bold text-xs">
                    AP
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Admin PLN</div>
                    <div className="text-[10px] text-slate-500">admin.diklat@pln.co.id</div>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 w-fit">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Administrator SDM</span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    Swal.fire({
                      icon: "info",
                      title: "Pengaturan Profil",
                      text: "Halaman pengaturan profil administrator PT PLN.",
                      confirmButtonColor: "#0072CE",
                    });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold transition-all"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Pengaturan Profil</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                {/* Logout Action */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-all"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Keluar / Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
