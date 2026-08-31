import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertTriangle, ArrowLeft, Send, ShieldAlert, HelpCircle, Copy, Download, Check } from "lucide-react";
import { ActivityFormValues } from "@/types/activity";
import Swal from "sweetalert2";
import { PROGRAM_OPTIONS } from "@/data/programOptions";

interface DetectedKeywordInfo {
  keyword: string;
  field: string;
  category: string;
  ringkasan?: string;
}

interface ValidationPreviewModalProps {
  isOpen: boolean;
  isSafe: boolean;
  detectedKeywords: DetectedKeywordInfo[];
  detectedGreyAreas?: DetectedKeywordInfo[];
  formValues: ActivityFormValues;
  onClose: () => void;
  onConfirmSubmit: () => void | Promise<boolean>;
  isSubmitting?: boolean;
  showSubmittedSummary?: boolean;
}

const formatTanggal2Digit = (tanggal: string) => {
  if (!tanggal) return "";
  if (/^\d{2}\/\d{2}\/\d{4}/.test(tanggal)) {
    return tanggal.replace(/(\d{2}\/\d{2}\/)\d{2}(\d{2})/, "$1$2");
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(tanggal)) {
    const [y, m, d] = tanggal.split("-");
    return `${d}/${m}/${y.slice(-2)}`;
  }
  return tanggal.replace(/\b20(\d{2})\b/g, "$1");
};

const getSingkatanProgram = (namaProgram: string) => {
  if (!namaProgram) return "";
  const match = PROGRAM_OPTIONS.find(
    (program) =>
      program.label.toLowerCase() === namaProgram.toLowerCase() ||
      program.code.toLowerCase() === namaProgram.toLowerCase() ||
      namaProgram.includes(`(${program.code})`)
  );
  if (match) return match.code;
  const words = namaProgram.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].substring(0, 5).toUpperCase();
  return words.map((w) => w[0].toUpperCase()).join("");
};

const getSingkatanJenisBiaya = (jenis: string, masterMap: Record<string, string>): string => {
  if (!jenis) return "";
  const rawTrimmed = jenis.trim();
  const lowerKey = rawTrimmed.toLowerCase();
  if (masterMap[lowerKey]) return masterMap[lowerKey].toUpperCase();
  const foundEntry = Object.entries(masterMap).find(([key]) => lowerKey.includes(key) || key.includes(lowerKey));
  if (foundEntry && foundEntry[1]) return foundEntry[1].toUpperCase();
  const trimmed = rawTrimmed.toUpperCase();
  if (trimmed.includes("PERJALANAN") || trimmed === "PD" || trimmed.includes("PERDIN")) return "PERDIN";
  if (trimmed.includes("AKOMODASI") || trimmed === "AKM" || trimmed.includes("AKOM")) return "AKOM";
  if (trimmed.includes("KONSUM") || trimmed.includes("KONS")) return "KONS";
  if (trimmed.includes("AMORTISASI") || trimmed.includes("AMOR")) return "AMOR";
  if (trimmed.includes("PAJAK") || trimmed.includes("RETRIBUSI")) return "PAJAK";
  if (trimmed.includes("IURAN")) return "IURAN";
  if (trimmed.includes("CETAK")) return "CETAK";
  if (trimmed.includes("ATK")) return "ATK";
  if (trimmed.includes("BANK")) return "BANK";
  if (trimmed.includes("SARANA") || trimmed.includes("SARJAR")) return "SARANA";
  if (/^[A-Z0-9\s-]{2,8}$/.test(jenis.trim())) return jenis.trim().toUpperCase();
  const clean = trimmed.replace(/^[0-9.]+\s*/, "");
  return clean.length > 8 ? clean.substring(0, 6) : clean;
};

const buildRingkasan = (formValues: ActivityFormValues, masterMap: Record<string, string>): string => {
  const progCode = getSingkatanProgram(formValues.namaProgram || "");
  const subjek = formValues.subjekKegiatan || "";
  const objek = formValues.objekKegiatan || "";
  const jbCode = getSingkatanJenisBiaya(formValues.jenisBiaya || "", masterMap);
  const tgl = formatTanggal2Digit(formValues.tanggalAwal || "");
  return objek
    ? `${progCode}/${subjek}/${objek}/${jbCode}/${tgl}`
    : `${progCode}/${subjek}/${jbCode}/${tgl}`;
};

