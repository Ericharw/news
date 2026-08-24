"use client";

import React from "react";
import { ShieldCheck, Calendar, RotateCcw, PlusCircle } from "lucide-react";
import { ActivityFormValues } from "@/types/activity";
import { ProgramSearchableSelect } from "@/components/ProgramSearchableSelect";
import { JenisBiayaSearchableSelect } from "@/components/JenisBiayaSearchableSelect";

interface ActivityFormProps {
  formValues: ActivityFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<ActivityFormValues>>;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isValidating?: boolean;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  formValues,
  setFormValues,
  onSubmit,
  onReset,
  isValidating = false
}) => {
  const datePickerRef = React.useRef<HTMLInputElement>(null);

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const [year, month, day] = val.split("-");
      if (year && month && day) {
        const formattedDate = `${day}/${month}/${year}`;
        const currentText = formValues.tanggalAwal || "";
        const extraText = currentText.replace(/^\d{2}\/\d{2}\/\d{4}\s*/, "").trim();
        const combined = extraText ? `${formattedDate} ${extraText}` : `${formattedDate} Batch 1`;

        setFormValues({
          ...formValues,
          tanggalAwal: combined,
          batch: extraText || "Batch 1"
        });
      }
    }
  };

  const handleOpenCalendar = () => {
    const el = datePickerRef.current as any;
    if (el) {
      try {
        if (typeof el.showPicker === "function") {
          el.showPicker();
        } else if (typeof el.focus === "function") {
          el.focus();
        }
      } catch {
      }
    }
  };

  return (
    <div
      id="tambah-kegiatan-form"
      className="bg-white rounded-2xl border border-slate-200/90 border-t-4 border-t-[#FFC72C] p-5 md:p-6 shadow-xs sticky top-24 transition-all"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#0072CE]" />
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Tambah Kegiatan
            </h3>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Input data kegiatan baru.
          </p>
        </div>
        <span className="px-2 py-1 bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-200">
          Form PLN (NEWS)
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* Nama Program (Searchable Dropdown) */}
        <div>
          <label className="block font-bold text-slate-800 mb-1.5">
            Nama Program <span className="text-rose-500">*</span>
          </label>
          <ProgramSearchableSelect
            value={formValues.namaProgram}
            onChange={(val) => setFormValues({ ...formValues, namaProgram: val })}
            required
          />
        </div>

        {/* Subjek Kegiatan */}
        <div>
          <label className="block font-bold text-slate-800 mb-1.5">
            Subjek Kegiatan (Mitra/Pihak Ke-3) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Ericha Rizki"
            value={formValues.subjekKegiatan}
            onChange={(e) => setFormValues({ ...formValues, subjekKegiatan: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white placeholder:text-slate-400 transition-all text-xs sm:text-sm font-medium"
          />
        </div>

        {/* Jenis Biaya (Searchable Dropdown) */}
        <div>
          <label className="block font-bold text-slate-800 mb-1.5">
            Jenis Biaya <span className="text-rose-500">*</span>
          </label>
          <JenisBiayaSearchableSelect
            value={formValues.jenisBiaya}
            onChange={(val) => setFormValues({ ...formValues, jenisBiaya: val })}
            required
          />
        </div>

        {/* Objek Kegiatan */}
        <div>
          <label className="block font-bold text-slate-800 mb-1.5">
            Objek Kegiatan (Judul Diklat)
          </label>
          <textarea
            rows={3}
            placeholder="Contoh: ENTREPRENEUR-LAUNDRY atau Analisa Vibrasi 1"
            value={formValues.objekKegiatan}
            onChange={(e) => setFormValues({ ...formValues, objekKegiatan: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white placeholder:text-slate-400 transition-all text-xs sm:text-sm font-medium resize-none"
          />
        </div>

        {/* Single Combined Input Field: Tanggal / Batch */}
        <div>
          <label className="block font-bold text-slate-800 mb-1.5">
            Tanggal / Batch <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            {/* Free Text Manual Input */}
            <input
              type="text"
              required
              placeholder="Contoh: 20/08/2026 Batch 1 atau ketik manual..."
              value={
                formValues.tanggalAwal && formValues.batch && !formValues.tanggalAwal.includes(formValues.batch) && formValues.batch !== "Batch 1"
                  ? `${formValues.tanggalAwal} ${formValues.batch}`
                  : formValues.tanggalAwal || ""
              }
              onChange={(e) => {
                const val = e.target.value;
                setFormValues({
                  ...formValues,
                  tanggalAwal: val,
                  batch: val ? (val.includes("Batch") ? val : `Batch 1`) : "Batch 1"
                });
              }}
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white placeholder:text-slate-400 transition-all text-xs sm:text-sm font-medium"
            />

            {/* Clickable Calendar Picker Icon Button */}
            <button
              type="button"
              onClick={handleOpenCalendar}
              className="absolute right-1.5 p-1.5 text-slate-400 hover:text-[#0072CE] hover:bg-sky-50 rounded-lg transition-all cursor-pointer"
              title="Buka Kalender"
            >
              <Calendar className="w-4.5 h-4.5 text-slate-500 hover:text-[#0072CE]" />
            </button>

            {/* Hidden Native Date Input for Calendar Picker */}
            <input
              ref={datePickerRef}
              type="date"
              onChange={handleDatePickerChange}
              className="opacity-0 absolute right-0 bottom-0 pointer-events-none w-0 h-0"
              tabIndex={-1}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs sm:text-sm hover:bg-slate-100 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="submit"
            disabled={isValidating}
            className="px-5 py-2.5 bg-[#0072CE] hover:bg-[#005bb5] text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border border-[#00A3E0]/30 disabled:opacity-50"
          >
            <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>{isValidating ? "Mengecek NAC..." : "Cek Data & Preview"}</span>
          </button>
        </div>

        <div className="pt-1 text-slate-400 text-[11px] font-medium">
          <span className="text-rose-500 font-bold">*</span> Kolom wajib diisi. Data akan divalidasi oleh sistem NEWS sebelum submit.
        </div>
      </form>
    </div>
  );
};