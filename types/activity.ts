export type JenisBiayaType = "Perjalanan Dinas" | "Konsumsi" | "Akomodasi" | string;

export interface ActivityItem {
  no: number;
  id: number;
  namaProgram: string;
  subjekKegiatan: string;
  jenisBiaya: JenisBiayaType;
  objekKegiatan?: string;
  tanggalAwal: string;
  batch: string;
}

export interface ActivityFormValues {
  namaProgram: string;
  subjekKegiatan: string;
  jenisBiaya: string;
  objekKegiatan: string;
  tanggalAwal: string;
  batch: string;
}

export interface MasterProgramItem {
  id: number;
  label: string;
  code: string;
}

export interface MasterKeywordItem {
  id: number;
  keyword: string;
  kategoriTransaksi: string;
}

export interface MasterJenisBiayaItem {
  id: number;
  nama: string;
  keterangan?: string;
}

export type UserRole = "admin" | "user";

export type ActiveMenuType =
  | "data-kegiatan"
  | "tambah-kegiatan"
  | "master-program"
  | "master-keyword"
  | "master-jenis-biaya"
  | "user-form";

