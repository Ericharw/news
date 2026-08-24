"use client";

import React from "react";
import {
  CheckCircle2,
  HelpCircle,
  UserCheck,
  AlertCircle
} from "lucide-react";
import { ActivityForm } from "@/components/ActivityForm";
import { ActivityFormValues } from "@/types/activity";

interface UserFormViewProps {
  formValues: ActivityFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<ActivityFormValues>>;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isValidating?: boolean;
}

export const UserFormView: React.FC<UserFormViewProps> = ({
  formValues,
  setFormValues,
  onSubmit,
  onReset,
  isValidating = false
}) => {
  return (
    <div className="space-y-6">
      {/* User Portal Top Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#003B70] via-[#0072CE] to-[#00A3E0] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        {/* Background Decorative Polygons */}
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <svg width="320" height="320" viewBox="0 0 200 200" fill="none">
            <path d="M40 0 L200 160 L160 200 L0 40 Z" fill="#FFFFFF" />
            <path d="M90 0 L200 110 L180 130 L70 0 Z" fill="#FFC72C" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/30 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#FFC72C]" />
              <span>Portal Pegawai PLN</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Formulir Input Kegiatan & Diklat PLN
          </h2>
          <p className="text-sky-100 text-xs sm:text-sm mt-2 leading-relaxed font-medium max-w-2xl">
            Silakan lengkapi form pendaftaran di bawah ini untuk mengajukan kegiatan atau program pelatihan baru. Sistem secara otomatis akan memvalidasi keyword sesuai aturan Non-Allowable Cost (NAC).
          </p>
        </div>
      </div>

      {/* Form & Guidelines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Form Section */}
        <div className="lg:col-span-7 xl:col-span-8">
          <ActivityForm
            formValues={formValues}
            setFormValues={setFormValues}
            onSubmit={onSubmit}
            onReset={onReset}
            isValidating={isValidating}
          />
        </div>

        {/* User Help & Information Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* Directives Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm mb-3 pb-2 border-b border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-[#0072CE]" />
              <span>Petunjuk Input Pegawai</span>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-medium">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#0072CE]/10 text-[#0072CE] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-slate-900 block mb-0.5">Pilih Nama Program</strong>
                  Pilih nama program dari daftar master program PLN yang tersedia.
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#0072CE]/10 text-[#0072CE] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-slate-900 block mb-0.5">Isi Subjek & Objek Kegiatan</strong>
                  Tuliskan nama pelaksanaan / mitra kerja dan deskripsi detail kegiatan diklat.
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#0072CE]/10 text-[#0072CE] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-slate-900 block mb-0.5">Pilih Jenis Biaya</strong>
                  Pilih kategori anggaran (misal: Perjalanan Dinas, Konsumsi, atau Akomodasi).
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block mb-0.5">Pengecekan NAC Otomatis</strong>
                  Kata kunci terlarang (seperti souvenir, doorprize, rekreasi, wisata) akan ditandai oleh sistem.
                </div>
              </div>
            </div>
          </div>

          {/* Support Info Box */}
          <div className="bg-sky-50/80 rounded-2xl border border-sky-200/80 p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <HelpCircle className="w-4 h-4 text-[#0072CE]" />
              <span>Kendala Input Data?</span>
            </div>
            <span className="text-[#0072CE] font-extrabold hover:underline cursor-pointer">
              Bantuan IT PLN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
