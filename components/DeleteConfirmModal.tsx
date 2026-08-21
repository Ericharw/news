"use client";

import React from "react";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  deletingId: number | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  deletingId,
  onCancel,
  onConfirm
}) => {
  if (deletingId === null) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center transform scale-100 transition-all">
        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-xs">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900">Konfirmasi Hapus Data</h3>
        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
          Apakah Anda yakin ingin menghapus data kegiatan ini secara permanen dari sistem PT PLN (Persero)?
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onCancel}
            className="w-1/2 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-50 transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
