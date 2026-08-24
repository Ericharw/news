"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

export interface JenisBiayaOption {
  nama: string;
  singkatan?: string;
  keterangan?: string;
}

interface JenisBiayaSearchableSelectProps {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

const DEFAULT_OPTIONS: JenisBiayaOption[] = [
  { nama: "Perjalanan Dinas", singkatan: "PERDIN" },
  { nama: "Konsumsi", singkatan: "KONS" },
  { nama: "Akomodasi", singkatan: "AKOM" },
  { nama: "Amortisasi", singkatan: "AMOR" },
  { nama: "Iuran", singkatan: "IURAN" },
  { nama: "Pajak", singkatan: "PAJAK" },
  { nama: "Cetak", singkatan: "CETAK" },
  { nama: "ATK", singkatan: "ATK" },
  { nama: "Bank", singkatan: "BANK" },
  { nama: "5.2 SARANA", singkatan: "SBO" },
];

export const JenisBiayaSearchableSelect: React.FC<JenisBiayaSearchableSelectProps> = ({
  value,
  onChange,
  required = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<JenisBiayaOption[]>(DEFAULT_OPTIONS);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch live options from PostgreSQL master API
  useEffect(() => {
    async function loadJenisBiaya() {
      try {
        const res = await fetch("/api/master/jenis-biaya");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: JenisBiayaOption[] = json.data.map(
            (item: { nama: string; keterangan?: string; singkatan?: string }) => ({
              nama: item.nama,
              singkatan: item.singkatan || item.keterangan || "",
            })
          );
          setOptions(mapped);
        }
      } catch (err) {
        console.error("Error loading master jenis biaya:", err);
      }
    }
    loadJenisBiaya();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(
    (opt) =>
      (opt?.nama || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opt?.singkatan || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (opt: JenisBiayaOption) => {
    onChange(opt.nama);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button / Display Input */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 bg-slate-50/70 border ${
          isOpen ? "border-[#00A3E0] ring-2 ring-[#00A3E0]/20 bg-white" : "border-slate-200"
        } rounded-xl text-slate-800 text-xs sm:text-sm font-medium flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all`}
      >
        <span className={value ? "text-slate-900 font-extrabold" : "text-slate-400 font-normal"}>
          {value || "-- Pilih atau cari Jenis Biaya --"}
        </span>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60 transition-all"
              title="Hapus pilihan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#0072CE]" : ""
            }`}
          />
        </div>
      </div>

      {/* Hidden input to satisfy HTML form validation if required */}
      {required && (
        <input
          type="text"
          value={value}
          onChange={() => {}}
          required
          tabIndex={-1}
          className="opacity-0 absolute inset-0 pointer-events-none h-0 w-0"
        />
      )}

      {/* Floating Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 border-t-4 border-t-[#0072CE]">
          {/* Search Box */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#0072CE] shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari Jenis Biaya / Kode (misal: Perjalanan, Konsumsi, LAB)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-slate-100/60">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = value === opt.nama;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#0072CE] text-white font-bold"
                        : "text-slate-700 hover:bg-sky-50 hover:text-[#0072CE]"
                    }`}
                  >
                    <span className="truncate pr-2">{opt.nama}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.singkatan && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-amber-100 text-amber-900 border border-amber-200"
                          }`}
                        >
                          {opt.singkatan}
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 font-medium">
                Tidak ditemukan jenis biaya yang sesuai dengan &quot;{searchTerm}&quot;.
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-bold flex items-center justify-between">
            <span>{filteredOptions.length} Jenis Biaya Tersedia</span>
            <span className="text-[#0072CE]">Database NEWS Sync</span>
          </div>
        </div>
      )}
    </div>
  );
};
