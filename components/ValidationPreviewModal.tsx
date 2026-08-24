"use client";

import React from "react";
import { X, CheckCircle2, AlertTriangle, ArrowLeft, Send, ShieldAlert } from "lucide-react";
import { ActivityFormValues } from "@/types/activity";

interface DetectedKeywordInfo {
  keyword: string;
  field: string;
  category: string;
}

interface ValidationPreviewModalProps {
  isOpen: boolean;
  isSafe: boolean;
  detectedKeywords: DetectedKeywordInfo[];
  formValues: ActivityFormValues;
  onClose: () => void;
  onConfirmSubmit: () => void;
  isSubmitting?: boolean;
}

export const ValidationPreviewModal: React.FC<ValidationPreviewModalProps> = ({
  isOpen,
  isSafe,
  detectedKeywords,
  formValues,
  onClose,
  onConfirmSubmit,
  isSubmitting = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 transform scale-100 transition-all">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0072CE] to-[#00A3E0] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#0072CE] uppercase tracking-wider">
                NEWS • NAC Early Warning Validation
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
            <span className="col-span-4 font-bold text-slate-500 uppercase text-[11px]">Tanggal & Batch</span>
            <span className="col-span-8 font-bold text-slate-700">
              : {formValues.tanggalAwal || "20/08/2026"} ({formValues.batch ? (formValues.batch.startsWith("Batch") ? formValues.batch : `Batch ${formValues.batch}`) : "Batch 1"})
            </span>
          </div>
        </div>

        {/* Dynamic Decision Status Box */}
        <div className="mt-5">
          {!isSafe ? (
            /* KONDISI A: DITOLAK / DITAHAN (Kolom Background Merah Muda) */
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-rose-950 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 font-black text-sm text-rose-700">
                <AlertTriangle className="w-5 h-5 shrink-0 stroke-[2.5]" />
                <span>[ PENGAJUAN DITOLAK]</span>
              </div>

              <p className="text-xs font-semibold text-rose-900 leading-relaxed">
                Sistem mendeteksi adanya indikasi <strong>Non-Allowable Cost (NAC)</strong> pada inputan Anda.
              </p>

              <div className="bg-white/80 p-3 rounded-xl border border-rose-200 space-y-1.5 text-xs">
                {detectedKeywords.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 font-extrabold text-rose-700">
                    <span>•</span>
                    <span>
                      Ditemukan kata: <span className="underline bg-rose-100 px-1 rounded text-rose-950">&quot;{item.keyword}&quot;</span> pada bagian <strong className="text-slate-900">{item.field}</strong> <span className="text-rose-900 font-semibold">(Alasan: {item.category})</span>.
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] font-medium text-rose-800 pt-1">
                Silakan perbaiki data Anda atau hubungi admin untuk otorisasi khusus.
              </p>
            </div>
          ) : (
            /* KONDISI B: AMAN (Kolom Background Hijau Muda) */
            <div className="bg-[#ECFDF5] border-2 border-emerald-400 rounded-2xl p-5 text-emerald-950 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 shrink-0 stroke-[2.5] text-emerald-600" />
                <span>[ DATA AMAN ]</span>
              </div>

              <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
                Tidak ditemukan keyword indikasi <strong>Non-Allowable Cost (NAC)</strong>. Data siap untuk disimpan ke dalam sistem PT PLN (Persero).
              </p>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          {!isSafe ? (
            /* Tombol untuk Kondisi Ditolak */
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>KEMBALI & EDIT DATA</span>
            </button>
          ) : (
            /* Tombol untuk Kondisi Aman */
            <>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>KEMBALI & EDIT</span>
              </button>

              <button
                onClick={onConfirmSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#FFC72C] hover:bg-[#F2B81A] text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border border-amber-300 disabled:opacity-50"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>{isSubmitting ? "MENYIMPAN DATA..." : "SUBMIT DATA SEKARANG"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
