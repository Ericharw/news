"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import { PROGRAM_OPTIONS, ProgramOption } from "@/data/programOptions";

interface ProgramSearchableSelectProps {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

export const ProgramSearchableSelect: React.FC<ProgramSearchableSelectProps> = ({
  value,
  onChange,
  required = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<ProgramOption[]>(PROGRAM_OPTIONS);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch live options from PostgreSQL master API
  useEffect(() => {
    async function loadPrograms() {
      try {
        const res = await fetch("/api/master/programs");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setOptions(json.data.map((item: { label: string; code: string }) => ({ label: item.label, code: item.code })));
        }
      } catch (err) {
        console.error("Error loading master programs:", err);
      }
    }
    loadPrograms();
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
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (opt: ProgramOption) => {
    onChange(opt.label);
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
          {value || "-- Pilih atau cari Nama Program --"}
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
              placeholder="Cari Nama Program / Singkatan (misal: PURNA, KPM, DIST)..."
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
                const isSelected = value === opt.label;
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
                    <span className="truncate pr-2">{opt.label}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {opt.code}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 font-medium">
                Tidak ditemukan program yang sesuai dengan &quot;{searchTerm}&quot;.
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-bold flex items-center justify-between">
            <span>{filteredOptions.length} Program Tersedia</span>
            <span className="text-[#0072CE]">PostgreSQL NEWS Sync</span>
          </div>
        </div>
      )}
    </div>
  );
};
