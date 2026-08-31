"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FolderKanban,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  Search,
  RefreshCw,
  PlusCircle,
  ListFilter,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
  BarChart2,
  LineChart as LineChartIcon,
  Calendar,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Info
} from "lucide-react";
import { ActivityItem, MasterProgramItem } from "@/types/activity";
import { PROGRAM_OPTIONS } from "@/data/programOptions";

interface DashboardViewProps {
  onNavigate?: (menu: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [masterPrograms, setMasterPrograms] = useState<MasterProgramItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [searchProgramQuery, setSearchProgramQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"ALL" | "RED" | "GREEN" | "GREY">("ALL");
  const [chartViewMode, setChartViewMode] = useState<"BAR" | "LINE" | "CARDS">("BAR");
  const [sortBy, setSortBy] = useState<"TOTAL_DESC" | "RED_DESC" | "NAME_ASC">("TOTAL_DESC");
  const [hoveredProgramIndex, setHoveredProgramIndex] = useState<number | null>(null);

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path.startsWith("/") ? path : `/${path}`;
    }
  };

  const fetchData = async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    setIsSyncing(true);
    try {
      const [actRes, progRes] = await Promise.all([
        fetch("/api/activities", { cache: "no-store" }),
        fetch("/api/master/programs", { cache: "no-store" }),
      ]);

      const actJson = await actRes.json();
      if (actJson.success && Array.isArray(actJson.data)) {
        setActivities(actJson.data);
      }

      const progJson = await progRes.json();
      if (progJson.success && Array.isArray(progJson.data)) {
        setMasterPrograms(progJson.data);
      }
      setLastSyncTime(new Date());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      if (isInitial) setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData(true);

    // Otomatis terbarui secara berkala (polling real-time setiap 3.5 detik)
    const interval = setInterval(() => {
      fetchData(false);
    }, 3500);

    const handleAutoSync = () => {
      fetchData(false);
    };

    // Listener ketika tab kembali aktif / event update data terpicu
    window.addEventListener("focus", handleAutoSync);
    window.addEventListener("visibilitychange", handleAutoSync);
    window.addEventListener("activityUpdated", handleAutoSync);
    window.addEventListener("storage", handleAutoSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleAutoSync);
      window.removeEventListener("visibilitychange", handleAutoSync);
      window.removeEventListener("activityUpdated", handleAutoSync);
      window.removeEventListener("storage", handleAutoSync);
    };
  }, []);

  // Compute status for an activity
  const getItemStatus = (item: ActivityItem): "MERAH" | "ABU" | "HIJAU" => {
    let redNoteText = "";
    let greyNoteText = "";

    if (item.catatanNac) {
      if (item.catatanNac.includes("|")) {
        const parts = item.catatanNac.split("|");
        redNoteText = parts[0].replace(/^\[Merah\]\s*/i, "").trim();
        greyNoteText = parts[1].replace(/^\[Grey Area\]\s*/i, "").trim();
      } else {
        const lower = item.catatanNac.toLowerCase();
        if (lower.includes("grey")) greyNoteText = item.catatanNac;
        else if (lower.includes("merah")) redNoteText = item.catatanNac;
      }
    }

    if (item.statusNac === "TERDETEKSI_NAC" || Boolean(redNoteText)) {
      return "MERAH";
    }
    if (item.statusNac === "GREY_AREA" || Boolean(greyNoteText)) {
      return "ABU";
    }
    return "HIJAU";
  };

  // Overall Statistics
  const stats = useMemo(() => {
    let totalKegiatan = activities.length;
    let totalMerah = 0;
    let totalHijau = 0;
    let totalAbu = 0;

    activities.forEach((item) => {
      const status = getItemStatus(item);
      if (status === "MERAH") totalMerah++;
      else if (status === "ABU") totalAbu++;
      else totalHijau++;
    });

    // Unique Program names yang benar-benar ada di data kegiatan
    const programNamesSet = new Set<string>();
    activities.forEach((a) => {
      if (a.namaProgram) {
        const clean = a.namaProgram.split("(")[0].trim();
        if (clean) programNamesSet.add(clean);
      }
    });

    const percentHijau = totalKegiatan > 0 ? Math.round((totalHijau / totalKegiatan) * 100) : 0;
    const percentMerah = totalKegiatan > 0 ? Math.round((totalMerah / totalKegiatan) * 100) : 0;
    const percentAbu = totalKegiatan > 0 ? Math.round((totalAbu / totalKegiatan) * 100) : 0;

    return {
      totalKegiatan,
      totalProgram: programNamesSet.size,
      totalMerah,
      totalHijau,
      totalAbu,
      percentHijau,
      percentMerah,
      percentAbu,
    };
  }, [activities]);

  // Statistics grouped strictly by programs that have actual data in activities
  const programBreakdown = useMemo(() => {
    const map = new Map<
      string,
      {
        namaProgram: string;
        code: string;
        total: number;
        merah: number;
        hijau: number;
        abu: number;
      }
    >();

    // Helper map untuk mencari kode program resmi jika tersedia
    const codeLookup = new Map<string, string>();
    PROGRAM_OPTIONS.forEach((p) => {
      const clean = p.label.split("(")[0].trim().toLowerCase();
      codeLookup.set(clean, p.code);
    });
    masterPrograms.forEach((p) => {
      if (p.label && p.code) {
        const clean = p.label.split("(")[0].trim().toLowerCase();
        codeLookup.set(clean, p.code);
      }
    });

    // Hanya kelompokkan kegiatan yang memang ada datanya di activities
    activities.forEach((item) => {
      if (!item.namaProgram) return;
      const cleanName = item.namaProgram.split("(")[0].trim();
      if (!cleanName) return;

      const status = getItemStatus(item);

      if (!map.has(cleanName)) {
        const cleanLower = cleanName.toLowerCase();
        const code =
          codeLookup.get(cleanLower) ||
          (item.namaProgram.match(/\(([A-Z0-9_-]+)\)/)?.[1] ?? "PROG");

        map.set(cleanName, {
          namaProgram: cleanName,
          code,
          total: 0,
          merah: 0,
          hijau: 0,
          abu: 0,
        });
      }

      const progStat = map.get(cleanName)!;
      progStat.total += 1;
      if (status === "MERAH") progStat.merah += 1;
      else if (status === "ABU") progStat.abu += 1;
      else progStat.hijau += 1;
    });

    // Hanya ambil nama program yang memiliki data kegiatan (> 0)
    let result = Array.from(map.values()).filter((p) => p.total > 0);

    // Pengurutan (Sorting)
    if (sortBy === "RED_DESC") {
      result.sort((a, b) => b.merah - a.merah || b.total - a.total);
    } else if (sortBy === "NAME_ASC") {
      result.sort((a, b) => a.namaProgram.localeCompare(b.namaProgram));
    } else {
      result.sort((a, b) => b.total - a.total || a.namaProgram.localeCompare(b.namaProgram));
    }

    // Filter berdasarkan query pencarian
    if (searchProgramQuery.trim()) {
      const q = searchProgramQuery.toLowerCase();
      result = result.filter(
        (p) => p.namaProgram.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
      );
    }

    // Filter berdasarkan status
    if (selectedStatusFilter === "RED") {
      result = result.filter((p) => p.merah > 0);
    } else if (selectedStatusFilter === "GREY") {
      result = result.filter((p) => p.abu > 0);
    } else if (selectedStatusFilter === "GREEN") {
      result = result.filter((p) => p.hijau > 0 && p.merah === 0 && p.abu === 0);
    }

    return result;
  }, [activities, masterPrograms, searchProgramQuery, selectedStatusFilter, sortBy]);

  // Nilai maksimum untuk skala visual grafik batang komparatif
  const maxProgramTotal = useMemo(() => {
    if (programBreakdown.length === 0) return 1;
    return Math.max(...programBreakdown.map((p) => p.total), 1);
  }, [programBreakdown]);

  // Recent activities list
  const recentActivities = useMemo(() => {
    return activities.slice(0, 5);
  }, [activities]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#005bb5] via-[#0072CE] to-[#00A3E0] p-6 sm:p-8 text-white shadow-xl shadow-[#0072CE]/15">
        {/* Background decorative patterns */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-48 h-48 rounded-full bg-[#FFC72C]/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider uppercase text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Monitoring Real-time System</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Dashboard Statistik & Monitoring
            </h2>
            <p className="text-sm sm:text-base text-blue-50/90 leading-relaxed">
              Ringkasan data kegiatan, klasifikasi biaya, serta deteksi risiko <span className="font-bold text-amber-300">Non-Allowable Cost (NAC)</span> secara komprehensif.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => fetchData(true)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold backdrop-blur-md border border-white/20 transition-all shadow-xs cursor-pointer active:scale-95"
              title="Perbarui Data Sekarang"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading || isSyncing ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Memuat..." : "Refresh"}</span>
            </button>
            <button
              onClick={() => navigateTo("/tambah-kegiatan")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFC72C] hover:bg-[#ffbe1a] text-slate-950 text-xs sm:text-sm font-extrabold transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Kegiatan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Main Metric Cards Grid (Total Kegiatan, Nama Program, Merah, Hijau, Abu) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* 1. Total Kegiatan Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Total Kegiatan
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                {isLoading ? "..." : stats.totalKegiatan.toLocaleString()}
              </h3>
              <p className="text-[11px] font-medium text-slate-500 mt-1">
                Semua kegiatan terinput
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0072CE] to-[#00A3E0] text-white shadow-md shadow-[#0072CE]/20 group-hover:scale-110 transition-transform">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold">Status Data</span>
            <span className="font-bold text-[#0072CE] inline-flex items-center gap-1">
              Aktif Terverifikasi
            </span>
          </div>
        </div>

        {/* 2. Nama Program Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Nama Program
              </p>
              <h3 className="text-3xl font-black text-[#0072CE] mt-2 tracking-tight">
                {isLoading ? "..." : stats.totalProgram.toLocaleString()}
              </h3>
              <p className="text-[11px] font-medium text-slate-500 mt-1">
                Program aktif dalam data
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold">Master Program</span>
            <button
              onClick={() => navigateTo("/master-program")}
              className="font-bold text-[#0072CE] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
            >
              Lihat Master <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 3. Merah (Terdeteksi NAC) Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-rose-200/80 p-5 shadow-xs hover:shadow-md transition-all group bg-gradient-to-b from-rose-50/30 to-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700">
                  Merah (NAC)
                </p>
              </div>
              <h3 className="text-3xl font-black text-rose-600 mt-2 tracking-tight">
                {isLoading ? "..." : stats.totalMerah.toLocaleString()}
              </h3>
              <p className="text-[11px] font-medium text-rose-600/80 mt-1">
                Terdeteksi Non-Allowable
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-md shadow-rose-500/20 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
            <span className="text-rose-600/80 font-semibold">Rasio Risiko</span>
            <span className="font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px]">
              {stats.percentMerah}% dari Total
            </span>
          </div>
        </div>

        {/* 4. Hijau (Aman) Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-emerald-200/80 p-5 shadow-xs hover:shadow-md transition-all group bg-gradient-to-b from-emerald-50/30 to-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                  Hijau (Aman)
                </p>
              </div>
              <h3 className="text-3xl font-black text-emerald-600 mt-2 tracking-tight">
                {isLoading ? "..." : stats.totalHijau.toLocaleString()}
              </h3>
              <p className="text-[11px] font-medium text-emerald-600/80 mt-1">
                Sesuai pedoman biaya
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
            <span className="text-emerald-600/80 font-semibold">Tingkat Kepatuhan</span>
            <span className="font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px]">
              {stats.percentHijau}% Sesuai
            </span>
          </div>
        </div>

        {/* 5. Abu-Abu (Grey Area) Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-300/80 p-5 shadow-xs hover:shadow-md transition-all group bg-gradient-to-b from-slate-100/50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                  Abu (Grey Area)
                </p>
              </div>
              <h3 className="text-3xl font-black text-slate-700 mt-2 tracking-tight">
                {isLoading ? "..." : stats.totalAbu.toLocaleString()}
              </h3>
              <p className="text-[11px] font-medium text-slate-500 mt-1">
                Perlu konfirmasi khusus
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-md shadow-slate-500/20 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold">Perlu Review</span>
            <span className="font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]">
              {stats.percentAbu}% dari Total
            </span>
          </div>
        </div>
      </div>

      {/* Visual Proportion Bar */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#0072CE]" />
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-800">
              Distribusi Kepatuhan Biaya (NAC Early Warning)
            </h4>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500" />
              <span className="text-slate-600">Hijau (Aman): {stats.totalHijau}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-600" />
              <span className="text-slate-600">Merah (NAC): {stats.totalMerah}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-500" />
              <span className="text-slate-600">Abu (Grey Area): {stats.totalAbu}</span>
            </div>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex p-0.5 gap-0.5 shadow-inner">
          {stats.totalKegiatan === 0 ? (
            <div className="w-full h-full bg-slate-200 rounded-full" />
          ) : (
            <>
              {stats.percentHijau > 0 && (
                <div
                  style={{ width: `${stats.percentHijau}%` }}
                  className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                  title={`Hijau (Aman): ${stats.percentHijau}% (${stats.totalHijau} kegiatan)`}
                />
              )}
              {stats.percentMerah > 0 && (
                <div
                  style={{ width: `${stats.percentMerah}%` }}
                  className="h-full bg-rose-600 transition-all duration-500"
                  title={`Merah (Terdeteksi NAC): ${stats.percentMerah}% (${stats.totalMerah} kegiatan)`}
                />
              )}
              {stats.percentAbu > 0 && (
                <div
                  style={{ width: `${stats.percentAbu}%` }}
                  className="h-full bg-slate-500 rounded-r-full transition-all duration-500"
                  title={`Abu (Grey Area): ${stats.percentAbu}% (${stats.totalAbu} kegiatan)`}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Program Breakdown Chart Section */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Header Controls */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 rounded-xl bg-[#0072CE]/10 text-[#0072CE]">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Grafik Statistik per Nama Program
              </h3>
              {/* Real-time sync badge indicator */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Auto-Sync Aktif</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Visualisasi grafik komparasi kegiatan dan status biaya NAC (Hijau/Merah/Abu) khusus program yang telah memiliki data di sistem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Switcher: Grafik Batang / Grafik Garis (Line Chart) / Kartu */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setChartViewMode("BAR")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartViewMode === "BAR"
                    ? "bg-white text-[#0072CE] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Tampilan Grafik Batang (Bar Chart)"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Grafik Batang</span>
              </button>
              <button
                onClick={() => setChartViewMode("LINE")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartViewMode === "LINE"
                    ? "bg-white text-[#0072CE] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Tampilan Line Chart (Grafik Garis)"
              >
                <LineChartIcon className="w-3.5 h-3.5" />
                <span>Line Chart</span>
              </button>
              <button
                onClick={() => setChartViewMode("CARDS")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartViewMode === "CARDS"
                    ? "bg-white text-[#0072CE] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Tampilan Kartu Rincian Program"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Kartu</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0072CE]/30 focus:border-[#0072CE] transition-all cursor-pointer appearance-none"
              >
                <option value="TOTAL_DESC">Urutkan: Total Terbanyak</option>
                <option value="RED_DESC">Urutkan: Risiko Merah (NAC)</option>
                <option value="NAME_ASC">Urutkan: Nama Program (A-Z)</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[180px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari program aktif..."
                value={searchProgramQuery}
                onChange={(e) => setSearchProgramQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0072CE]/30 focus:border-[#0072CE] transition-all"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSelectedStatusFilter("ALL")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedStatusFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedStatusFilter("RED")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedStatusFilter === "RED"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-rose-600"
                }`}
              >
                Ada Merah
              </button>
              <button
                onClick={() => setSelectedStatusFilter("GREEN")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedStatusFilter === "GREEN"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-emerald-600"
                }`}
              >
                Hanya Hijau
              </button>
              <button
                onClick={() => setSelectedStatusFilter("GREY")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedStatusFilter === "GREY"
                    ? "bg-slate-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Ada Abu
              </button>
            </div>
          </div>
        </div>

        {/* Chart Visualizations Container */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Quick Summary Chips & Legend Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl">
              <p className="text-[11px] font-bold text-blue-800">Program Memiliki Data</p>
              <p className="text-lg font-black text-[#0072CE] mt-0.5">
                {programBreakdown.length} <span className="text-xs font-semibold text-blue-600">Program</span>
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <p className="text-[11px] font-bold text-slate-700">Total Kegiatan Ditampilkan</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">
                {programBreakdown.reduce((acc, curr) => acc + curr.total, 0)} <span className="text-xs font-semibold text-slate-500">Kegiatan</span>
              </p>
            </div>
            <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl">
              <p className="text-[11px] font-bold text-rose-800">Program Berisiko NAC</p>
              <p className="text-lg font-black text-rose-600 mt-0.5">
                {programBreakdown.filter((p) => p.merah > 0).length} <span className="text-xs font-semibold text-rose-600">Program</span>
              </p>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
              <p className="text-[11px] font-bold text-emerald-800">Program 100% Aman</p>
              <p className="text-lg font-black text-emerald-600 mt-0.5">
                {programBreakdown.filter((p) => p.hijau === p.total && p.total > 0).length} <span className="text-xs font-semibold text-emerald-600">Program</span>
              </p>
            </div>
          </div>

          {/* Interactive Chart Legend Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
            <div className="flex items-center gap-2 font-extrabold text-slate-700">
              <Layers className="w-4 h-4 text-[#0072CE]" />
              <span>Legenda Seri Grafik:</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#0072CE] shadow-xs" />
                <span className="text-slate-800">Total Kegiatan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500 shadow-xs" />
                <span className="text-slate-800">Hijau (Aman)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-rose-600 shadow-xs" />
                <span className="text-slate-800">Merah (NAC)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-slate-500 shadow-xs" />
                <span className="text-slate-800">Abu (Grey Area)</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-slate-400 font-semibold space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#0072CE]" />
              <p>Memuat grafik statistik program...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="py-16 text-center bg-slate-50/70 rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
              <div className="p-3 w-fit mx-auto rounded-2xl bg-[#0072CE]/10 text-[#0072CE]">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-base font-extrabold text-slate-800">Belum Ada Data Kegiatan</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Grafik statistik per nama program akan otomatis terisi dan tampil saat Anda menambahkan data kegiatan baru ke sistem.
                </p>
              </div>
              <button
                onClick={() => navigateTo("/tambah-kegiatan")}
                className="px-4 py-2.5 rounded-xl bg-[#0072CE] hover:bg-[#005bb5] text-white text-xs font-bold shadow-md shadow-[#0072CE]/20 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Input Kegiatan Sekarang</span>
              </button>
            </div>
          ) : programBreakdown.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-semibold bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <p>Tidak ada program dalam data yang sesuai dengan kriteria filter pencarian.</p>
              <button
                onClick={() => {
                  setSearchProgramQuery("");
                  setSelectedStatusFilter("ALL");
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : chartViewMode === "BAR" ? (
            /* ============================================================ */
            /* MODE 1: GRAFIK BATANG (VERTICAL GROUPED BAR CHART)           */
            /* ============================================================ */
            (() => {
              const svgWidth = Math.max(760, programBreakdown.length * 115);
              const svgHeight = 340;
              const padLeft = 45;
              const padRight = 25;
              const padTop = 35;
              const padBottom = 75;
              const plotWidth = svgWidth - padLeft - padRight;
              const plotHeight = svgHeight - padTop - padBottom;
              const rawMax = Math.max(...programBreakdown.map((p) => p.total), 1);
              const yAxisMax = Math.max(Math.ceil(rawMax / 4) * 4, 4);
              const yTicks = [0, yAxisMax * 0.25, yAxisMax * 0.5, yAxisMax * 0.75, yAxisMax];
              const colWidth = plotWidth / programBreakdown.length;
              const barWidth = Math.min(14, Math.max(8, colWidth / 5.2));
              const barGap = 3;

              return (
                <div className="space-y-4">
                  <div className="w-full overflow-x-auto bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-inner">
                    <svg
                      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                      className="w-full h-auto min-w-[700px] select-none"
                    >
                      {/* Grid Lines & Y-Axis Scale */}
                      {yTicks.map((tick) => {
                        const y = padTop + plotHeight - (tick / yAxisMax) * plotHeight;
                        return (
                          <g key={`ytick-${tick}`}>
                            <line
                              x1={padLeft}
                              y1={y}
                              x2={svgWidth - padRight}
                              y2={y}
                              stroke="#e2e8f0"
                              strokeDasharray={tick === 0 ? "none" : "4 4"}
                              strokeWidth={tick === 0 ? "1.5" : "1"}
                            />
                            <text
                              x={padLeft - 8}
                              y={y + 3.5}
                              textAnchor="end"
                              className="text-[10px] font-bold fill-slate-400"
                            >
                              {tick}
                            </text>
                          </g>
                        );
                      })}

                      {/* Render Bars for each active program */}
                      {programBreakdown.map((prog, idx) => {
                        const xCenter = padLeft + (idx + 0.5) * colWidth;
                        const isHovered = hoveredProgramIndex === idx;
                        const totalH = (prog.total / yAxisMax) * plotHeight;
                        const hijauH = (prog.hijau / yAxisMax) * plotHeight;
                        const merahH = (prog.merah / yAxisMax) * plotHeight;
                        const abuH = (prog.abu / yAxisMax) * plotHeight;

                        const totalBarsCount = 4;
                        const groupWidth = totalBarsCount * barWidth + (totalBarsCount - 1) * barGap;
                        const startX = xCenter - groupWidth / 2;

                        const xTotal = startX;
                        const xHijau = startX + barWidth + barGap;
                        const xMerah = startX + 2 * (barWidth + barGap);
                        const xAbu = startX + 3 * (barWidth + barGap);

                        return (
                          <g
                            key={prog.namaProgram}
                            onMouseEnter={() => setHoveredProgramIndex(idx)}
                            onMouseLeave={() => setHoveredProgramIndex(null)}
                            className="cursor-pointer transition-all duration-200"
                          >
                            {/* Column Hover Background Highlight */}
                            <rect
                              x={padLeft + idx * colWidth}
                              y={padTop}
                              width={colWidth}
                              height={plotHeight}
                              fill={isHovered ? "#0072CE" : "transparent"}
                              fillOpacity={isHovered ? 0.05 : 0}
                              rx="8"
                              className="transition-colors duration-200"
                            />

                            {/* Bar 1: Total Kegiatan (Blue) */}
                            {totalH > 0 && (
                              <g>
                                <rect
                                  x={xTotal}
                                  y={padTop + plotHeight - totalH}
                                  width={barWidth}
                                  height={totalH}
                                  fill={isHovered ? "#005bb5" : "#0072CE"}
                                  rx="3"
                                  className="transition-all duration-300"
                                />
                                <text
                                  x={xTotal + barWidth / 2}
                                  y={padTop + plotHeight - totalH - 5}
                                  textAnchor="middle"
                                  className="text-[9px] font-black fill-[#0072CE]"
                                >
                                  {prog.total}
                                </text>
                              </g>
                            )}

                            {/* Bar 2: Hijau / Aman (Emerald) */}
                            {hijauH > 0 && (
                              <g>
                                <rect
                                  x={xHijau}
                                  y={padTop + plotHeight - hijauH}
                                  width={barWidth}
                                  height={hijauH}
                                  fill="#10B981"
                                  rx="3"
                                  className="transition-all duration-300"
                                />
                                <text
                                  x={xHijau + barWidth / 2}
                                  y={padTop + plotHeight - hijauH - 5}
                                  textAnchor="middle"
                                  className="text-[9px] font-black fill-emerald-600"
                                >
                                  {prog.hijau}
                                </text>
                              </g>
                            )}

                            {/* Bar 3: Merah / NAC (Rose) */}
                            {merahH > 0 && (
                              <g>
                                <rect
                                  x={xMerah}
                                  y={padTop + plotHeight - merahH}
                                  width={barWidth}
                                  height={merahH}
                                  fill="#E11D48"
                                  rx="3"
                                  className="transition-all duration-300"
                                />
                                <text
                                  x={xMerah + barWidth / 2}
                                  y={padTop + plotHeight - merahH - 5}
                                  textAnchor="middle"
                                  className="text-[9px] font-black fill-rose-600"
                                >
                                  {prog.merah}
                                </text>
                              </g>
                            )}

                            {/* Bar 4: Abu / Grey (Slate) */}
                            {abuH > 0 && (
                              <g>
                                <rect
                                  x={xAbu}
                                  y={padTop + plotHeight - abuH}
                                  width={barWidth}
                                  height={abuH}
                                  fill="#64748B"
                                  rx="3"
                                  className="transition-all duration-300"
                                />
                                <text
                                  x={xAbu + barWidth / 2}
                                  y={padTop + plotHeight - abuH - 5}
                                  textAnchor="middle"
                                  className="text-[9px] font-black fill-slate-600"
                                >
                                  {prog.abu}
                                </text>
                              </g>
                            )}

                            {/* X-Axis Program Code & Short Name */}
                            <g transform={`translate(${xCenter}, ${padTop + plotHeight + 15})`}>
                              <rect
                                x="-18"
                                y="-2"
                                width="36"
                                height="16"
                                rx="4"
                                fill={isHovered ? "#0072CE" : "#f1f5f9"}
                              />
                              <text
                                x="0"
                                y="10"
                                textAnchor="middle"
                                className={`text-[9px] font-mono font-bold ${
                                  isHovered ? "fill-white" : "fill-slate-700"
                                }`}
                              >
                                {prog.code}
                              </text>
                              <text
                                x="0"
                                y="26"
                                textAnchor="middle"
                                className={`text-[10px] font-extrabold ${
                                  isHovered ? "fill-[#0072CE]" : "fill-slate-700"
                                }`}
                              >
                                {prog.namaProgram.length > 14
                                  ? `${prog.namaProgram.substring(0, 12)}...`
                                  : prog.namaProgram}
                              </text>
                              <text
                                x="0"
                                y="38"
                                textAnchor="middle"
                                className="text-[9px] font-semibold fill-slate-400"
                              >
                                {prog.total} Kegiatan
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Interactive Details Inspector on Hover */}
                  {hoveredProgramIndex !== null && programBreakdown[hoveredProgramIndex] && (
                    <div className="p-4 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-white rounded-2xl border border-[#0072CE]/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-[#0072CE] text-white font-black text-xs flex items-center justify-center shadow-sm">
                          {hoveredProgramIndex + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-slate-900">
                              {programBreakdown[hoveredProgramIndex].namaProgram}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono font-bold text-xs">
                              {programBreakdown[hoveredProgramIndex].code}
                            </span>
                            {programBreakdown[hoveredProgramIndex].merah > 0 ? (
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-black text-[10px] uppercase">
                                {programBreakdown[hoveredProgramIndex].merah} Terdeteksi NAC
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase">
                                100% Aman
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Total: <strong>{programBreakdown[hoveredProgramIndex].total}</strong> kegiatan •{" "}
                            <span className="text-emerald-700 font-bold">Hijau: {programBreakdown[hoveredProgramIndex].hijau}</span> •{" "}
                            <span className="text-rose-700 font-bold">Merah: {programBreakdown[hoveredProgramIndex].merah}</span> •{" "}
                            <span className="text-slate-700 font-bold">Abu: {programBreakdown[hoveredProgramIndex].abu}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigateTo("/data-kegiatan")}
                        className="px-3.5 py-2 rounded-xl bg-[#0072CE] hover:bg-[#005bb5] text-white text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        <span>Lihat Data Kegiatan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          ) : chartViewMode === "LINE" ? (
            /* ============================================================ */
            /* MODE 2: LINE CHART (GRAFIK GARIS INTERAKTIF)                 */
            /* ============================================================ */
            (() => {
              const svgWidth = Math.max(760, programBreakdown.length * 115);
              const svgHeight = 340;
              const padLeft = 45;
              const padRight = 25;
              const padTop = 35;
              const padBottom = 75;
              const plotWidth = svgWidth - padLeft - padRight;
              const plotHeight = svgHeight - padTop - padBottom;
              const rawMax = Math.max(...programBreakdown.map((p) => p.total), 1);
              const yAxisMax = Math.max(Math.ceil(rawMax / 4) * 4, 4);
              const yTicks = [0, yAxisMax * 0.25, yAxisMax * 0.5, yAxisMax * 0.75, yAxisMax];
              const colWidth = plotWidth / programBreakdown.length;

              const pointsTotal = programBreakdown.map((p, i) => ({
                x: padLeft + (i + 0.5) * colWidth,
                y: padTop + plotHeight - (p.total / yAxisMax) * plotHeight,
                val: p.total,
              }));

              const pointsHijau = programBreakdown.map((p, i) => ({
                x: padLeft + (i + 0.5) * colWidth,
                y: padTop + plotHeight - (p.hijau / yAxisMax) * plotHeight,
                val: p.hijau,
              }));

              const pointsMerah = programBreakdown.map((p, i) => ({
                x: padLeft + (i + 0.5) * colWidth,
                y: padTop + plotHeight - (p.merah / yAxisMax) * plotHeight,
                val: p.merah,
              }));

              const pointsAbu = programBreakdown.map((p, i) => ({
                x: padLeft + (i + 0.5) * colWidth,
                y: padTop + plotHeight - (p.abu / yAxisMax) * plotHeight,
                val: p.abu,
              }));

              const makePath = (pts: { x: number; y: number }[]) => {
                if (pts.length === 0) return "";
                return pts.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`, "");
              };

              const makeAreaPath = (pts: { x: number; y: number }[]) => {
                if (pts.length === 0) return "";
                const linePart = makePath(pts);
                const first = pts[0];
                const last = pts[pts.length - 1];
                const baseY = padTop + plotHeight;
                return `${linePart} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
              };

              return (
                <div className="space-y-4">
                  <div className="w-full overflow-x-auto bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-inner">
                    <svg
                      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                      className="w-full h-auto min-w-[700px] select-none"
                    >
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0072CE" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#0072CE" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines & Y-Axis Scale */}
                      {yTicks.map((tick) => {
                        const y = padTop + plotHeight - (tick / yAxisMax) * plotHeight;
                        return (
                          <g key={`ytick-line-${tick}`}>
                            <line
                              x1={padLeft}
                              y1={y}
                              x2={svgWidth - padRight}
                              y2={y}
                              stroke="#e2e8f0"
                              strokeDasharray={tick === 0 ? "none" : "4 4"}
                              strokeWidth={tick === 0 ? "1.5" : "1"}
                            />
                            <text
                              x={padLeft - 8}
                              y={y + 3.5}
                              textAnchor="end"
                              className="text-[10px] font-bold fill-slate-400"
                            >
                              {tick}
                            </text>
                          </g>
                        );
                      })}

                      {/* Area fill under Total Line */}
                      <path d={makeAreaPath(pointsTotal)} fill="url(#areaGradient)" />

                      {/* Series 1: Total Line */}
                      <path
                        d={makePath(pointsTotal)}
                        fill="none"
                        stroke="#0072CE"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Series 2: Hijau Line */}
                      <path
                        d={makePath(pointsHijau)}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Series 3: Merah Line */}
                      <path
                        d={makePath(pointsMerah)}
                        fill="none"
                        stroke="#E11D48"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Series 4: Abu Line */}
                      <path
                        d={makePath(pointsAbu)}
                        fill="none"
                        stroke="#64748B"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Vertical guidelines & Interactive hover points for each program */}
                      {programBreakdown.map((prog, idx) => {
                        const ptTotal = pointsTotal[idx];
                        const ptHijau = pointsHijau[idx];
                        const ptMerah = pointsMerah[idx];
                        const ptAbu = pointsAbu[idx];
                        const xCenter = ptTotal.x;
                        const isHovered = hoveredProgramIndex === idx;

                        return (
                          <g
                            key={`line-col-${prog.namaProgram}`}
                            onMouseEnter={() => setHoveredProgramIndex(idx)}
                            onMouseLeave={() => setHoveredProgramIndex(null)}
                            className="cursor-pointer"
                          >
                            {/* Column Hover Zone */}
                            <rect
                              x={padLeft + idx * colWidth}
                              y={padTop}
                              width={colWidth}
                              height={plotHeight}
                              fill={isHovered ? "#0072CE" : "transparent"}
                              fillOpacity={isHovered ? 0.05 : 0}
                              rx="8"
                              className="transition-colors duration-200"
                            />

                            {/* Vertical Line Cursor on Hover */}
                            {isHovered && (
                              <line
                                x1={xCenter}
                                y1={padTop}
                                x2={xCenter}
                                y2={padTop + plotHeight}
                                stroke="#0072CE"
                                strokeWidth="1.5"
                                strokeDasharray="3 3"
                              />
                            )}

                            {/* Node Total */}
                            <circle
                              cx={ptTotal.x}
                              cy={ptTotal.y}
                              r={isHovered ? "6.5" : "5"}
                              fill="#ffffff"
                              stroke="#0072CE"
                              strokeWidth={isHovered ? "3.5" : "2.5"}
                              className="transition-all duration-200"
                            />
                            <text
                              x={ptTotal.x}
                              y={ptTotal.y - 9}
                              textAnchor="middle"
                              className="text-[10px] font-black fill-[#0072CE]"
                            >
                              {prog.total}
                            </text>

                            {/* Node Hijau */}
                            {prog.hijau > 0 && (
                              <circle
                                cx={ptHijau.x}
                                cy={ptHijau.y}
                                r={isHovered ? "5" : "3.5"}
                                fill="#ffffff"
                                stroke="#10B981"
                                strokeWidth="2"
                              />
                            )}

                            {/* Node Merah */}
                            {prog.merah > 0 && (
                              <circle
                                cx={ptMerah.x}
                                cy={ptMerah.y}
                                r={isHovered ? "5" : "3.5"}
                                fill="#ffffff"
                                stroke="#E11D48"
                                strokeWidth="2"
                              />
                            )}

                            {/* Node Abu */}
                            {prog.abu > 0 && (
                              <circle
                                cx={ptAbu.x}
                                cy={ptAbu.y}
                                r={isHovered ? "4.5" : "3"}
                                fill="#ffffff"
                                stroke="#64748B"
                                strokeWidth="2"
                              />
                            )}

                            {/* X-Axis Program Code & Short Name */}
                            <g transform={`translate(${xCenter}, ${padTop + plotHeight + 15})`}>
                              <rect
                                x="-18"
                                y="-2"
                                width="36"
                                height="16"
                                rx="4"
                                fill={isHovered ? "#0072CE" : "#f1f5f9"}
                              />
                              <text
                                x="0"
                                y="10"
                                textAnchor="middle"
                                className={`text-[9px] font-mono font-bold ${
                                  isHovered ? "fill-white" : "fill-slate-700"
                                }`}
                              >
                                {prog.code}
                              </text>
                              <text
                                x="0"
                                y="26"
                                textAnchor="middle"
                                className={`text-[10px] font-extrabold ${
                                  isHovered ? "fill-[#0072CE]" : "fill-slate-700"
                                }`}
                              >
                                {prog.namaProgram.length > 14
                                  ? `${prog.namaProgram.substring(0, 12)}...`
                                  : prog.namaProgram}
                              </text>
                              <text
                                x="0"
                                y="38"
                                textAnchor="middle"
                                className="text-[9px] font-semibold fill-slate-400"
                              >
                                {prog.total} Kegiatan
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Interactive Details Inspector on Hover */}
                  {hoveredProgramIndex !== null && programBreakdown[hoveredProgramIndex] && (
                    <div className="p-4 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-white rounded-2xl border border-[#0072CE]/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-[#0072CE] text-white font-black text-xs flex items-center justify-center shadow-sm">
                          {hoveredProgramIndex + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-slate-900">
                              {programBreakdown[hoveredProgramIndex].namaProgram}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono font-bold text-xs">
                              {programBreakdown[hoveredProgramIndex].code}
                            </span>
                            {programBreakdown[hoveredProgramIndex].merah > 0 ? (
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-black text-[10px] uppercase">
                                {programBreakdown[hoveredProgramIndex].merah} Terdeteksi NAC
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase">
                                100% Aman
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Total: <strong>{programBreakdown[hoveredProgramIndex].total}</strong> kegiatan •{" "}
                            <span className="text-emerald-700 font-bold">Hijau: {programBreakdown[hoveredProgramIndex].hijau}</span> •{" "}
                            <span className="text-rose-700 font-bold">Merah: {programBreakdown[hoveredProgramIndex].merah}</span> •{" "}
                            <span className="text-slate-700 font-bold">Abu: {programBreakdown[hoveredProgramIndex].abu}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigateTo("/data-kegiatan")}
                        className="px-3.5 py-2 rounded-xl bg-[#0072CE] hover:bg-[#005bb5] text-white text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        <span>Lihat Data Kegiatan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            /* ============================================================ */
            /* MODE 3: KARTU RINCIAN PER PROGRAM (DETAILED CARDS)           */
            /* ============================================================ */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programBreakdown.map((prog, idx) => {
                const total = prog.total;
                const safePercent = total > 0 ? Math.round((prog.hijau / total) * 100) : 0;
                const redPercent = total > 0 ? Math.round((prog.merah / total) * 100) : 0;
                const greyPercent = total > 0 ? Math.round((prog.abu / total) * 100) : 0;
                const hasRed = prog.merah > 0;

                return (
                  <div
                    key={prog.namaProgram}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#0072CE]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
                  >
                    {/* Header of program card */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-black text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm font-extrabold text-slate-900 truncate">
                            {prog.namaProgram}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 ml-8">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 font-mono font-bold text-[11px]">
                            {prog.code}
                          </span>
                          {hasRed ? (
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-black text-[10px] uppercase tracking-wider">
                              Perlu Perhatian ({prog.merah} NAC)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-wider">
                              100% Sesuai
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Total</span>
                        <strong className="text-slate-900 font-black text-base">{total}</strong>
                        <span className="text-[11px] text-slate-500 font-semibold ml-1">Kegiatan</span>
                      </div>
                    </div>

                    {/* Graphical Proportional Horizontal Bar */}
                    <div className="space-y-2">
                      <div className="w-full h-5 bg-slate-100 rounded-xl overflow-hidden flex p-0.5 gap-0.5 shadow-inner">
                        {prog.hijau > 0 && (
                          <div
                            style={{ width: `${(prog.hijau / total) * 100}%` }}
                            className="h-full bg-emerald-500 rounded-l-lg transition-all duration-500 flex items-center justify-center text-[10px] font-black text-white px-1 overflow-hidden"
                            title={`Hijau (Aman): ${prog.hijau} kegiatan (${safePercent}%)`}
                          >
                            {safePercent >= 15 ? `${safePercent}%` : ""}
                          </div>
                        )}
                        {prog.merah > 0 && (
                          <div
                            style={{ width: `${(prog.merah / total) * 100}%` }}
                            className="h-full bg-rose-600 transition-all duration-500 flex items-center justify-center text-[10px] font-black text-white px-1 overflow-hidden"
                            title={`Merah (Terdeteksi NAC): ${prog.merah} kegiatan (${redPercent}%)`}
                          >
                            {redPercent >= 15 ? `${redPercent}%` : ""}
                          </div>
                        )}
                        {prog.abu > 0 && (
                          <div
                            style={{ width: `${(prog.abu / total) * 100}%` }}
                            className="h-full bg-slate-500 rounded-r-lg transition-all duration-500 flex items-center justify-center text-[10px] font-black text-white px-1 overflow-hidden"
                            title={`Abu (Grey Area): ${prog.abu} kegiatan (${greyPercent}%)`}
                          >
                            {greyPercent >= 15 ? `${greyPercent}%` : ""}
                          </div>
                        )}
                      </div>

                      {/* 3 Metric breakdown badges */}
                      <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                        {/* Hijau pill */}
                        <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-800">Hijau</span>
                          </div>
                          <p className="font-black text-emerald-700 text-xs mt-1">
                            {prog.hijau} <span className="text-[10px] font-normal text-emerald-600">({safePercent}%)</span>
                          </p>
                        </div>

                        {/* Merah pill */}
                        <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-100">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-600" />
                            <span className="text-[10px] font-bold text-rose-800">Merah</span>
                          </div>
                          <p className="font-black text-rose-700 text-xs mt-1">
                            {prog.merah} <span className="text-[10px] font-normal text-rose-600">({redPercent}%)</span>
                          </p>
                        </div>

                        {/* Abu pill */}
                        <div className="p-2 rounded-xl bg-slate-100/80 border border-slate-200">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-slate-500" />
                            <span className="text-[10px] font-bold text-slate-700">Abu</span>
                          </div>
                          <p className="font-black text-slate-700 text-xs mt-1">
                            {prog.abu} <span className="text-[10px] font-normal text-slate-500">({greyPercent}%)</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Link */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => navigateTo("/data-kegiatan")}
                        className="text-xs font-bold text-[#0072CE] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Lihat Kegiatan</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span className="font-semibold">
            Menampilkan {programBreakdown.length} grafik statistik nama program aktif
            {lastSyncTime && (
              <span className="ml-2 text-slate-400 font-normal">
                • Sinkronisasi terakhir: {lastSyncTime.toLocaleTimeString("id-ID")}
              </span>
            )}
          </span>
          <button
            onClick={() => navigateTo("/data-kegiatan")}
            className="font-extrabold text-[#0072CE] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Seluruh Tabel Data Kegiatan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Summary Section & Recent Activities Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Link Card: Data Kegiatan */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-[#0072CE]/10 text-[#0072CE]">
              <ListFilter className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900">Manajemen Data Kegiatan</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Akses tabel lengkap seluruh input kegiatan, filter berdasarkan tanggal, jenis biaya, status NAC, serta export ke Microsoft Excel.
            </p>
          </div>
          <button
            onClick={() => navigateTo("/data-kegiatan")}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#0072CE] hover:bg-[#005bb5] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <span>Buka Data Kegiatan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Link Card: Master Program & Keywords */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-amber-500/10 text-amber-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900">Master Data & Aturan NAC</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kelola daftar kata kunci Non-Allowable Cost, transaksi Grey Area, master jenis biaya, dan kode singkatan program PLN.
            </p>
          </div>
          <button
            onClick={() => navigateTo("/master-program")}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <span>Kelola Master Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Link Card: Input Baru */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0072CE] to-[#00A3E0] text-white p-5 shadow-md shadow-[#0072CE]/15 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-white/20 text-white backdrop-blur-md">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white">Input Kegiatan Baru (NEWS)</h4>
            <p className="text-xs text-blue-50/90 leading-relaxed">
              Formulir validasi cerdas pendeteksi dini biaya tidak diperkenankan sebelum data disimpan ke database.
            </p>
          </div>
          <button
            onClick={() => navigateTo("/tambah-kegiatan")}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#FFC72C] hover:bg-[#ffbe1a] text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <span>Tambah Kegiatan Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
