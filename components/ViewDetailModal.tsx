"use client";

import React from "react";
import { X, Calendar, Tag, FileText, CheckCircle2 } from "lucide-react";
import { ActivityItem } from "@/types/activity";

interface ViewDetailModalProps {
  item: ActivityItem | null;
  onClose: () => void;
}

export const ViewDetailModal: React.FC<ViewDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

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
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 transform scale-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
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

          <div className="pt-2">
            <div className="bg-sky-50/60 p-3.5 rounded-xl border border-sky-100">
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Tanggal
              </span>
              <div className="text-slate-900 font-extrabold text-sm mt-0.5">{item.tanggalAwal}</div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0072CE] hover:bg-[#005bb5] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all"
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
};
