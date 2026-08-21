"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MasterKeywordItem } from "@/types/activity";
import Swal from "sweetalert2";
import {
  Search,
  PlusCircle,
  Trash2,
  Eye,
  KeyRound,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert
} from "lucide-react";

export const MasterKeywordView: React.FC = () => {
  const [keywords, setKeywords] = useState<MasterKeywordItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<MasterKeywordItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MasterKeywordItem | null>(null);

  // Form State
  const [newKeyword, setNewKeyword] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const fetchKeywords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/keywords");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const formatted: MasterKeywordItem[] = json.data.map(
          (item: { id: number; keyword: string; tipe_transaksi?: string; kategori_transaksi?: string }) => ({
            id: item.id,
            keyword: item.keyword,
            kategoriTransaksi: item.tipe_transaksi || item.kategori_transaksi || "Non-Allowable Cost (NAC)",
          })
        );
        setKeywords(formatted);
      }
    } catch (err) {
      console.error("Error fetching master keywords:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Input Tidak Lengkap",
        text: "Harap isi Kata Kunci (Keyword).",
        confirmButtonColor: "#e11d48",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: newKeyword.trim(),
          tipeTransaksi: newCategory.trim() || "Non-Allowable Cost (NAC)",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setNewKeyword("");
        setNewCategory("");
        setSearchQuery("");
        setCurrentPage(1);
        setIsAddModalOpen(false);
        fetchKeywords();

        Swal.fire({
          icon: "success",
          title: "Berhasil Menyimpan Data!",
          text: "Master Keyword baru berhasil tersimpan ke database PostgreSQL.",
          confirmButtonColor: "#0072CE",
          timer: 2500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Menambahkan Data",
          text: json.error || "Gagal menyimpan data ke database.",
          confirmButtonColor: "#e11d48",
        });
      }
    } catch (err) {
      console.error("Error adding master keyword:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Menambahkan Data",
        text: (err as Error).message || "Terjadi kesalahan saat menambah data.",
        confirmButtonColor: "#e11d48",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteKeyword = async () => {
    if (!deletingItem) return;

    try {
      const res = await fetch(`/api/keywords/${deletingItem.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setDeletingItem(null);
        fetchKeywords();

        Swal.fire({
          icon: "success",
          title: "Berhasil Dihapus!",
          text: "Master Keyword telah berhasil dihapus dari database.",
          confirmButtonColor: "#0072CE",
          timer: 2000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus Data",
          text: json.error || "Gagal menghapus Master Keyword.",
          confirmButtonColor: "#e11d48",
        });
      }
    } catch (err) {
      console.error("Error deleting keyword:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus Data",
        text: (err as Error).message || "Terjadi kesalahan saat menghapus data.",
        confirmButtonColor: "#e11d48",
      });
    }
  };

  const filteredKeywords = useMemo(() => {
    return keywords.filter(
      (k) =>
        (k?.keyword || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (k?.kategoriTransaksi || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [keywords, searchQuery]);

  const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage) || 1;
  const paginatedKeywords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredKeywords.slice(start, start + itemsPerPage);
  }, [filteredKeywords, currentPage]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-xs transition-all space-y-6">
      {/* Card Header & Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Master Keyword</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100/80 text-rose-700 text-xs font-bold">
              {filteredKeywords.length} Item
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Daftar kata terlarang & alasan kategori transaksi (NAC) dari database PostgreSQL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          {/* Refresh Button */}
          <button
            onClick={fetchKeywords}
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-all shrink-0"
            title="Refresh Data DB"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-rose-600" : ""}`} />
          </button>

          {/* Search Field */}
          <div className="relative flex-1 min-w-[160px] sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari keyword / kategori..."
              className="w-full pl-10 pr-8 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all placeholder:text-slate-400"
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

          {/* Yellow CTA Add Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 bg-[#FFC72C] hover:bg-[#F2B81A] text-slate-950 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-xs border border-amber-300 shrink-0 cursor-pointer w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Keyword</span>
          </button>
        </div>
      </div>

      {/* Main Full-Width Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 shadow-2xs">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-3.5 w-14 text-center">NO</th>
              <th className="py-3.5 px-4 w-48">KATA KUNCI (KEYWORD)</th>
              <th className="py-3.5 px-4">ALASAN / TIPE TRANSAKSI (NAC)</th>
              <th className="py-3.5 px-4 w-28 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-rose-600" />
                    <span>Memuat master keyword dari database PostgreSQL...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedKeywords.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                    <div className="font-semibold text-slate-600">Tidak ada master keyword ditemukan.</div>
                    <div className="text-xs text-slate-400">Coba ubah kata kunci pencarian Anda.</div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedKeywords.map((item, idx) => {
                const rowNum = (currentPage - 1) * itemsPerPage + idx + 1;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-3.5 text-center font-semibold text-slate-500">
                      {rowNum}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-extrabold text-xs border border-rose-200/80">
                        {item.keyword}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {item.kategoriTransaksi}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Detail Icon Button */}
                        <button
                          onClick={() => setViewingItem(item)}
                          className="w-8 h-8 rounded-xl bg-sky-50 hover:bg-[#0072CE] text-[#0072CE] hover:text-white flex items-center justify-center transition-all shadow-2xs"
                          title="Lihat Detail Keyword"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete Icon Button */}
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white flex items-center justify-center transition-all shadow-2xs"
                          title="Hapus Master Keyword"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
        <div className="font-semibold text-slate-600">
          Menampilkan <span className="text-slate-900 font-bold">{filteredKeywords.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredKeywords.length)}</span> dari <span className="text-slate-900 font-bold">{filteredKeywords.length}</span> data keyword
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 font-bold transition-all"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
            .map((page, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev && page - prev > 1;
              return (
                <React.Fragment key={page}>
                  {showEllipsis && <span className="px-1 text-slate-400">...</span>}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl font-extrabold flex items-center justify-center transition-all ${
                      currentPage === page
                        ? "bg-[#0072CE] text-white shadow-xs"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 font-bold transition-all"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* MODAL 1: ADD MASTER KEYWORD */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/50">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Tambah Master Keyword NAC</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddKeyword} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Kata Kunci (Keyword) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: LAUNDRY atau Souvenir"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Alasan / Tipe Transaksi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Perabotan & Perlengkapan Kantor / Dapur/ Toilet"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? "Menyimpan..." : "Simpan Keyword"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW DETAIL MASTER KEYWORD */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/60">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Detail Master Keyword</h3>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-0.5">
                    ID Database PostgreSQL
                  </span>
                  <span className="font-bold text-slate-800 text-sm">#{viewingItem.id}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-0.5">
                    Kata Kunci (Pattern)
                  </span>
                  <span className="inline-block px-3 py-1 rounded-md bg-rose-100 text-rose-800 font-extrabold text-sm border border-rose-200">
                    {viewingItem.keyword}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-0.5">
                    Alasan / Kategori Transaksi
                  </span>
                  <span className="font-bold text-slate-900 text-xs block leading-relaxed">
                    {viewingItem.kategoriTransaksi}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setViewingItem(null)}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Hapus Master Keyword?</h3>
              <p className="text-slate-500 text-xs mt-1">
                Apakah Anda yakin ingin menghapus keyword <strong>&quot;{deletingItem.keyword}&quot;</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteKeyword}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
