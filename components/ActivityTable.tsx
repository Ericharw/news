import React, { useState, useEffect, useMemo } from "react";
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
  onDeleteItem?: (id: number) => void;
  onDeleteAllItems?: () => void;
  onNavigateToAdd?: () => void;
  title?: string;
  subtitle?: string;
  showExportExcel?: boolean;
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
  onDeleteAllItems,
  onNavigateToAdd,
  title,
  subtitle,
  showExportExcel = true
}) => {
  const itemsPerPage = 10;

  // Multi-filter internal state for Admin Data Kegiatan
  const [filterNamaProgram, setFilterNamaProgram] = useState("all");
  const [filterTanggalOption, setFilterTanggalOption] = useState("all"); // 'all' | '1hari' | '1minggu' | '1bulan' | '1tahun' | 'custom'
  const [filterTanggalCustom, setFilterTanggalCustom] = useState("");
  const [filterTanggalCustomEnd, setFilterTanggalCustomEnd] = useState("");
  const [filterStatusNac, setFilterStatusNac] = useState("all");

  const [filterOptions, setFilterOptions] = useState<string[]>([
    "all",
    "Perjalanan Dinas",
    "Konsumsi",
    "Akomodasi",
    "Amortisasi",
    "Iuran",
    "Pajak",
    "Cetak",
    "ATK",
    "Bank",
    "5.2 SARANA",
  ]);
  const [masterJenisBiayaMap, setMasterJenisBiayaMap] = useState<Record<string, string>>({});

  const getProgramFilterName = (namaProgram: string) => namaProgram.split("(")[0].trim();

  useEffect(() => {
    async function loadMasterJenisBiaya() {
      try {
        const res = await fetch("/api/master/jenis-biaya");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const map: Record<string, string> = {};
          const names: string[] = [];
          json.data.forEach((item: { nama: string; keterangan?: string }) => {
            if (item.nama) {
              names.push(item.nama);
              if (item.keterangan) {
                map[item.nama.toLowerCase().trim()] = item.keterangan.trim();
              }
            }
          });
          setMasterJenisBiayaMap(map);
          const combined = Array.from(
            new Set(["all", ...names, "Perjalanan Dinas", "Konsumsi", "Akomodasi", "Amortisasi", "Iuran", "Pajak", "Cetak", "ATK", "Bank", "5.2 SARANA"])
          );
          setFilterOptions(combined);
        }
      } catch (err) {
        console.error("Error loading master jenis biaya for filter:", err);
      }
    }
    loadMasterJenisBiaya();
  }, []);

  const programListOptions = useMemo(() => {
    const fromOptions = PROGRAM_OPTIONS.map((p) => p.label);
    const fromData = filteredData.map((d) => d.namaProgram).filter(Boolean);
    return Array.from(new Set([...fromOptions, ...fromData].map(getProgramFilterName)));
  }, [filteredData]);

  const parseItemDate = (tanggalStr: string): Date | null => {
    if (!tanggalStr) return null;
    const str = tanggalStr.trim();

    // Check DD/MM/YYYY or DD-MM-YYYY format
    if (/^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/.test(str)) {
      const parts = str.split(/[/-]/);
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
      return new Date(year, month, day);
    }

    // Check YYYY-MM-DD format (e.g. from date input picker)
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const parts = str.split("-");
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }

    // Handle ISO timestamp format (e.g. createdAt) or standard date string
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };

  const matchDateRange = (tanggalItem: string, option: string, customDate: string, customDateEnd: string) => {
    if (option === "all" && !customDate && !customDateEnd) return true;
    if (!tanggalItem) return false;

    const itemDate = parseItemDate(tanggalItem);
    if (!itemDate) return false;

    if (option === "custom") {
      if (!customDate && !customDateEnd) return true;

      const startDate = customDate ? parseItemDate(customDate) : null;
      const endDate = customDateEnd ? parseItemDate(customDateEnd) : null;

      if (startDate) {
        const startOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0);
        if (itemDate < startOfDay) return false;
      }
      if (endDate) {
        const endOfDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999);
        if (itemDate > endOfDay) return false;
      }
      return true;
    }

    if (option === "all" && (customDate || customDateEnd)) {
      const selectedDate = customDate || customDateEnd;
      const selected = parseItemDate(selectedDate);
      if (!selected) return true;

      return (
        itemDate.getFullYear() === selected.getFullYear() &&
        itemDate.getMonth() === selected.getMonth() &&
        itemDate.getDate() === selected.getDate()
      );
    }

    const now = new Date();
    const nowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    const diffMs = nowEnd - itemDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (option === "1hari") {
      return diffDays >= -0.05 && diffDays <= 1;
    }
    if (option === "1minggu") {
      return diffDays >= -0.05 && diffDays <= 7;
    }
    if (option === "1bulan") {
      return diffDays >= -0.05 && diffDays <= 30;
    }
    if (option === "1tahun") {
      return diffDays >= -0.05 && diffDays <= 365;
    }

    return true;
  };

  const matchStatusNac = (item: ActivityItem, filterStatus: string) => {
    if (filterStatus === "all") return true;

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
        else redNoteText = item.catatanNac;
      }
    }

    const isRed = item.statusNac === "TERDETEKSI_NAC" || Boolean(redNoteText);
    const isGrey = item.statusNac === "GREY_AREA" || Boolean(greyNoteText);
    const isSafe = !isRed && !isGrey;

    if (filterStatus === "AMAN") return isSafe;
    if (filterStatus === "TERDETEKSI_NAC") return isRed;
    if (filterStatus === "GREY_AREA") return isGrey;

    return true;
  };

  const finalFilteredData = useMemo(() => {
    return filteredData.filter((item) => {
      const matchProgram =
        filterNamaProgram === "all"
          ? true
          : getProgramFilterName(item.namaProgram).toLowerCase() === filterNamaProgram.toLowerCase().trim();

      const matchJenis =
        filterJenisBiaya === "all"
          ? true
          : item.jenisBiaya.toLowerCase().trim() === filterJenisBiaya.toLowerCase().trim();

      const dateToFilter = item.createdAt || item.tanggalAwal;
      const matchTgl = matchDateRange(dateToFilter, filterTanggalOption, filterTanggalCustom, filterTanggalCustomEnd);

      const matchNac = matchStatusNac(item, filterStatusNac);

      return matchProgram && matchJenis && matchTgl && matchNac;
    });
  }, [filteredData, filterNamaProgram, filterJenisBiaya, filterTanggalOption, filterTanggalCustom, filterTanggalCustomEnd, filterStatusNac]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterNamaProgram, filterJenisBiaya, filterTanggalOption, filterTanggalCustom, filterTanggalCustomEnd, filterStatusNac, setCurrentPage]);

  const totalPages = Math.ceil(finalFilteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return finalFilteredData.slice(start, start + itemsPerPage);
  }, [finalFilteredData, currentPage]);

  const activeFiltersCount =
    (filterNamaProgram !== "all" ? 1 : 0) +
    (filterJenisBiaya !== "all" ? 1 : 0) +
    (filterTanggalOption !== "all" || filterTanggalCustom !== "" || filterTanggalCustomEnd !== "" ? 1 : 0) +
    (filterStatusNac !== "all" ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  const handleResetAllFilters = () => {
    setFilterNamaProgram("all");
    setFilterJenisBiaya("all");
    setFilterTanggalOption("all");
    setFilterTanggalCustom("");
    setFilterTanggalCustomEnd("");
    setFilterStatusNac("all");
    setCurrentPage(1);
  };

  const handleCustomDateStartChange = (value: string) => {
    setFilterTanggalCustom(value);
    if (!value) {
      setFilterTanggalCustomEnd("");
      setCurrentPage(1);
      return;
    }
    if (!filterTanggalCustomEnd) {
      setFilterTanggalCustomEnd(value);
    } else if (new Date(value) > new Date(filterTanggalCustomEnd)) {
      setFilterTanggalCustomEnd(value);
    }
    setCurrentPage(1);
  };

  const handleCustomDateEndChange = (value: string) => {
    setFilterTanggalCustomEnd(value);
    if (!value) {
      setFilterTanggalCustom("");
      setCurrentPage(1);
      return;
    }
    if (!filterTanggalCustom) {
      setFilterTanggalCustom(value);
    } else if (new Date(filterTanggalCustom) > new Date(value)) {
      setFilterTanggalCustom(value);
    }
    setCurrentPage(1);
  };

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
    return subjek || "";
  };

  const getSingkatanJenisBiaya = (jenis: string) => {
    if (!jenis) return "";
    const rawTrimmed = jenis.trim();
    const lowerKey = rawTrimmed.toLowerCase();

    if (masterJenisBiayaMap[lowerKey]) {
      return masterJenisBiayaMap[lowerKey].toUpperCase();
    }

    const foundEntry = Object.entries(masterJenisBiayaMap).find(
      ([k]) => lowerKey.includes(k) || k.includes(lowerKey)
    );
    if (foundEntry && foundEntry[1]) {
      return foundEntry[1].toUpperCase();
    }

    const trimmed = rawTrimmed.toUpperCase();
    if (trimmed.includes("SARJAR") || trimmed.includes("SARANA")) return "SARANA";
    if (trimmed.includes("AMORTISASI") || trimmed.includes("AMOR")) return "AMOR";
    if (trimmed.includes("PAJAK") || trimmed.includes("RETRIBUSI")) return "PAJAK";
    if (trimmed.includes("IURAN")) return "IURAN";
    if (trimmed.includes("CETAK")) return "CETAK";
    if (trimmed.includes("ATK")) return "ATK";
    if (trimmed.includes("KONSUM") || trimmed.includes("KONS")) return "KONS";
    if (trimmed.includes("BANK")) return "BANK";
    if (trimmed.includes("PERJALANAN") || trimmed === "PD" || trimmed.includes("PERDIN")) return "PERDIN";
    if (trimmed.includes("AKOMODASI") || trimmed === "AKM" || trimmed.includes("AKOM")) return "AKOM";

    if (/^[A-Z0-9\s-]{2,8}$/.test(rawTrimmed)) {
      return rawTrimmed.toUpperCase();
    }

    const clean = trimmed.replace(/^[0-9.]+\s*/, "");
    return clean.length > 8 ? clean.substring(0, 6) : clean;
  };

  const formatTanggal2Digit = (tanggal: string) => {
    if (!tanggal) return "";

    const raw = tanggal.trim();
    const dateMatch = raw.match(/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2}/);

    if (!dateMatch) return raw.replace(/\b20(\d{2})\b/g, "$1");

    const matched = dateMatch[0];

    if (/^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/.test(matched)) {
      const [day, month, yearRaw] = matched.split(/[/-]/);
      const year = yearRaw.length === 4 ? yearRaw.slice(-2) : yearRaw.padStart(2, "0");
      return raw.replace(matched, `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`);
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(matched)) {
      const [year, month, day] = matched.split("-");
      return raw.replace(matched, `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year.slice(-2)}`);
    }

    return raw.replace(/\b20(\d{2})\b/g, "$1");
  };

  const formatTanggalInput = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return formatTanggal2Digit(value);
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getRingkasanSingkatan = (item: ActivityItem) => {
    const progCode = getSingkatanProgram(item.namaProgram);
    const subjekCode = item.subjekKegiatan || "";
    const objekText = item.objekKegiatan || "";
    const jbCode = getSingkatanJenisBiaya(item.jenisBiaya);
    const tglShort = formatTanggal2Digit(item.tanggalAwal);

    const fullStr = objekText
      ? `${progCode}-${subjekCode}-${objekText}-${jbCode}-${tglShort}`
      : `${progCode}-${subjekCode}-${jbCode}-${tglShort}`;

    return fullStr;
  };

  const formatTahunDuaDigitUntukExport = (value: string) =>
    value.replace(/(\d{1,2}\/\d{1,2}\/)(\d{4})\b/g, (_match, prefix, year) => `${prefix}${year.slice(-2)}`).replace(/\b20(\d{2})\b/g, "$1");

  const handleExportExcel = () => {
    const dataToExport = finalFilteredData.map((item, idx) => {
      let redNoteText = "";
      let greyNoteText = "";

      if (item.catatanNac) {
        if (item.catatanNac.includes("|")) {
          const parts = item.catatanNac.split("|");
          redNoteText = parts[0].replace(/^\[Merah\]\s*/i, "").trim();
          greyNoteText = parts[1].replace(/^\[Grey Area\]\s*/i, "").trim();
        } else {
          const clauses = item.catatanNac.split(";").map((c) => c.trim()).filter(Boolean);
          const redClauses: string[] = [];
          const greyClauses: string[] = [];

          const isGreyKeyword = (txt: string) => {
            const lower = txt.toLowerCase();
            return (
              lower.includes("grey") ||
              lower.includes("sponsor") ||
              lower.includes("sponsorship") ||
              lower.includes("honorarium") ||
              lower.includes("entertainment") ||
              lower.includes("incentive") ||
              lower.includes("komisi") ||
              lower.includes("asuransi direksi") ||
              lower.includes("bahan bakar") ||
              lower.includes("swakelola")
            );
          };

          for (const clause of clauses) {
            if (isGreyKeyword(clause)) {
              greyClauses.push(clause);
            } else {
              redClauses.push(clause);
            }
          }

          if (redClauses.length > 0) redNoteText = redClauses.join("; ");
          if (greyClauses.length > 0) greyNoteText = greyClauses.join("; ");
          if (redClauses.length === 0 && greyClauses.length === 0) {
            if (item.statusNac === "GREY_AREA") greyNoteText = item.catatanNac;
            else redNoteText = item.catatanNac;
          }
        }
      }

      const isRed = item.statusNac === "TERDETEKSI_NAC" || Boolean(redNoteText);
      const isGrey = item.statusNac === "GREY_AREA" || Boolean(greyNoteText);
      const isSafe = !isRed && !isGrey;

      return {
        "No": idx + 1,
        "Tanggal Input": formatTahunDuaDigitUntukExport(formatTanggalInput(item.createdAt)),
        "Nama Program": item.namaProgram,
        "Subjek Kegiatan": item.subjekKegiatan,
        "Objek Kegiatan": item.objekKegiatan || "-",
        "Jenis Biaya": item.jenisBiaya,
        "Tanggal": formatTahunDuaDigitUntukExport(formatTanggal2Digit(item.tanggalAwal)),
        "Ringkasan Isi Form": formatTahunDuaDigitUntukExport(getRingkasanSingkatan(item)),
        "Keyword NAC": isRed ? redNoteText || "Terdeteksi NAC" : "",
        "Aman": isSafe ? "Aman" : "",
        "grey area": isGrey ? greyNoteText || "Grey Area" : "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Kegiatan");
    XLSX.writeFile(workbook, `Data_Kegiatan_PLN_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-xs transition-all">
      {/* Card Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{title || "Data Kegiatan"}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#0072CE]/10 text-[#0072CE] text-xs font-bold">
              {finalFilteredData.length} Item
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            {subtitle || "Daftar seluruh kegiatan yang telah terdaftar."}
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

          {/* Multi-Filter Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all shadow-2xs ${hasActiveFilters ? "border-[#0072CE] text-[#0072CE] bg-sky-50/80 ring-2 ring-[#0072CE]/20 font-bold" : ""
                }`}
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter {hasActiveFilters ? `(${activeFiltersCount})` : ""}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Filter Dropdown Popover (4 Criteria Filters) */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-40 p-4 text-xs animate-in fade-in zoom-in-95 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-[#0072CE]" />
                    <span>Filter Data Kegiatan</span>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetAllFilters}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                    >
                      Reset Semua
                    </button>
                  )}
                </div>

                <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                  {/* 1. Filter Nama Program */}
                  <div>
                    <label className="block font-bold text-slate-800 text-[11px] mb-1">
                      1. Nama Program / Diklat
                    </label>
                    <select
                      value={filterNamaProgram}
                      onChange={(e) => {
                        setFilterNamaProgram(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white"
                    >
                      <option value="all">-- Semua Program --</option>
                      {programListOptions.map((prog) => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Filter Jenis Biaya */}
                  <div>
                    <label className="block font-bold text-slate-800 text-[11px] mb-1">
                      2. Jenis Biaya
                    </label>
                    <select
                      value={filterJenisBiaya}
                      onChange={(e) => {
                        setFilterJenisBiaya(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white"
                    >
                      {filterOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === "all" ? "-- Semua Jenis Biaya --" : cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Filter Tanggal */}
                  <div>
                    <label className="block font-bold text-slate-800 text-[11px] mb-1">
                      3. Rentang / Tanggal Input
                    </label>
                    <select
                      value={filterTanggalOption}
                      onChange={(e) => {
                        setFilterTanggalOption(e.target.value);
                        if (e.target.value !== "custom") {
                          setFilterTanggalCustom("");
                          setFilterTanggalCustomEnd("");
                        }
                        setCurrentPage(1);
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white mb-2"
                    >
                      <option value="all">-- Semua Tanggal Input --</option>
                      <option value="1hari">1 Hari (24 Jam / Hari Ini)</option>
                      <option value="1minggu">1 Minggu (7 Hari Terakhir)</option>
                      <option value="1bulan">1 Bulan (30 Hari Terakhir)</option>
                      <option value="1tahun">1 Tahun (365 Hari Terakhir)</option>
                      <option value="custom">Pilih Rentang Tanggal...</option>
                    </select>

                    {filterTanggalOption === "custom" && (
                      <div className="space-y-2 mt-1">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">Dari Tanggal</label>
                          <input
                            type="date"
                            value={filterTanggalCustom}
                            onChange={(e) => handleCustomDateStartChange(e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">Sampai Tanggal</label>
                          <input
                            type="date"
                            value={filterTanggalCustomEnd}
                            onChange={(e) => handleCustomDateEndChange(e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white"
                          />
                        </div>

                        {(filterTanggalCustom || filterTanggalCustomEnd) && (
                          <button
                            onClick={() => {
                              setFilterTanggalCustom("");
                              setFilterTanggalCustomEnd("");
                            }}
                            className="text-[10px] font-bold text-slate-600 hover:text-slate-800"
                            title="Hapus rentang tanggal"
                          >
                            Hapus rentang tanggal
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 4. Filter Status NAC */}
                  <div>
                    <label className="block font-bold text-slate-800 text-[11px] mb-1">
                      4. Status Validasi NAC
                    </label>
                    <select
                      value={filterStatusNac}
                      onChange={(e) => {
                        setFilterStatusNac(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white"
                    >
                      <option value="all">-- Semua Status NAC --</option>
                      <option value="AMAN">● AMAN (Hijau)</option>
                      <option value="TERDETEKSI_NAC">● TERDETEKSI NAC (Merah)</option>
                      <option value="GREY_AREA">● GREY AREA (Abu-abu)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setShowFilterDropdown(false)}
                    className="px-4 py-1.5 bg-[#0072CE] text-white font-bold rounded-xl text-xs hover:bg-[#005bb5] transition-all cursor-pointer shadow-xs"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export Excel Button */}
          {showExportExcel && (
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs border border-emerald-500 cursor-pointer shrink-0"
              title="Export ke Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
          )}

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

          {/* Delete All Action Button (Admin Data Kegiatan) */}
          {onDeleteAllItems && finalFilteredData.length > 0 && (
            <button
              onClick={onDeleteAllItems}
              className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs border border-rose-500 shrink-0 cursor-pointer"
              title="Hapus Seluruh Data Kegiatan"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Hapus Semua Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-bold">Filter Aktif:</span>

          {filterNamaProgram !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0072CE] text-xs font-bold border border-sky-200">
              Program: {filterNamaProgram}
              <button
                onClick={() => setFilterNamaProgram("all")}
                className="hover:text-rose-600 font-bold ml-0.5 cursor-pointer"
              >
                ✕
              </button>
            </span>
          )}

          {filterJenisBiaya !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0072CE] text-xs font-bold border border-sky-200">
              Jenis: {filterJenisBiaya}
              <button
                onClick={() => setFilterJenisBiaya("all")}
                className="hover:text-rose-600 font-bold ml-0.5 cursor-pointer"
              >
                ✕
              </button>
            </span>
          )}

          {(filterTanggalOption !== "all" || filterTanggalCustom !== "" || filterTanggalCustomEnd !== "") && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0072CE] text-xs font-bold border border-sky-200">
              Tanggal Input:{" "}
              {filterTanggalOption === "1hari"
                ? "1 Hari"
                : filterTanggalOption === "1minggu"
                  ? "1 Minggu"
                  : filterTanggalOption === "1bulan"
                    ? "1 Bulan"
                    : filterTanggalOption === "1tahun"
                      ? "1 Tahun"
                      : filterTanggalCustom && filterTanggalCustomEnd
                        ? `${filterTanggalCustom} s.d ${filterTanggalCustomEnd}`
                        : filterTanggalCustom || filterTanggalCustomEnd || "Rentang"}
              <button
                onClick={() => {
                  setFilterTanggalOption("all");
                  setFilterTanggalCustom("");
                  setFilterTanggalCustomEnd("");
                }}
                className="hover:text-rose-600 font-bold ml-0.5 cursor-pointer"
              >
                ✕
              </button>
            </span>
          )}

          {filterStatusNac !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0072CE] text-xs font-bold border border-sky-200">
              Status: {filterStatusNac === "AMAN" ? "AMAN (Hijau)" : filterStatusNac === "TERDETEKSI_NAC" ? "TERDETEKSI NAC (Merah)" : "GREY AREA (Abu-abu)"}
              <button
                onClick={() => setFilterStatusNac("all")}
                className="hover:text-rose-600 font-bold ml-0.5 cursor-pointer"
              >
                ✕
              </button>
            </span>
          )}

          <button
            onClick={handleResetAllFilters}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold hover:underline ml-1 cursor-pointer"
          >
            Reset Semua
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 shadow-2xs">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
              <th className="py-3 px-2 text-center w-8 sm:w-10">No</th>
              <th className="py-3 px-2 sm:px-3">Tanggal Input</th>
              <th className="py-3 px-2 sm:px-3">Nama Program</th>
              <th className="py-3 px-2 sm:px-3">Subjek Kegiatan</th>
              <th className="py-3 px-2 sm:px-3">Objek Kegiatan</th>
              <th className="py-3 px-2 sm:px-3">Jenis Biaya</th>
              <th className="py-3 px-2 sm:px-3">Tanggal</th>
              <th className="py-3 px-2 sm:px-3">Ringkasan Isi Form</th>
              <th className="py-3 px-2 sm:px-3">Input Oleh</th>
              <th className="py-3 px-2 sm:px-3">Status NAC</th>
              <th className="py-3 px-2 sm:px-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                    <div className="font-semibold text-slate-600">Tidak ada data kegiatan ditemukan.</div>
                    <div className="text-xs text-slate-400">Coba ubah kata kunci atau hapus filter.</div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const rowNum = (currentPage - 1) * itemsPerPage + idx + 1;
                const isRed = row.statusNac === "TERDETEKSI_NAC" || Boolean(row.catatanNac && row.statusNac !== "GREY_AREA");
                const isGrey = row.statusNac === "GREY_AREA" || Boolean(row.catatanNac && row.catatanNac.toLowerCase().includes("grey"));
                return (
                  <tr key={row.id} className={`transition-colors group ${isRed ? "bg-rose-50/30 hover:bg-rose-50/60" : isGrey ? "bg-slate-100/40 hover:bg-slate-100/70" : "hover:bg-slate-50/80"}`}>
                    <td className="py-3 px-2 text-center font-semibold text-slate-500 text-xs">
                      {rowNum}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-slate-600 font-medium whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1 text-[11px]">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formatTanggalInput(row.createdAt || row.tanggalAwal)}</span>
                      </div>
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
                        className={`inline-block px-2 py-1 rounded-md text-[11px] leading-tight whitespace-normal break-words max-w-[130px] ${getJenisBiayaBadge(
                          row.jenisBiaya
                        )}`}
                      >
                        {row.jenisBiaya}
                      </span>
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-slate-600 font-medium whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1 text-[11px]">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formatTanggal2Digit(row.tanggalAwal)}</span>
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

                    <td className="py-3 px-2 sm:px-3 text-xs">
                      <div className="font-bold text-slate-700">{row.createdByUsername || "-"}</div>
                      <div className="text-[10px] text-slate-400">{row.createdByRole || "-"}</div>
                    </td>

                    {/* Status NAC Column */}
                    <td className="py-3 px-2 sm:px-3 text-xs">
                      {isRed ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-[10px] border border-rose-300">
                            ● TERDETEKSI NAC (MERAH)
                          </span>
                          {row.catatanNac && (
                            <div className="text-[10px] font-bold text-rose-700 max-w-xs leading-tight" title={row.catatanNac}>
                              Penyebab: {row.catatanNac}
                            </div>
                          )}
                        </div>
                      ) : isGrey ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-black text-[10px] border border-slate-300">
                            ● GREY AREA (ABU-ABU)
                          </span>
                          {row.catatanNac && (
                            <div className="text-[10px] font-bold text-slate-600 max-w-xs leading-tight" title={row.catatanNac}>
                              Penyebab: {row.catatanNac}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] border border-emerald-300">
                          ● AMAN (HIJAU)
                        </span>
                      )}
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
                        {onDeleteItem && (
                          <button
                            onClick={() => onDeleteItem(row.id)}
                            className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white flex items-center justify-center transition-all shadow-2xs"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}

          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-xs text-slate-500">
        <div className="font-semibold text-slate-600">
          Menampilkan <span className="text-slate-900 font-bold">{filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredData.length)}</span> dari <span className="text-slate-900 font-bold">{filteredData.length}</span> data kegiatan
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
                    className={`w-8 h-8 rounded-xl font-extrabold flex items-center justify-center transition-all ${currentPage === page
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
    </div>
  );
};
