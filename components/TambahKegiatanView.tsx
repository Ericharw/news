"use client";

import React from "react";
import { ArrowLeft, FileSpreadsheet, CheckCircle2, ShieldAlert, HelpCircle } from "lucide-react";
import { ActivityForm } from "@/components/ActivityForm";
import { ActivityFormValues } from "@/types/activity";

interface TambahKegiatanViewProps {
  formValues: ActivityFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<ActivityFormValues>>;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  onBackToData: () => void;
  isValidating?: boolean;
}

export const TambahKegiatanView: React.FC<TambahKegiatanViewProps> = ({
  formValues,
  setFormValues,
  onSubmit,
  onReset,
  onBackToData,
  isValidating = false
}) => {
  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <button
            onClick={onBackToData}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0072CE] hover:text-[#005bb5] mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Data Kegiatan</span>
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Formulir Pendaftaran Kegiatan & Diklat
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Lengkapi data di bawah ini untuk mendaftarkan program pelatihan baru ke sistem PT PLN (Persero).
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <FileSpreadsheet className="w-4 h-4 text-[#FFC72C] fill-[#FFC72C]" />
          <span>Format Standar Diklat PLN</span>
        </div>
      </div>

      {/* Grid Layout: Main Form & Help Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Form Card (7 or 8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <ActivityForm
            formValues={formValues}
            setFormValues={setFormValues}
            onSubmit={onSubmit}
            onReset={onReset}
            isValidating={isValidating}
            requiredObject
          />
        </div>

        {/* Right Help & Guidance Panel (5 or 4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* Guidelines Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm mb-3">
              <CheckCircle2 className="w-4 h-4 text-[#0072CE]" />
              <span>Petunjuk Pengisian Form</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0072CE] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-slate-800">Nama Program:</strong> Tuliskan nama program pelatihan yang sesuai.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0072CE] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-slate-800">Subjek Kegiatan:</strong> Isi nama orang, mitra, atau pihak ketiga pelaksana.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0072CE] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-slate-800">Jenis Biaya:</strong> Pilih salah satu dari Perjalanan Dinas, Konsumsi, atau Akomodasi.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0072CE] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-slate-800">Tanggal / Batch:</strong> Masukkan tanggal pelaksanaan & nomor batch/gelombang (bisa pilih via kalender atau ketik manual).
                </span>
              </li>
            </ul>
          </div>

          {/* Alert Note */}
          <div className="bg-sky-50/80 rounded-2xl border border-sky-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2 text-[#0072CE] font-extrabold text-sm mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Validasi Data Internal</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Seluruh data kegiatan yang disimpan akan masuk ke dalam rekapitulasi laporan anggaran divisi SDM & Diklat PT PLN (Persero).
            </p>
          </div>

          {/* Help Contact */}
          <div className="bg-amber-50/60 rounded-2xl border border-amber-200/60 p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Butuh Bantuan SIM Diklat?</span>
            </div>
            <span className="text-amber-800 font-extrabold underline cursor-pointer">Kontak IT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
