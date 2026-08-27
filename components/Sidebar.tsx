"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FolderKanban,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  ListFilter,
  Zap,
  Database,
  BookOpen,
  KeyRound,
  DollarSign,
  HelpCircle,
  UserCheck,
  FileEdit,
  RefreshCw,
  History
} from "lucide-react";
import { ActiveMenuType, UserRole } from "@/types/activity";

interface SidebarProps {
  activeMenu: ActiveMenuType;
  setActiveMenu: (menu: ActiveMenuType) => void;
  isKegiatanOpen: boolean;
  setIsKegiatanOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  setActiveMenu,
  isKegiatanOpen,
  setIsKegiatanOpen,
  sidebarCollapsed,
  userRole,
  setUserRole
}) => {
  const [isMasterOpen, setIsMasterOpen] = useState(true);

  const handleMenuClick = (menu: ActiveMenuType) => {
    setActiveMenu(menu);
  };

  const isMasterActive =
    activeMenu === "master-program" ||
    activeMenu === "master-keyword" ||
    activeMenu === "master-jenis-biaya" ||
    activeMenu === "master-grey-area";

  return (
    <aside
      className={`${sidebarCollapsed ? "w-0 md:w-20 border-r-0 md:border-r overflow-hidden" : "w-64"
        } bg-white border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 relative z-20 shrink-0 h-screen sticky top-0 shadow-xs overflow-hidden`}
    >
      {/* Top Header & Scrollable Nav */}
      <div className="flex flex-col min-h-0 flex-1">
        {/* Logo Header */}
        <div className="h-20 flex items-center px-4 border-b border-slate-100/80 shrink-0">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 w-full">
              {/* PLN Logo badge */}
              <div className="relative p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0">
                <Image
                  src="/Logo_PLN.png"
                  alt="PLN Logo"
                  width={38}
                  height={38}
                  className="h-8 w-auto object-contain mix-blend-multiply"
                  priority
                />
              </div>

              {/* Brand Title & System Expansion */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-wider text-slate-900 leading-none">
                    <span className="text-[#0072CE]">N</span>
                    <span className="text-[#00A3E0]">E</span>
                    <span className="text-[#FFC72C]">W</span>
                    <span className="text-[#0072CE]">S</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#0072CE]/10 text-[#0072CE] text-[9px] font-black uppercase tracking-wider border border-[#0072CE]/20">
                    PLN
                  </span>
                </div>
                <div
                  className="text-[10px] font-bold text-slate-500 tracking-tight leading-tight mt-1"
                  title="NAC Early Warning System"
                >
                  NAC Early Warning System
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center">
              <div className="relative p-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center">
                <Image
                  src="/Logo_PLN.png"
                  alt="PLN Logo"
                  width={30}
                  height={30}
                  className="h-7 w-auto object-contain mix-blend-multiply"
                  priority
                />
              </div>
              <span className="text-[10px] font-black text-[#0072CE] mt-1 tracking-wider">NEWS</span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2 text-sm overflow-y-auto flex-1">
          {/* User Role Mode vs Admin Role Mode Navigation */}

          {userRole === "user" ? (
            /* USER BIASA NAVIGATION MENU */
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 pt-1 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Portal Pegawai
                </div>
              )}

              <button
                onClick={() => handleMenuClick("user-form")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeMenu === "user-form"
                    ? "bg-gradient-to-r from-[#0072CE] to-[#00A3E0] text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <FileEdit className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Form Input Kegiatan</span>}
              </button>

              <button
                onClick={() => handleMenuClick("riwayat-user")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeMenu === "riwayat-user"
                    ? "bg-gradient-to-r from-[#0072CE] to-[#00A3E0] text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <History className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Riwayat Input Kegiatan</span>}
              </button>
            </div>
          ) : (

            /* ADMIN NAVIGATION MENU */
            <>
              {!sidebarCollapsed && (
                <div className="px-3 pt-1 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Menu Utama Admin
                </div>
              )}

              {/* Kegiatan Parent Menu */}
              <div>
                <button
                  onClick={() => setIsKegiatanOpen(!isKegiatanOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${
                    activeMenu === "data-kegiatan" || activeMenu === "tambah-kegiatan" || activeMenu === "user-form"
                      ? "text-[#0072CE] font-semibold"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderKanban
                      className={`w-5 h-5 shrink-0 ${
                        activeMenu === "data-kegiatan" || activeMenu === "tambah-kegiatan"
                          ? "text-[#0072CE]"
                          : "text-slate-500"
                      }`}
                    />
                    {!sidebarCollapsed && <span>Kegiatan & Diklat</span>}
                  </div>
                  {!sidebarCollapsed &&
                    (isKegiatanOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ))}
                </button>

                {/* Sub-items */}
                {isKegiatanOpen && !sidebarCollapsed && (
                  <div className="ml-5 pl-3 border-l-2 border-slate-100 my-1 space-y-1">
                    <button
                      onClick={() => handleMenuClick("data-kegiatan")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeMenu === "data-kegiatan"
                          ? "bg-[#0072CE] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <ListFilter className="w-3.5 h-3.5" />
                      <span>Data Kegiatan</span>
                    </button>

                    <button
                      onClick={() => handleMenuClick("tambah-kegiatan")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        activeMenu === "tambah-kegiatan"
                          ? "bg-[#FFC72C] text-slate-950 font-bold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Tambah Kegiatan</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Master Data Parent Menu */}
              <div>
                <button
                  onClick={() => setIsMasterOpen(!isMasterOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${
                    isMasterActive ? "text-[#0072CE] font-bold" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Database
                      className={`w-5 h-5 shrink-0 ${isMasterActive ? "text-[#0072CE]" : "text-slate-500"}`}
                    />
                    {!sidebarCollapsed && <span>Master Data</span>}
                  </div>
                  {!sidebarCollapsed &&
                    (isMasterOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ))}
                </button>

                {/* Sub-items */}
                {isMasterOpen && !sidebarCollapsed && (
                  <div className="ml-5 pl-3 border-l-2 border-slate-100 my-1 space-y-1">
                    <button
                      onClick={() => handleMenuClick("master-program")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeMenu === "master-program"
                          ? "bg-[#0072CE] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Master Program</span>
                    </button>

                    <button
                      onClick={() => handleMenuClick("master-keyword")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeMenu === "master-keyword"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Master Keyword</span>
                    </button>

                    <button
                      onClick={() => handleMenuClick("master-jenis-biaya")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeMenu === "master-jenis-biaya"
                          ? "bg-[#FFC72C] text-slate-950 font-bold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Master Jenis Biaya</span>
                    </button>

                    <button
                      onClick={() => handleMenuClick("master-grey-area")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeMenu === "master-grey-area"
                          ? "bg-amber-500 text-white shadow-xs font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>Master Grey Area</span>
                    </button>
                  </div>

                )}
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Pinned Bottom Footer Branding & Graphic */}
      <div className="relative overflow-hidden pt-3 pb-5 px-4 border-t border-slate-100/90 shrink-0 bg-slate-50/70 z-10">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold relative z-10">
            <Zap className="w-4 h-4 fill-[#00A3E0] text-[#00A3E0]" />
            <span className="text-[11px] text-slate-500">&copy; 2026 PT PLN (Persero) UPDL Surabaya</span>
          </div>
        ) : (
          <div className="flex justify-center text-slate-400">
            <Zap className="w-4 h-4 text-[#00A3E0]" />
          </div>
        )}

        {/* Decorative PLN Cyan/Blue Angular Graphics at Bottom Left */}
        {!sidebarCollapsed && (
          <div className="absolute -bottom-6 -left-6 w-44 h-24 pointer-events-none z-0 opacity-40">
            <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120 L120 0 L150 0 L30 120 Z" fill="#00A3E0" />
              <path d="M40 120 L160 0 L190 0 L70 120 Z" fill="#0072CE" />
              <path d="M80 120 L200 0 L230 0 L110 120 Z" fill="#FFC72C" opacity="0.8" />
            </svg>
          </div>
        )}
      </div>
    </aside>
  );
};
