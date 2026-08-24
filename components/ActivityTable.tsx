"use client";

import React from "react";
import { Search, Filter, ChevronDown, Eye, Trash2, CalendarDays, PlusCircle, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { ActivityItem } from "@/types/activity";
import { PROGRAM_OPTIONS } from "@/data/programOptions";

interface ActivityTableProps {
  filteredData: ActivityItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterJenisBiaya: string;
  setFilterJenisBiaya: (jenis: string) => void;
  showFilterDropdown: boolean;
  setShowFilterDropdown: (show: boolean) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onViewItem: (item: ActivityItem) => void;
  onDeleteItem: (id: number) => void;
  onNavigateToAdd?: () => void;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  filteredData,
  searchQuery,
  setSearchQuery,
  filterJenisBiaya,
  setFilterJenisBiaya,
  showFilterDropdown,
  setShowFilterDropdown,
  currentPage,
  setCurrentPage,
  onViewItem,
  onDeleteItem,
  onNavigateToAdd
}) => {
  const getJenisBiayaBadge = (jenis: string) => {
    switch (jenis) {
      case "Perjalanan Dinas":
        return "bg-sky-50 text-[#0072CE] border border-sky-200/80 font-bold";
      case "Konsumsi":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold";
      case "Akomodasi":
        return "bg-amber-50 text-amber-800 border border-amber-200/80 font-bold";
      default:
        return "bg-[#0072CE]/10 text-[#0072CE] border border-[#0072CE]/20 font-semibold";
    }
  };

  const getSingkatanProgram = (namaProgram: string) => {
    const match = PROGRAM_OPTIONS.find(
      (p) =>
        p.label.toLowerCase() === namaProgram.toLowerCase() ||
        p.code.toLowerCase() === namaProgram.toLowerCase() ||
        namaProgram.includes(`(${p.code})`)
    );
    if (match) return match.code;
    const words = namaProgram.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].substring(0, 5).toUpperCase();
    return words.map((w) => w[0].toUpperCase()).join("");
  };

  const getSingkatanSubjek = (subjek: string) => {
    const words = subjek.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
    if (words.length <= 2) return subjek;
    return words.map((w) => w[0].toUpperCase()).join("");
  };

  const getSingkatanJenisBiaya = (jenis: string) => {
    const trimmed = (jenis || "").trim().toUpperCase();
    if (trimmed.includes("KONSUM") || trimmed === "KONS") return "KONS";
    if (trimmed.includes("AMOR")) return "AMOR";
    if (trimmed.includes("IURAN")) return "IURAN";
    if (trimmed.includes("PAJAK")) return "PAJAK";
    if (trimmed.includes("CETAK")) return "CETAK";
    if (trimmed.includes("ATK")) return "ATK";
    if (trimmed.includes("BANK")) return "BANK";
    if (trimmed.includes("PERJALANAN") || trimmed === "PD" || trimmed === "PERDIN") return "PERDIN";
    if (trimmed.includes("AKOMODASI") || trimmed === "AKM" || trimmed === "AKOM") return "AKOM";

    switch (jenis) {
      case "Perjalanan Dinas":
        return "PERDIN";
      case "Konsumsi":
        return "KONS";
      case "Akomodasi":
        return "AKOM";
      default:
        return jenis.length > 6 ? jenis.substring(0, 5).toUpperCase() : jenis.toUpperCase();
    }
  };

  const getRingkasanSingkatan = (item: ActivityItem) => {
    const progCode = getSingkatanProgram(item.namaProgram);
    const subjekCode = getSingkatanSubjek(item.subjekKegiatan);
    const objekText = item.objekKegiatan || "";
    const jbCode = getSingkatanJenisBiaya(item.jenisBiaya);

    return objekText
      ? `${progCode} | ${subjekCode} | ${objekText} | ${jbCode} | ${item.tanggalAwal}`
      : `${progCode} | ${subjekCode} | ${jbCode} | ${item.tanggalAwal}`;
  };

  const handleExportExcel = () => {
    const dataToExport = filteredData.map((item, idx) => ({
      "No": idx + 1,
      "Nama Program": item.namaProgram,
      "Subjek Kegiatan": item.subjekKegiatan,
      "Objek Kegiatan": item.objekKegiatan || "-",
      "Jenis Biaya": item.jenisBiaya,
      "Tanggal": item.tanggalAwal,
      "Ringkasan Isi Form": getRingkasanSingkatan(item),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Kegiatan");
    XLSX.writeFile(workbook, `Data_Kegiatan_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-xs transition-all">
      {/* Card Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Data Kegiatan</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#0072CE]/10 text-[#0072CE] text-xs font-bold">
              {filteredData.length} Item
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Daftar seluruh kegiatan pelatihan & diklat yang telah terdaftar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Field */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari program / batch..."
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all shadow-2xs ${
                filterJenisBiaya !== "all" ? "border-[#0072CE] text-[#0072CE] bg-sky-50/80 ring-2 ring-[#0072CE]/20" : ""
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Filter Dropdown Popover */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-2 text-xs animate-in fade-in zoom-in-95">
                <div className="font-bold text-slate-400 px-3 py-1.5 uppercase text-[10px] tracking-wider">
                  Filter Jenis Biaya
                </div>
                {["all", "Perjalanan Dinas", "Konsumsi", "Akomodasi"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilterJenisBiaya(cat);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all font-medium ${
                      filterJenisBiaya === cat
                        ? "bg-[#0072CE] text-white font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {cat === "all" ? "Semua Jenis Biaya" : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Excel Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs border border-emerald-500 cursor-pointer shrink-0"
            title="Export ke Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          {/* Add Activity Action Button */}
          {onNavigateToAdd && (
            <button
              onClick={onNavigateToAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#FFC72C] hover:bg-[#F2B81A] text-slate-950 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-xs border border-amber-300 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Tambah Kegiatan</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {filterJenisBiaya !== "all" && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Filter Aktif:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0072CE]/10 text-[#0072CE] text-xs font-bold border border-[#0072CE]/20">
            {filterJenisBiaya}
            <button
              onClick={() => setFilterJenisBiaya("all")}
              className="hover:text-rose-600 font-bold ml-1"
            >
              ✕
            </button>
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 shadow-2xs">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
              <th className="py-3 px-2 text-center w-8 sm:w-10">No</th>
              <th className="py-3 px-2 sm:px-3">Nama Program</th>
              <th className="py-3 px-2 sm:px-3">Subjek Kegiatan</th>
              <th className="py-3 px-2 sm:px-3">Objek Kegiatan</th>
              <th className="py-3 px-2 sm:px-3">Jenis Biaya</th>
              <th className="py-3 px-2 sm:px-3">Tanggal</th>
              <th className="py-3 px-2 sm:px-3">Ringkasan Isi Form</th>
              <th className="py-3 px-2 sm:px-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                    <div className="font-semibold text-slate-600">Tidak ada data kegiatan ditemukan.</div>
                    <div className="text-xs text-slate-400">Coba ubah kata kunci atau hapus filter.</div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3 px-2 text-center font-semibold text-slate-500 text-xs">
                    {row.no}
                  </td>
                  <td className="py-3 px-2 sm:px-3 font-extrabold text-slate-900 group-hover:text-[#0072CE] transition-colors text-xs" title={row.namaProgram}>
                    <div className="line-clamp-2">{row.namaProgram}</div>
                  </td>
                  <td className="py-3 px-2 sm:px-3 font-medium text-slate-700 text-xs" title={row.subjekKegiatan}>
                    <div className="line-clamp-2">{row.subjekKegiatan}</div>
                  </td>
                  <td className="py-3 px-2 sm:px-3 font-medium text-slate-700 text-xs" title={row.objekKegiatan || "-"}>
                    <div className="line-clamp-2">{row.objekKegiatan || "-"}</div>
                  </td>
                  <td className="py-3 px-2 sm:px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap ${getJenisBiayaBadge(
                        row.jenisBiaya
                      )}`}
                    >
                      {row.jenisBiaya}
                    </span>
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-slate-600 font-medium whitespace-nowrap text-xs">
                    <div className="flex items-center gap-1 text-[11px]">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{row.tanggalAwal}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-xs">
                    <div
                      className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold text-[#0072CE] shadow-2xs max-w-full"
                      title={getRingkasanSingkatan(row)}
                    >
                      <span className="line-clamp-2 leading-tight">{getRingkasanSingkatan(row)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* View Action Icon */}
                      <button
                        onClick={() => onViewItem(row)}
                        className="w-7 h-7 rounded-lg bg-sky-50 hover:bg-[#0072CE] text-[#0072CE] hover:text-white flex items-center justify-center transition-all shadow-2xs"
                        title="Lihat Detail"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Action Icon */}
                      <button
                        onClick={() => onDeleteItem(row.id)}
                        className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white flex items-center justify-center transition-all shadow-2xs"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-xs text-slate-500">
        <div className="font-semibold text-slate-600">
          Menampilkan <span className="text-slate-900 font-bold">1 - {filteredData.length}</span> dari <span className="text-slate-900 font-bold">{filteredData.length}</span> data kegiatan
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 font-bold transition-all"
          >
            &lt;
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-xl font-extrabold flex items-center justify-center transition-all ${
                currentPage === page
                  ? "bg-[#0072CE] text-white shadow-xs"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          ))}
          <span className="px-1 text-slate-400">...</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold transition-all"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};
