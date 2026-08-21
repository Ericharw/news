"use client";

import React from "react";
import { Search, Filter, ChevronDown, Eye, Trash2, CalendarDays, PlusCircle } from "lucide-react";
import { ActivityItem } from "@/types/activity";

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
        return "bg-slate-100 text-slate-700 border border-slate-200 font-semibold";
    }
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
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-3.5 w-12 text-center">No</th>
              <th className="py-3.5 px-4">Nama Program</th>
              <th className="py-3.5 px-4">Subjek Kegiatan</th>
              <th className="py-3.5 px-4">Jenis Biaya</th>
              <th className="py-3.5 px-4">Tanggal Awal</th>
              <th className="py-3.5 px-4">Batch</th>
              <th className="py-3.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
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
                  <td className="py-4 px-3.5 text-center font-semibold text-slate-500">
                    {row.no}
                  </td>
                  <td className="py-4 px-4 font-extrabold text-slate-900 group-hover:text-[#0072CE] transition-colors">
                    {row.namaProgram}
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-700">
                    {row.subjekKegiatan}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs ${getJenisBiayaBadge(
                        row.jenisBiaya
                      )}`}
                    >
                      {row.jenisBiaya}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                      <span>{row.tanggalAwal}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100/70 text-amber-900 font-bold text-xs border border-amber-200">
                      {row.batch}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Action Icon */}
                      <button
                        onClick={() => onViewItem(row)}
                        className="w-8 h-8 rounded-xl bg-sky-50 hover:bg-[#0072CE] text-[#0072CE] hover:text-white flex items-center justify-center transition-all shadow-2xs"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Delete Action Icon */}
                      <button
                        onClick={() => onDeleteItem(row.id)}
                        className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white flex items-center justify-center transition-all shadow-2xs"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
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
