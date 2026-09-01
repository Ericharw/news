"use client";

import React, { useState, useEffect } from "react";

import { X, Calendar, Tag, FileText, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, Copy, Check, FileCode2 } from "lucide-react";
import { ActivityItem } from "@/types/activity";
import { PROGRAM_OPTIONS } from "@/data/programOptions";

interface ViewDetailModalProps {
  item: ActivityItem | null;
  onClose: () => void;
}

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

const getSingkatanProgram = (namaProgram: string) => {
  if (!namaProgram) return "";
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

const getSingkatanJenisBiaya = (jenis: string, masterMap: Record<string, string> = {}): string => {
  if (!jenis) return "";
  const rawTrimmed = jenis.trim();
  const lowerKey = rawTrimmed.toLowerCase();

  if (masterMap[lowerKey]) {
    return masterMap[lowerKey].toUpperCase();
  }

  const foundEntry = Object.entries(masterMap).find(
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

const getRingkasanSingkatan = (item: ActivityItem, masterMap: Record<string, string> = {}) => {
  const progCode = getSingkatanProgram(item.namaProgram);
  const subjekCode = item.subjekKegiatan || "";
  const objekText = item.objekKegiatan || "";
  const jbCode = getSingkatanJenisBiaya(item.jenisBiaya, masterMap);
  const tglShort = formatTanggal2Digit(item.tanggalAwal);

  const fullStr = objekText
    ? `${progCode}-${subjekCode}-${objekText}-${jbCode}-${tglShort}`
    : `${progCode}-${subjekCode}-${jbCode}-${tglShort}`;

  return fullStr;
};

export const ViewDetailModal: React.FC<ViewDetailModalProps> = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [masterJenisBiayaMap, setMasterJenisBiayaMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadMasterJenisBiaya() {
      try {
        const res = await fetch("/api/master/jenis-biaya");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const map: Record<string, string> = {};
          json.data.forEach((entry: { nama: string; keterangan?: string }) => {
            if (entry.nama && entry.keterangan) {
              map[entry.nama.toLowerCase().trim()] = entry.keterangan.trim();
            }
          });
          setMasterJenisBiayaMap(map);
        }
      } catch (err) {
        console.error("Error loading master jenis biaya in modal:", err);
      }
    }
    loadMasterJenisBiaya();
  }, []);

  if (!item) return null;

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
          const cleanClause = clause.replace(/^Kata\s+/i, "Transaksi ");
          greyClauses.push(cleanClause);
        } else {
          redClauses.push(clause);
        }
      }

      if (redClauses.length > 0) {
        redNoteText = redClauses.join("; ");
      }
      if (greyClauses.length > 0) {
        greyNoteText = greyClauses.join("; ");
      }
      if (redClauses.length === 0 && greyClauses.length === 0) {
        if (item.statusNac === "GREY_AREA") {
          greyNoteText = item.catatanNac;
        } else {
          redNoteText = item.catatanNac;
        }
      }
    }
  }

  const hasRedNotes = Boolean(redNoteText) || (item.statusNac === "TERDETEKSI_NAC" && !greyNoteText);
  const hasGreyNotes = Boolean(greyNoteText) || item.statusNac === "GREY_AREA";

  const rawInput = (item.tanggalAwal || "").trim();
  const formattedDate = formatTanggal2Digit(rawInput);

  const hasDate = /\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2}\s+(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)/i.test(rawInput);
  const hasBatchKeyword = /batch|gelombang/i.test(rawInput) || (Boolean(item.batch) && item.batch !== "Batch 1" && !rawInput.toLowerCase().includes(item.batch.toLowerCase()));

  let labelText = "Tanggal & Batch";
  let displayValue = formattedDate;

  if (hasDate && hasBatchKeyword) {
    labelText = "Tanggal & Batch";
    displayValue = rawInput.toLowerCase().includes(item.batch?.toLowerCase() || "")
      ? formattedDate
      : `${formattedDate} (${item.batch})`;
  } else if (hasDate) {
    labelText = "Tanggal";
    displayValue = formattedDate;
  } else if (hasBatchKeyword) {
    labelText = "Batch";
    displayValue = rawInput || item.batch || "Batch 1";
  } else {
    labelText = "Tanggal";
    displayValue = formattedDate || rawInput;
  }

  const ringkasanText = getRingkasanSingkatan(item, masterJenisBiayaMap);

  const handleCopyRingkasan = () => {
    if (!ringkasanText) return;
    navigator.clipboard.writeText(ringkasanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getJenisBiayaBadge = (jenis: string) => {
    switch (jenis) {
      case "Perjalanan Dinas":
        return "bg-sky-50 text-[#0072CE] border border-sky-200 font-bold";
      case "Konsumsi":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold";
      case "Akomodasi":
        return "bg-amber-50 text-amber-800 border border-amber-200 font-bold";
      default:
        return "bg-slate-100 text-slate-700 font-semibold";
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-100 transform scale-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0072CE] flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detail Kegiatan PLN</span>
              <h3 className="text-base font-extrabold text-slate-900">Rincian Informasi</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-4 text-xs sm:text-sm">
          {/* Status Banner Container */}
          <div className="space-y-3">
            {hasRedNotes && (
              <div className="p-4 rounded-2xl border bg-rose-50 border-rose-300 text-rose-950">
                <div className="flex items-center gap-2 font-black text-xs sm:text-sm mb-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-rose-700">STATUS: TERDETEKSI NAC (MERAH)</span>
                </div>
                <div className="mt-2 text-xs bg-white/90 p-3 rounded-xl border border-rose-200 space-y-1">
                  <div className="font-extrabold text-rose-800 uppercase text-[10px] tracking-wider">
                    Penyebab Merah / Temuan NAC:
                  </div>
                  <div className="font-bold text-rose-900 leading-relaxed">
                    {redNoteText || item.catatanNac || "Terdeteksi indikasi kata kunci Non-Allowable Cost."}
                  </div>
                </div>
              </div>
            )}

            {hasGreyNotes && (
              <div className="p-4 rounded-2xl border bg-slate-100 border-slate-300 text-slate-900">
                <div className="flex items-center gap-2 font-black text-xs sm:text-sm mb-1">
                  <HelpCircle className="w-4 h-4 text-slate-700 shrink-0" />
                  <span className="text-slate-800">STATUS: GREY AREA (ABU-ABU)</span>
                </div>
                <div className="mt-2 text-xs bg-white/90 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-extrabold text-slate-700 uppercase text-[10px] tracking-wider">
                    Penyebab Grey Area:
                  </div>
                  <div className="font-bold text-slate-800 leading-relaxed">
                    {greyNoteText || item.catatanNac || "Terdeteksi transaksi Grey Area sesuai master database."}
                  </div>
                </div>
              </div>
            )}

            {!hasRedNotes && !hasGreyNotes && (
              <div className="p-4 rounded-2xl border bg-emerald-50 border-emerald-300 text-emerald-950">
                <div className="flex items-center gap-2 font-black text-xs sm:text-sm mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-800">STATUS: AMAN (HIJAU)</span>
                </div>
                <div className="text-xs text-emerald-800 font-medium">
                  Tidak ada temuan Non-Allowable Cost maupun Grey Area pada data kegiatan ini.
                </div>
              </div>
            )}
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Nama Program
            </span>
            <div className="font-black text-slate-900 text-lg mt-0.5">{item.namaProgram}</div>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-2xl space-y-3 border border-slate-200/60">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0072CE]" />
                Subjek Kegiatan
              </span>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{item.subjekKegiatan}</div>
            </div>

            <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Jenis Biaya
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs ${getJenisBiayaBadge(item.jenisBiaya)}`}>
                {item.jenisBiaya}
              </span>
            </div>
          </div>

          {item.objekKegiatan && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Objek / Detail Kegiatan Diklat
              </span>
              <div className="text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/50 mt-1">
                {item.objekKegiatan}
              </div>
            </div>
          )}

          <div>
            <div className="bg-sky-50/60 p-3.5 rounded-xl border border-sky-100">
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {labelText}
              </span>
              <div className="text-slate-900 font-extrabold text-sm mt-0.5">
                {displayValue}
              </div>
            </div>
          </div>

          {/* Ringkasan Isi Form */}
          <div>
            <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FileCode2 className="w-3.5 h-3.5 text-[#0072CE]" /> Ringkasan Isi Form
                </span>
                {copied ? (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Tersalin
                  </span>
                ) : (
                  <button
                    onClick={handleCopyRingkasan}
                    className="text-[10px] font-bold text-[#0072CE] hover:text-[#005bb5] hover:underline flex items-center gap-1 cursor-pointer"
                    title="Salin Ringkasan"
                  >
                    <Copy className="w-3 h-3" /> Salin
                  </button>
                )}
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-[#0072CE] break-all select-all shadow-2xs">
                {ringkasanText}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0072CE] hover:bg-[#005bb5] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
};