export const ValidationPreviewModal: React.FC<ValidationPreviewModalProps> = ({
  isOpen,
  isSafe,
  detectedKeywords,
  detectedGreyAreas = [],
  formValues,
  onClose,
  onConfirmSubmit,
  isSubmitting = false,
  showSubmittedSummary = false
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [masterJenisBiayaMap, setMasterJenisBiayaMap] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [submittedSummary, setSubmittedSummary] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/master/jenis-biaya")
      .then((response) => response.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          const map: Record<string, string> = {};
          result.data.forEach((item: { nama: string; keterangan?: string; singkatan?: string }) => {
            if (item.nama && (item.singkatan || item.keterangan)) {
              map[item.nama.toLowerCase().trim()] = (item.singkatan || item.keterangan || "").trim();
            }
          });
          setMasterJenisBiayaMap(map);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    }
  }, [saved]);

  useEffect(() => {
    if (!isOpen) {
      setShowSummary(false);
      setSubmittedSummary("");
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasRed = detectedKeywords.length > 0 || formValues.statusNac === "TERDETEKSI_NAC";
  const hasGrey = detectedGreyAreas.length > 0 || formValues.statusNac === "GREY_AREA";
  const ringkasan = buildRingkasan(formValues, masterJenisBiayaMap);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ringkasan);
      setCopied(true);
    } catch {
      const el = document.createElement("textarea");
      el.value = ringkasan;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
    }
  };

  const handleSave = () => {
    const blob = new Blob([ringkasan], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Ringkasan_${(formValues.namaProgram || "Kegiatan").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSaved(true);
  };

  if (isSubmitted && showSubmittedSummary) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100">
          <div className="bg-gradient-to-r from-[#003B70] to-[#0072CE] rounded-2xl p-4 sm:p-5 border border-[#00A3E0]/30 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold text-[#FFC72C] uppercase tracking-wider flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FFC72C]" />
                Ringkasan Isi Form
              </span>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2.5 mb-3 border border-white/20">
              <p className="text-white font-black text-sm sm:text-base tracking-wide break-all leading-relaxed select-all">
                {submittedSummary || ringkasan}
              </p>
            </div>
            <p className="text-sky-200 text-[10px] font-medium mb-3 leading-relaxed">
              Silakan salin ringkasan ini sebagai bukti input kegiatan, lalu tekan OK untuk menutup.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-xs ${copied ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white/20 hover:bg-white/30 border-white/30 text-white"}`}
              >
                {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Tersalin!" : "Salin Ringkasan"}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FFC72C] hover:bg-[#F2B81A] border border-amber-300 text-slate-900 shadow-xs transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>OK</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-100 transform scale-100 transition-all">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0072CE] to-[#00A3E0] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#0072CE] uppercase tracking-wider">
                NEWS {String.fromCharCode(8226)} Validation System
              </span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                RINGKASAN DATA KEGIATAN
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ringkasan Data Fields */}
        <div className="mt-5 bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3 text-xs sm:text-sm font-medium">
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 font-bold text-slate-500 uppercase text-[11px]">Nama Program</span>
            <span className="col-span-8 font-black text-slate-900">: {formValues.namaProgram || "-"}</span>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 font-bold text-slate-500 uppercase text-[11px]">Subjek Kegiatan</span>
            <span className="col-span-8 font-bold text-slate-800">: {formValues.subjekKegiatan || "-"}</span>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 font-bold text-slate-500 uppercase text-[11px]">Jenis Biaya</span>
            <span className="col-span-8 font-bold text-[#0072CE]">: {formValues.jenisBiaya || "-"}</span>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 font-bold text-slate-500 uppercase text-[11px]">Objek Kegiatan</span>
            <span className="col-span-8 font-extrabold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
              : {formValues.objekKegiatan || formValues.subjekKegiatan || "-"}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 font-bold text-slate-500 uppercase text-[11px]">Tanggal</span>
            <span className="col-span-8 font-bold text-slate-700">
              : {formatTanggal2Digit(formValues.tanggalAwal || "20/08/2026")}
            </span>
          </div>
        </div>

        {/* RINGKASAN ISI FORM (Singkatan Format) */}
        {showSummary && <div className="mt-4 bg-gradient-to-r from-[#003B70] to-[#0072CE] rounded-2xl p-4 sm:p-5 border border-[#00A3E0]/30 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-extrabold text-[#FFC72C] uppercase tracking-wider flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FFC72C]"></span>
              Ringkasan Isi Form
            </span>
          </div>

          <div className="bg-white/10 rounded-xl px-3 py-2.5 mb-3 border border-white/20">
            <p className="text-white font-black text-sm sm:text-base tracking-wide break-all leading-relaxed select-all">
              {submittedSummary || ringkasan}
            </p>
          </div>

          <p className="text-sky-200 text-[10px] font-medium mb-3 leading-relaxed">
            Format: <span className="text-white font-bold">PROGRAM / SUBJEK / OBJEK / JENIS BIAYA / TANGGAL</span>. Salin atau simpan ringkasan ini sebagai referensi.
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-xs ${
                copied
                  ? "bg-emerald-500 border-emerald-400 text-white"
                  : "bg-white/20 hover:bg-white/30 border-white/30 text-white"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Tersalin!" : "Salin Ringkasan"}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-xs ${
                saved
                  ? "bg-emerald-500 border-emerald-400 text-white"
                  : "bg-[#FFC72C] hover:bg-[#F2B81A] border-amber-300 text-slate-900"
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Download className="w-3.5 h-3.5" />}
              <span>{saved ? "Tersimpan!" : "Simpan (.txt)"}</span>
            </button>

            {copied && (
              <button
                type="button"
                onClick={() => setCopied(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 shadow-xs transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>OK</span>
              </button>
            )}
          </div>
        </div>}

        {/* Dynamic Decision Status Box */}
        <div className="mt-5 space-y-4">
          {hasRed && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-rose-950 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 font-black text-sm text-rose-700">
                <AlertTriangle className="w-5 h-5 shrink-0 stroke-[2.5]" />
                <span>[ INDIKASI NAC TERDETEKSI - STATUS MERAH ]</span>
              </div>
              <p className="text-xs font-semibold text-rose-900 leading-relaxed">
                Sistem mendeteksi adanya kata kunci <strong>Non-Allowable Cost (NAC)</strong>. Data tetap dapat disimpan ke sistem dan akan ditandai dengan badge <strong>MERAH</strong> serta catatan alasannya.
              </p>
              <div className="bg-white/90 p-3 rounded-xl border border-rose-200 space-y-1.5 text-xs">
                {detectedKeywords.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 font-extrabold text-rose-700">
                    <span>•</span>
                    <span>
                      Penyebab Merah: Kata <span className="underline bg-rose-100 px-1 rounded text-rose-950">&quot;{item.keyword}&quot;</span> pada <strong>{item.field}</strong> <span className="text-rose-900 font-semibold">({item.category})</span>.
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-medium text-rose-800 pt-1">
                Anda dapat memilih untuk membenahi data atau memilih <strong>TETAP SUBMIT DATA</strong>.
              </p>
            </div>
          )}

          {hasGrey && (
            <div className="bg-slate-100 border-2 border-slate-300 rounded-2xl p-5 text-slate-900 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 font-black text-sm text-slate-800">
                <HelpCircle className="w-5 h-5 shrink-0 stroke-[2.5] text-slate-700" />
                <span>[ INDIKASI GREY AREA TERDETEKSI - STATUS GREY ]</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                Sistem mendeteksi adanya transaksi <strong>Grey Area</strong>. Keterangan: {detectedGreyAreas.map((item) => item.ringkasan).filter(Boolean).join("; ") || "Sesuai keterangan pada master Grey Area."} Data dapat disimpan ke dalam sistem dan akan ditandai dengan catatan alasannya.
              </p>
              <div className="bg-white/90 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                {detectedGreyAreas.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 font-extrabold text-slate-800">
                    <span>•</span>
                    <span>
                      Penyebab: <span className="text-slate-600 font-semibold">[Grey Area]</span> Transaksi <span className="underline bg-slate-100 px-1 rounded text-slate-950">&quot;{item.keyword}&quot;</span> pada <strong>{item.field}</strong>: <span className="text-slate-600 font-semibold">{item.ringkasan || item.category || "Grey Area"}</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-medium text-slate-600 pt-1">
                Anda dapat memilih untuk membenahi data atau memilih <strong>TETAP SUBMIT DATA</strong>.
              </p>
            </div>
          )}

          {!hasRed && !hasGrey && (
            <div className="bg-[#ECFDF5] border-2 border-emerald-400 rounded-2xl p-5 text-emerald-950 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 shrink-0 stroke-[2.5] text-emerald-600" />
                <span>[ DATA AMAN - STATUS HIJAU ]</span>
              </div>
              <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
                Tidak ditemukan keyword indikasi <strong>Non-Allowable Cost (NAC)</strong> maupun <strong>Grey Area</strong>. Data siap untuk disimpan ke dalam sistem dengan badge <strong>HIJAU (AMAN)</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 sticky bottom-0 bg-white pb-1 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI &amp; EDIT</span>
          </button>

          <button
            onClick={async () => {
              const submitted = await onConfirmSubmit();
              if (submitted !== false) {
                if (showSubmittedSummary) {
                  setSubmittedSummary(ringkasan);
                  setShowSummary(true);
                  setIsSubmitted(true);
                } else {
                  await Swal.fire({
                    icon: "success",
                    title: "Ringkasan Isi Form",
                    text: ringkasan,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#0072CE",
                  });
                }
              }
            }}
            disabled={isSubmitting || isSubmitted}
            className={`w-full sm:w-auto px-6 py-2.5 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
              hasRed
                ? "bg-rose-600 hover:bg-rose-700 text-white border border-rose-500"
                : hasGrey
                ? "bg-slate-800 hover:bg-slate-900 text-white border border-slate-700"
                : "bg-[#FFC72C] hover:bg-[#F2B81A] text-slate-950 border border-amber-300"
            }`}
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>
              {isSubmitting
                ? "MENYIMPAN DATA..."
                : hasRed
                ? "TETAP SUBMIT DATA (STATUS MERAH)"
                : hasGrey
                ? "TETAP SUBMIT DATA (STATUS GREY)"
                : "SUBMIT DATA SEKARANG"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
